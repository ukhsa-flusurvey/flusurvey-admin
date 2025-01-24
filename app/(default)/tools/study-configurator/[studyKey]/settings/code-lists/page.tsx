import { Suspense } from "react";
import CodeListsOverview, { CodeListOverviewLoader } from "./_components/code-lists-overview";

export default async function Page({
    params,
}: {
    params: { studyKey: string };
}) {
    const studyKey = params.studyKey;
    return (
        <Suspense fallback={<CodeListOverviewLoader />}>
            <CodeListsOverview
                studyKey={studyKey}
            />
        </Suspense>
    );
}
