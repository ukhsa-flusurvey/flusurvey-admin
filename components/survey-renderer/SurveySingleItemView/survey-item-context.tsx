import { createContext, useContext } from "react";


interface SurveyItemContextValue {
    itemKey: string;
    headerId: string;
}


const SurveyItemContext = createContext<SurveyItemContextValue | null>(null);


interface SurveyItemContextProviderProps {
    children: React.ReactNode;
    itemKey: string;
}

export const SurveyItemContextProvider: React.FC<SurveyItemContextProviderProps> = ({
    children,
    itemKey,
}) => {
    const contextValue: SurveyItemContextValue = {
        itemKey,
        headerId: `${itemKey}-header`,
    };

    return <SurveyItemContext.Provider value={contextValue}>
        {children}
    </SurveyItemContext.Provider>
}

export const useSurveyItemCtx = () => {
    const context = useContext(SurveyItemContext);
    if (!context) {
        throw new Error('useSurveyItemCtx must be used within a SurveyItemContextProvider');
    }
    return context;
};
