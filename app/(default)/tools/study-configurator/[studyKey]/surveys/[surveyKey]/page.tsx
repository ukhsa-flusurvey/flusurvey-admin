import BackButton from "../_components/BackButton";
import SurveyOverview, { SurveyOverviewSkeleton } from "./_components/SurveyOverview";
import { Suspense } from "react";


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

            <div className="flex">
                <Suspense fallback={<SurveyOverviewSkeleton studyKey={props.params.studyKey} surveyKey={props.params.surveyKey} />}>
                    <SurveyOverview
                        studyKey={props.params.studyKey}
                        surveyKey={props.params.surveyKey}
                    />
                </Suspense>
            </div>
        </div>
    )
}
