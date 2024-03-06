import SurveyEditor from "@/components/survey-editor/SurveyEditor";
import { getSurveyVersion } from "@/lib/data/studyAPI";
import { redirect } from "next/navigation";

interface PageProps {
    params: {
        studyKey: string;
        surveyKey: string;
    }
    searchParams: {
        version: string;
    }
}

export const dynamic = 'force-dynamic';


export default async function Page(props: PageProps) {

    if (!props.searchParams.version) {
        redirect(`/tools/study-configurator/${props.params.studyKey}/survey/${props.params.surveyKey}`);
    }

    // download survey
    const resp = await getSurveyVersion(props.params.studyKey, props.params.surveyKey, props.searchParams.version);
    if (resp.error) {
        return <div>{resp.error}</div>
    }
    const surveyDef = resp.survey;

    return <>
        <div className="absolute top-0 z-50 w-full">
            <SurveyEditor
                initialSurvey={surveyDef}

            />
        </div>
    </>
}
