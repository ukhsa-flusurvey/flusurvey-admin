import { ReactNode, createContext, useCallback, useContext, useEffect, useState } from "react";
import { Expression } from "../expression-editor/utils";
import { Session, StudyContext, StudyExpressionEditorMode } from "./types";
import { v4 as uuidv4 } from 'uuid';
import throttle from 'lodash.throttle';
import { toast } from "sonner";


interface StudyExpressionEditorContextType {
    sessionId?: string;
    currentName?: string;
    currentRules?: Expression[];
    currentStudyContext?: StudyContext;
    lastModified?: number;
    mode: StudyExpressionEditorMode;

    updateCurrentRules: (rules?: Expression[]) => void;
    updateCurrentStudyContext: (studyContext?: StudyContext) => void;
    updateSession: (updates: Partial<Omit<Session, 'id' | 'lastModified'>>) => void;
    updateName: (name: string) => void;
    changeMode: (mode: StudyExpressionEditorMode) => void;

    // Session management
    sessions: Session[];
    loadSession: (sessionId: string) => void;
    deleteSession: (sessionId: string) => void;

    // Study context operations
    loadStudyContextFromSession: (sessionId: string) => void;
}

const SESSION_STORAGE_KEY = 'studyEditorSessions';
const MAX_SESSIONS = 20;

// Create context
const StudyExpressionEditorContext = createContext<StudyExpressionEditorContextType | undefined>(undefined);

// Storage helper functions
const getFromStorage = (key: string): unknown => {
    try {
        const stored = localStorage.getItem(key);
        return stored ? JSON.parse(stored) : undefined;
    } catch (error) {
        console.error(`Error retrieving ${key} from localStorage:`, error);
        return undefined;
    }
}


const saveToStorage = (key: string, value: unknown): void => {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error(`Error saving ${key} to localStorage:`, error);
    }
}

export const StudyExpressionEditorProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [currentSession, setCurrentSession] = useState<Session | undefined>(undefined);

    // Load all sessions
    const [sessions, setSessions] = useState<Session[]>(() => {
        const storedSessions = getFromStorage(SESSION_STORAGE_KEY) as Session[];
        if (!storedSessions) {
            return [];
        }
        return storedSessions;
    });


    // Handle storage changes from other tabs
    useEffect(() => {
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === SESSION_STORAGE_KEY) {
                const storedSessions = getFromStorage(SESSION_STORAGE_KEY) as Session[];
                if (!storedSessions) {
                    return;
                }
                setSessions(storedSessions);
            }
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    // Update session in storage with throttling
    const throttledSaveSession = useCallback(
        throttle((session: Session) => {
            // Update in the sessions list
            const sessionIndex = sessions.findIndex(s => s.id === session.id);
            const updatedSessions = [...sessions].sort((a, b) => b.lastModified - a.lastModified);

            if (sessionIndex >= 0) {
                updatedSessions[sessionIndex] = session;
            } else {
                updatedSessions.unshift(session);
                if (updatedSessions.length > MAX_SESSIONS) {
                    updatedSessions.pop();
                }
            }

            setSessions(updatedSessions);
            saveToStorage(SESSION_STORAGE_KEY, updatedSessions);
        }, 500),
        [sessions]
    );

    const loadSession = (sessionId: string) => {
        const session = sessions.find(s => s.id === sessionId);
        if (session) {
            setCurrentSession(session);
        }
    }

    const deleteSession = (sessionId: string) => {
        const session = sessions.find(s => s.id === sessionId);
        if (!session) {
            toast.error(`Session with id ${sessionId} not found`);
            console.error(`Session with id ${sessionId} not found`);
            return;
        }

        if (session.id === currentSession?.id) {
            setCurrentSession(undefined);
        }
        const newSessions = sessions.filter(s => s.id !== sessionId);
        saveToStorage(SESSION_STORAGE_KEY, newSessions);
        setSessions(newSessions);
    }

    const updateSession = (updates: Partial<Omit<Session, 'id' | 'lastModified'>>) => {
        setCurrentSession(prev => {
            if (!prev || !prev.id) {
                prev = {
                    id: uuidv4(),
                    mode: 'study-rules',
                    lastModified: Date.now(),
                }
            }

            const updated = {
                ...prev,
                ...updates,
                lastModified: Date.now()
            };
            throttledSaveSession(updated);
            return updated;
        });
    };


    const updateName = (name: string) => {
        updateSession({
            name
        })
    }

    const changeMode = (mode: StudyExpressionEditorMode) => {
        updateSession({
            mode
        })
    }

    const updateCurrentRules = (rules?: Expression[]) => {
        updateSession({
            rules
        })
    }
    const updateCurrentStudyContext = (studyContext?: StudyContext) => {
        updateSession({
            studyContext
        })
    }

    const loadStudyContextFromSession = (sessionId: string) => {
        const session = sessions.find(s => s.id === sessionId);
        if (!session) {
            toast.error(`Session with id ${sessionId} not found`);
            return;
        }

        updateCurrentStudyContext(session.studyContext);
    }


    return (
        <StudyExpressionEditorContext.Provider value={{
            sessionId: currentSession?.id,
            sessions,
            mode: currentSession?.mode ?? 'study-rules',
            currentName: currentSession?.name,
            currentRules: currentSession?.rules,
            currentStudyContext: currentSession?.studyContext,
            changeMode,
            loadSession,
            deleteSession,
            updateSession,
            updateCurrentRules,
            updateCurrentStudyContext,
            updateName,
            loadStudyContextFromSession,
        }}>
            {children}
        </StudyExpressionEditorContext.Provider>
    );

}

// Custom hook to use the context
export const useStudyExpressionEditor = (): StudyExpressionEditorContextType => {
    const context = useContext(StudyExpressionEditorContext);
    if (context === undefined) {
        throw new Error('useStudyExpressionEditor must be used within a StudyExpressionEditorProvider');
    }
    return context;
};
