import { Suspense } from "react";
import SurveyList, { SurveyListSkeleton } from "./_components/SurveyList";
import { StudyKeyPageParams } from "../page";

export default function Page(props: StudyKeyPageParams) {

    return (
        <Suspense fallback={<SurveyListSkeleton studyKey={props.params.studyKey} />}>
            <SurveyList studyKey={props.params.studyKey} />
        </Suspense>
    );
}
