import { Suspense } from "react";
import PermissionsCard, { PermissionsCardSkeleton } from "./_components/PermissionsCard";
import { StudyKeyPageParams } from "../../page";

export const dynamic = 'force-dynamic';

export default async function Page(props: StudyKeyPageParams) {
    const { studyKey } = await props.params;

    return (
        <Suspense fallback={<PermissionsCardSkeleton />}>
            <PermissionsCard
                studyKey={studyKey}
            />
        </Suspense>
    );
}
