import { Suspense } from "react";
import { StudyKeyPageParams } from "../page";
import VariableList, { VariableListSkeleton } from "./_components/VariableList";
import StudyCounterList, { StudyCounterListSkeleton } from "./_components/study-counter-list";


export default async function Page(props: StudyKeyPageParams) {
    const { studyKey } = await props.params;

    return (
        <div className="flex flex-col md:flex-row gap-4">
            <Suspense fallback={<VariableListSkeleton studyKey={studyKey} />}>
                <VariableList studyKey={studyKey} />
            </Suspense>
            <Suspense fallback={<StudyCounterListSkeleton studyKey={studyKey} />}>
                <StudyCounterList studyKey={studyKey} />
            </Suspense>
        </div>
    );
}
