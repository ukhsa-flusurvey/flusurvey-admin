import { Suspense } from "react";
import { StudyKeyPageParams } from "../../page";
import NotificationsSubsCard, { NotificationsSubsCardSkeleton } from "./_components/NotificationsSubsCard";

export const dynamic = 'force-dynamic';


export default function Page(props: StudyKeyPageParams) {
    const studyKey = props.params.studyKey;

    return (
        <div className="space-y-4">
            <Suspense fallback={<NotificationsSubsCardSkeleton />}>
                <NotificationsSubsCard
                    studyKey={studyKey}
                />
            </Suspense>
        </div>
    );
}
