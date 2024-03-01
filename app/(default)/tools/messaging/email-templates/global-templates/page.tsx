import Breadcrumbs from "@/components/Breadcrumbs";
import { Suspense } from "react";
import GlobalEmailTemplates, { GlobalEmailTemplatesSkeleton } from "./_components/GlobalEmailTemplates";

export const metadata = {
    title: "Global Email Templates",
    description: "Configure email templates for global messages, like newsletters, etc.",
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
                                title: 'Global Email Templates',
                            },
                        ]
                    }
                />
            </div>
            <main className="py-6">
                <div className="flex">
                    <Suspense fallback={<GlobalEmailTemplatesSkeleton />}>
                        <GlobalEmailTemplates />
                    </Suspense>
                </div>
            </main>

        </div>
    );
}
