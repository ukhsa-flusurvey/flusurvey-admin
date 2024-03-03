import { Suspense } from "react";
import StudyStatusCard, { StudyStatusCardSkeleton } from "./_components/StudyStatusCard";
import { StudyKeyPageParams } from "../page";

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

            <p>
                is system default study
            </p>

            <p>
                file upload allowed, not allowed
            </p>
        </div>
    );
}
