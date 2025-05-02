import ScheduledEmails, { ScheduledEmailsSkeleton } from "./_components/ScheduledEmails";
import { Suspense } from "react";
import SimpleBreadcrumbsPageLayout from "@/components/SimpleBreadcrumbsPageLayout";

export const dynamic = 'force-dynamic';

export default async function Page() {
    return (
        <SimpleBreadcrumbsPageLayout
            links={
                [
                    {
                        title: 'Messaging Tools',
                        href: '/tools/messaging',
                    },
                    {
                        title: 'Scheduled Emails',
                    },
                ]
            }
        >
            <div className="flex pb-12">
                <Suspense fallback={<ScheduledEmailsSkeleton />}>
                    <ScheduledEmails />
                </Suspense>
            </div>
        </SimpleBreadcrumbsPageLayout>
    )
}
