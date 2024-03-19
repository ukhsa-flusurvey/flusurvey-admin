import { Suspense } from "react";

import StudySelector, { StudySelectorSkeleton } from "./_components/StudySelector";


export const dynamic = 'force-dynamic';

export const metadata = {
    title: 'Study Selector',
    description: 'Select a study to view participants.',
}


export default async function Page() {
    return (

        <main
            className="p-6"
        >
            <div className="flex">
                <Suspense fallback={<StudySelectorSkeleton />}>
                    <StudySelector />
                </Suspense>
            </div>
        </main>

    )
}
