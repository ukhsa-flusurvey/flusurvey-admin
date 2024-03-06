import SurveyEditor from "@/components/survey-editor/SurveyEditor";
import { getSurveyVersion } from "@/lib/data/studyAPI";
import BackButton from "../../../../../../../../components/BackButton";
import ErrorAlert from "@/components/ErrorAlert";


interface PageProps {
    params: {
        studyKey: string;
        surveyKey: string;
        versionId: string;
    }
}

export const dynamic = 'force-dynamic';


export default async function Page(props: PageProps) {

    // download survey
    const resp = await getSurveyVersion(props.params.studyKey, props.params.surveyKey, props.params.versionId);
    if (resp.error) {
        return <div>
            <BackButton
                label="Back to version overview"
                href={`/tools/study-configurator/${props.params.studyKey}/surveys/${props.params.surveyKey}`}
            />
            <ErrorAlert
                title='Could not load survey information'
                error={resp.error}
            />
        </div>
    }
    const surveyDef = resp.survey;

    return <>
        <div className="absolute top-0 z-50 w-full">
            <BackButton
                label="Back to version overview"
                href={`/tools/study-configurator/${props.params.studyKey}/surveys/${props.params.surveyKey}`}
            />
            <SurveyEditor
                initialSurvey={surveyDef}

            />
        </div>
    </>
}
