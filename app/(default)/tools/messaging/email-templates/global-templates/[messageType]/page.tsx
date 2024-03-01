import Breadcrumbs from "@/components/Breadcrumbs";
import { Suspense } from "react";
import EmailTemplateConfig, { EmailTemplateConfigSkeleton } from "../../_components/EmailTemplateConfig";

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
                                href: '/tools/messaging/email-templates/global-templates',
                            },
                            {
                                title: messageType,
                            },
                        ]
                    }
                />
            </div>
            <main className="py-6">
                <div className="flex">
                    <Suspense fallback={<EmailTemplateConfigSkeleton />}>
                        <EmailTemplateConfig
                            messageType={messageType}
                            isSystemTemplate={false}
                            isGlobalTemplate={true}
                        />
                    </Suspense>
                </div>
            </main>

        </div>
    );
}
