import BackButton from "../../../../../../../components/BackButton";
import SurveyOverview, { SurveyOverviewSkeleton } from "./_components/SurveyOverview";
import { Suspense } from "react";


interface PageProps {
    params: Promise<{
        studyKey: string;
        surveyKey: string;
    }>
}

export const dynamic = 'force-dynamic';


export default async function Page(props: PageProps) {
    const { studyKey, surveyKey } = await props.params;

    return (
        <div className="space-y-4">
            <div>
                <BackButton
                    label="Back to surveys"
                    href={`/tools/study-configurator/${studyKey}/surveys`}
                />
            </div>
            <div className="flex">
                <Suspense fallback={<SurveyOverviewSkeleton studyKey={studyKey} surveyKey={surveyKey} />}>
                    <SurveyOverview
                        studyKey={studyKey}
                        surveyKey={surveyKey}
                    />
                </Suspense>
            </div>
        </div>
    );
}
