import { Suspense } from "react";
import StudyEmailTemplates, { StudyEmailTemplatesSkeleton } from "./_components/StudyEmailTemplates";
import SimpleBreadcrumbsPageLayout from "@/components/SimpleBreadcrumbsPageLayout";

export const dynamic = 'force-dynamic';

export const metadata = {
    title: "Study Email Templates",
    description: "Configure email templates for study messages, like invitations, reminders, etc.",
}

export default function Page() {

    return (
        <SimpleBreadcrumbsPageLayout
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
        >
            <Suspense fallback={<StudyEmailTemplatesSkeleton />}>
                <StudyEmailTemplates />
            </Suspense>
        </SimpleBreadcrumbsPageLayout>
    );
}
