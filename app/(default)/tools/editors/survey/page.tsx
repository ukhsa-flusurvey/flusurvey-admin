import SurveyEditor from "@/components/survey-editor/SurveyEditor";

import weeklySurveyJSON from './weekly.json';
import { Survey } from "survey-engine/data_types";

export default async function Page() {
    return (
        <SurveyEditor
            initialSurvey={weeklySurveyJSON as Survey}
        />
    )
}
