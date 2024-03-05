import SurveyHistoryView from "./SurveyHistoryView";
import BackButton from "../_components/BackButton";


interface PageProps {
    params: {
        studyKey: string;
        surveyKey: string;
    }
}

export const dynamic = 'force-dynamic';


export default async function Page(props: PageProps) {

    return (
        <div className="space-y-4">
            <div>
                <BackButton
                    label="Back to surveys"
                    href={`/tools/study-configurator/${props.params.studyKey}/surveys`}
                />
            </div>


            <SurveyHistoryView
                studyKey={props.params.studyKey}
                surveyKey={props.params.surveyKey}
            />
        </div>
    )
}
