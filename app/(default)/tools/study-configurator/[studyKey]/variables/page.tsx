import { Suspense } from "react";
import { StudyKeyPageParams } from "../page";
import VariableList, { VariableListSkeleton } from "./_components/VariableList";


export default function Page(props: StudyKeyPageParams) {
    return (
        <Suspense fallback={<VariableListSkeleton studyKey={props.params.studyKey} />}>
            <VariableList studyKey={props.params.studyKey} />
        </Suspense>
    )
}
