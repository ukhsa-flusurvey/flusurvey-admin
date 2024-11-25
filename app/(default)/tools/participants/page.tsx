import { Suspense } from "react";

import StudySelector, { StudySelectorSkeleton } from "./_components/StudySelector";
import SidebarToggleWithBreadcrumbs from "@/components/sidebar-toggle-with-breadcrumbs";


export const dynamic = 'force-dynamic';

export const metadata = {
    title: 'Study Selector',
    description: 'Select a study to view participants.',
}


export default async function Page() {
    return (
        <div className="flex flex-col h-screen">
            <SidebarToggleWithBreadcrumbs
                breadcrumbs={[
                    {
                        content: 'Select a study'
                    }
                ]}
            />
            <main
                className="flex items-center justify-center p-6 grow"
            >
                <div className="flex">
                    <Suspense fallback={<StudySelectorSkeleton />}>
                        <StudySelector />
                    </Suspense>
                </div>
            </main>
        </div>

    )
}
