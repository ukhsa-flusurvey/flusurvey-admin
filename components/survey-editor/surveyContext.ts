import { createContext } from "react";
import { Survey } from "survey-engine/data_types";

export const SurveyContext = createContext<{
    survey?: Survey,
    setSurvey: (survey: Survey) => void,
    selectedLanguage: string,
    setSelectedLanguage: (lang: string) => void,
}>({
    survey: undefined,
    setSurvey: () => { },
    selectedLanguage: process.env.NEXT_PUBLIC_DEFAULT_LANGUAGE || 'en',
    setSelectedLanguage: () => { },
});
