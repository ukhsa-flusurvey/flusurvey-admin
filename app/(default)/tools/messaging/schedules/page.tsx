import Breadcrumbs from "@/components/Breadcrumbs";
import ScheduledEmails, { ScheduledEmailsSkeleton } from "./_components/ScheduledEmails";
import { Suspense } from "react";

export const dynamic = 'force-dynamic';

export default async function Page() {
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
                                title: 'Scheduled Emails',
                            },
                        ]
                    }
                />
            </div>
            <main className="py-6">
                <div className="flex">
                    <Suspense fallback={<ScheduledEmailsSkeleton />}>
                        <ScheduledEmails />
                    </Suspense>
                </div>
            </main>

        </div>
    )
}
