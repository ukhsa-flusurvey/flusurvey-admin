import { createContext } from "react";
import { Survey } from "survey-engine/data_types";

export const SurveyContext = createContext<{
    survey?: Survey,
    setSurvey: (survey: Survey) => void,
}>({
    survey: undefined,
    setSurvey: () => { },
});
