import { Suspense } from "react";
import EmailTemplateConfig, { EmailTemplateConfigSkeleton } from "../../_components/EmailTemplateConfig";
import SimpleBreadcrumbsPageLayout from "@/components/SimpleBreadcrumbsPageLayout";

export const dynamic = 'force-dynamic';

export default function Page({
    params: {
        messageType,
    },
}: {
    params: {
        messageType: string;
    };
}) {

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
                        href: '/tools/messaging/email-templates/global-templates',
                    },
                    {
                        title: messageType,
                    },
                ]
            }
        >
            <div className="flex">
                <Suspense fallback={<EmailTemplateConfigSkeleton />}>
                    <EmailTemplateConfig
                        messageType={messageType}
                        isSystemTemplate={false}
                        isGlobalTemplate={true}
                    />
                </Suspense>
            </div>
        </SimpleBreadcrumbsPageLayout>
    );
}
