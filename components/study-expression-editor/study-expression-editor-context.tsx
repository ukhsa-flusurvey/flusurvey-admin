import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { Expression } from "../expression-editor/utils";
import { Session, StudyContext, StudyExpressionEditorMode } from "./types";
import { v4 as uuidv4 } from 'uuid';
import { toast } from "sonner";
import { useDebounceValue } from "usehooks-ts";

type ViewModes = 'expression-editor' | 'context-editor' | 'load-rules-from-disk';

interface StudyExpressionEditorContextType {
    sessionId?: string;
    currentName?: string;
    currentRules?: Expression[];
    currentStudyContext?: StudyContext;
    lastModified?: number;
    mode: StudyExpressionEditorMode;
    view: ViewModes;

    updateCurrentRules: (rules?: Expression[]) => void;
    updateCurrentStudyContext: (studyContext?: StudyContext) => void;
    updateSession: (updates: Partial<Omit<Session, 'id' | 'lastModified'>>) => void;
    updateName: (name: string) => void;
    changeMode: (mode: StudyExpressionEditorMode) => void;

    // Session management
    sessions: Session[];
    initNewSession: (withRules?: Expression[], withMode?: StudyExpressionEditorMode) => void;
    loadSession: (sessionId: string) => void;
    deleteSession: (sessionId: string) => void;

    // Study context operations
    loadStudyContextFromSession: (sessionId: string) => void;

    saveRulesToDisk: () => void;

    // View management
    changeView: (view: ViewModes) => void;
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
    console.debug(`Saving ${key} to localStorage:`, value);
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error(`Error saving ${key} to localStorage:`, error);
    }
}

export const StudyExpressionEditorProvider: React.FC<{
    children: ReactNode;
    defaultSession?: Session;
}> = ({ children, defaultSession }) => {
    const [currentSession, setCurrentSession] = useState<Session | undefined>(defaultSession);
    const [view, setView] = useState<ViewModes>('load-rules-from-disk');

    // Load all sessions
    const [sessions, setSessions] = useState<Session[]>(() => {
        const storedSessions = getFromStorage(SESSION_STORAGE_KEY) as Session[];
        if (!storedSessions) {
            return [];
        }
        return storedSessions;
    });

    const [debouncedSessions] = useDebounceValue(sessions, 500);

    // Handle storage changes from other tabs
    useEffect(() => {
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === SESSION_STORAGE_KEY) {
                const storedSessions = getFromStorage(SESSION_STORAGE_KEY) as Session[];
                if (!storedSessions) {
                    return;
                }
                setSessions(storedSessions);

                if (currentSession?.id) {
                    const updatedCurrentSession = storedSessions.find(s => s.id === currentSession.id);
                    setCurrentSession(updatedCurrentSession);
                }
            }
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, [currentSession]);

    useEffect(() => {
        toast.success('Session updated');
        saveToStorage(SESSION_STORAGE_KEY, debouncedSessions);
    }, [debouncedSessions])


    const initNewSession = (withRules?: Expression[], withMode?: StudyExpressionEditorMode) => {
        setCurrentSession({
            id: uuidv4(),
            lastModified: Date.now(),
            mode: withMode ? withMode : currentSession?.mode ?? 'study-rules',
            rules: withRules,
        });
    }

    const loadSession = (sessionId: string) => {
        const session = sessions.find(s => s.id === sessionId);
        if (session) {
            setCurrentSession(session);
            setView('expression-editor');
            toast.success('Session loaded');
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
        setSessions(newSessions);
    }

    const updateSession = (updates: Partial<Omit<Session, 'id' | 'lastModified'>>) => {
        setCurrentSession(prev => {
            if (!prev || !prev.id) {
                prev = {
                    id: '',
                    mode: 'study-rules',
                    lastModified: Date.now(),
                }
            }

            const updated = {
                ...prev,
                ...updates,
                lastModified: Date.now()
            };

            if (updated.id.length > 0) {
                const updatedSessions = [...sessions].sort((a, b) => b.lastModified - a.lastModified);
                const sessionIndex = updatedSessions.findIndex(s => s.id === updated.id);

                if (sessionIndex >= 0) {
                    updatedSessions[sessionIndex] = updated;
                } else {
                    updatedSessions.unshift(updated);
                    if (updatedSessions.length > MAX_SESSIONS) {
                        updatedSessions.pop();
                    }
                }
                setSessions(updatedSessions);
            }
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

    const changeView = (view: ViewModes) => {
        setView(view);
    }

    const saveRulesToDisk = () => {
        if (!currentSession || currentSession.rules === undefined || currentSession.rules.length === 0) {
            toast.error('No rules to save');
            return;
        }
        const rulesStr = JSON.stringify(currentSession?.rules, null, 2);
        const blob = new Blob([rulesStr], { type: 'application/json' });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);

        const prefix = currentSession?.mode === 'study-rules' ? 'study-rules' : 'study-action';

        const fileName = `${prefix}${currentSession?.name ? ('_' + currentSession?.name) : ''}.json`;

        link.download = fileName;
        link.click();

        toast.success('Rules saved to disk', {
            description: fileName
        });
    }


    return (
        <StudyExpressionEditorContext.Provider value={{
            view,
            sessionId: currentSession?.id,
            sessions,
            mode: currentSession?.mode ?? 'study-rules',
            currentName: currentSession?.name,
            currentRules: currentSession?.rules,
            currentStudyContext: currentSession?.studyContext,
            changeMode,
            initNewSession,
            loadSession,
            deleteSession,
            updateSession,
            updateCurrentRules,
            updateCurrentStudyContext,
            updateName,
            loadStudyContextFromSession,
            changeView,
            saveRulesToDisk,
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
