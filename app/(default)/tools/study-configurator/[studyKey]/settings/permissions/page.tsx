import { Suspense } from "react";
import PermissionsCard, { PermissionsCardSkeleton } from "./_components/PermissionsCard";
import { StudyKeyPageParams } from "../../page";

export const dynamic = 'force-dynamic';

export default function Page(
    props: StudyKeyPageParams
) {

    return (
        <Suspense fallback={<PermissionsCardSkeleton />}>
            <PermissionsCard
                studyKey={props.params.studyKey}
            />
        </Suspense>
    );
}
