import { Suspense } from "react";
import GlobalEmailTemplates, { GlobalEmailTemplatesSkeleton } from "./_components/GlobalEmailTemplates";
import SimpleBreadcrumbsPageLayout from "@/components/SimpleBreadcrumbsPageLayout";

export const dynamic = 'force-dynamic';

export const metadata = {
    title: "Global Email Templates",
    description: "Configure email templates for global messages, like newsletters, etc.",
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
                        title: 'Global Email Templates',
                    },
                ]
            }
        >
            <div
                className="h-full w-full pb-6 flex flex-col gap-4" >
                <div className="grow flex overflow-hidden">
                    <Suspense fallback={<GlobalEmailTemplatesSkeleton />}>
                        <GlobalEmailTemplates />
                    </Suspense>
                </div>
            </div>
        </SimpleBreadcrumbsPageLayout>
    );
}
