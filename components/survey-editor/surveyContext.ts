import { createContext } from "react";
import { Survey } from "survey-engine/data_types";
import { StoredSurvey } from "./utils/SurveyStorage";

export const SurveyContext = createContext<{
    storedSurvey?: StoredSurvey,
    setStoredSurvey: (storedSurvey: StoredSurvey | undefined) => void,
    survey?: Survey,
    setSurvey: (survey: Survey) => void,
    selectedLanguage: string,
    setSelectedLanguage: (lang: string) => void,
}>({
    survey: undefined,
    setSurvey: () => { },
    selectedLanguage: process.env.NEXT_PUBLIC_DEFAULT_LANGUAGE || 'en',
    setSelectedLanguage: () => { },
    storedSurvey: undefined,
    setStoredSurvey: () => { },
});
