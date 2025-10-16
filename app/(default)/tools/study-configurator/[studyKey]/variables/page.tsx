import { Suspense } from "react";
import { StudyKeyPageParams } from "../page";
import VariableList, { VariableListSkeleton } from "./_components/VariableList";
import StudyCounterList, { StudyCounterListSkeleton } from "./_components/study-counter-list";


export default function Page(props: StudyKeyPageParams) {
    return (
        <div className="flex flex-col md:flex-row gap-4">
            <Suspense fallback={<VariableListSkeleton studyKey={props.params.studyKey} />}>
                <VariableList studyKey={props.params.studyKey} />
            </Suspense>

            <Suspense fallback={<StudyCounterListSkeleton studyKey={props.params.studyKey} />}>
                <StudyCounterList studyKey={props.params.studyKey} />
            </Suspense>
        </div>
    )
}
