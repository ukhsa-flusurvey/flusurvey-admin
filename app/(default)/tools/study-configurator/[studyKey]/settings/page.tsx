import { Suspense } from "react";
import StudyStatusCard, { StudyStatusCardSkeleton } from "./_components/StudyStatusCard";
import { StudyKeyPageParams } from "../page";
import IsDefaultStudyCard, { IsDefaultStudyCardSkeleton } from "./_components/IsDefaultStudyCard";

export const dynamic = 'force-dynamic';

export default function Page(props: StudyKeyPageParams) {
    const studyKey = props.params.studyKey;

    return (
        <div className="space-y-4">

            <Suspense fallback={<StudyStatusCardSkeleton />}>
                <StudyStatusCard
                    studyKey={studyKey}
                />
            </Suspense>


            <p>
                display texts
            </p>

            <Suspense fallback={<IsDefaultStudyCardSkeleton />}>
                <IsDefaultStudyCard studyKey={studyKey} />
            </Suspense>

            <p>
                file upload allowed, not allowed
            </p>
        </div>
    );
}
