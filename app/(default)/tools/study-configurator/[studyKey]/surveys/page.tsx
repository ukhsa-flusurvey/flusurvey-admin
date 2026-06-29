import { Suspense } from "react";
import SurveyList, { SurveyListSkeleton } from "./_components/SurveyList";
import { StudyKeyPageParams } from "../page";

export default async function Page(props: StudyKeyPageParams) {
    const { studyKey } = await props.params;

    return (
        <Suspense fallback={<SurveyListSkeleton studyKey={studyKey} />}>
            <SurveyList studyKey={studyKey} />
        </Suspense>
    );
}
