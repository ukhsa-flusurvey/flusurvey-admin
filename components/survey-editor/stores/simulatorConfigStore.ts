import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { SurveySingleItemResponse, SurveyContext as ContextValues } from 'survey-engine/data_types';

export interface SurveyTexts {
    nextBtnText?: string;
    backBtnText?: string;
    submitBtnText?: string;
    invalidResponseText?: string;
}

interface SimulatorConfigState {
    showKeys: boolean;
    currentResponses: SurveySingleItemResponse[];
    surveyTexts: SurveyTexts;
    contextValues: ContextValues;

    // Actions
    setShowKeys: (showKeys: boolean) => void;
    setCurrentResponses: (responses: SurveySingleItemResponse[]) => void;
    setSurveyTexts: (texts: SurveyTexts) => void;
    setContextValues: (context: ContextValues) => void;
    updateSurveyText: (key: keyof SurveyTexts, value: string) => void;
    clearResponses: () => void;
    resetToDefaults: () => void;
}

const defaultSurveyTexts: SurveyTexts = {
    nextBtnText: 'Next',
    backBtnText: 'Back',
    submitBtnText: 'Submit',
    invalidResponseText: 'Invalid response',
};

const defaultContextValues: ContextValues = {
    isLoggedIn: false,
    participantFlags: {}
};

export const useSimulatorConfigStore = create<SimulatorConfigState>()(
    persist(
        (set) => ({
            // Initial state
            showKeys: false,
            currentResponses: [],
            surveyTexts: defaultSurveyTexts,
            contextValues: defaultContextValues,

            // Actions
            setShowKeys: (showKeys) => set({ showKeys }),

            setCurrentResponses: (currentResponses) => set({ currentResponses }),

            setSurveyTexts: (surveyTexts) => set({ surveyTexts }),

            setContextValues: (contextValues) => set({ contextValues }),

            updateSurveyText: (key, value) => set((state) => ({
                surveyTexts: {
                    ...state.surveyTexts,
                    [key]: value
                }
            })),

            clearResponses: () => set({ currentResponses: [] }),

            resetToDefaults: () => set({
                showKeys: false,
                currentResponses: [],
                surveyTexts: defaultSurveyTexts,
                contextValues: defaultContextValues,
            }),
        }),
        {
            name: 'simulator-config-storage',
            // Only persist the configuration, not temporary state
            partialize: (state) => ({
                showKeys: state.showKeys,
                surveyTexts: state.surveyTexts,
                contextValues: state.contextValues,
                // Note: currentResponses are not persisted as they're session-specific
            }),
        }
    )
);
