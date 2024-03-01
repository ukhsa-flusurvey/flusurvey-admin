import Breadcrumbs from "@/components/Breadcrumbs";
import { Suspense } from "react";
import StudyEmailTemplates, { StudyEmailTemplatesSkeleton } from "./_components/StudyEmailTemplates";

export const metadata = {
    title: "Study Email Templates",
    description: "Configure email templates for study messages, like invitations, reminders, etc.",
}

export default function Page() {

    return (
        <div className="px-6">
            <div className="pt-3 flex gap-8">
                <Breadcrumbs
                    links={
                        [
                            {
                                title: 'Messaging Tools',
                                href: '/tools/messaging',
                            },
                            {
                                title: 'Study Email Templates',
                            },
                        ]
                    }
                />
            </div>
            <main className="py-6">
                <div className="flex">
                    <Suspense fallback={<StudyEmailTemplatesSkeleton />}>
                        <StudyEmailTemplates />
                    </Suspense>
                </div>
            </main>

        </div>
    );
}
