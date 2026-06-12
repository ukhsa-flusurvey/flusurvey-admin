import { Suspense } from "react";
import StudyStatusCard, { StudyStatusCardSkeleton } from "./_components/StudyStatusCard";
import { StudyKeyPageParams } from "../page";
import IsDefaultStudyCard, { IsDefaultStudyCardSkeleton } from "./_components/IsDefaultStudyCard";
import FileUploadCard, { FileUploadCardSkeleton } from "./_components/FileUploadCard";
import DisplayTextsCard, { DisplayTextsCardSkeleton } from "./_components/DisplayTextsCard";
import AccountIdTrackingCard, { AccountIdTrackingCardSkeleton } from "./_components/AccountIdTrackingCard";


export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Page(props: StudyKeyPageParams) {
    const { studyKey } = await props.params;

    return (
        <div className="space-y-4">
            <Suspense fallback={<StudyStatusCardSkeleton />}>
                <StudyStatusCard
                    studyKey={studyKey}
                />
            </Suspense>

            <Suspense fallback={<IsDefaultStudyCardSkeleton />}>
                <IsDefaultStudyCard studyKey={studyKey} />
            </Suspense>

            <Suspense fallback={<DisplayTextsCardSkeleton />}>
                <DisplayTextsCard studyKey={studyKey} />
            </Suspense>

            <Suspense fallback={<FileUploadCardSkeleton />}>
                <FileUploadCard studyKey={studyKey} />
            </Suspense>

            <Suspense fallback={<AccountIdTrackingCardSkeleton />}>
                <AccountIdTrackingCard studyKey={studyKey} />
            </Suspense>
        </div>
    );
}
