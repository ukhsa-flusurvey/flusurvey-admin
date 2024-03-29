import EmailTemplateConfigurator from "../../_components/EmailTemplateConfigurator";
import SimpleBreadcrumbsPageLayout from "@/components/SimpleBreadcrumbsPageLayout";

export const dynamic = 'force-dynamic';

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
                        href: '/tools/messaging/email-templates/study-templates',
                    },
                    {
                        title: 'Create New Template',
                    },
                ]
            }
        >
            <div
                className="h-full w-full pb-6 flex flex-col gap-4" >
                <div className="grow flex overflow-hidden">
                    <EmailTemplateConfigurator
                        emailTemplateConfig={undefined}
                        messageType={`new-message-${(Math.random() * 100).toFixed(0)}`}
                        isSystemTemplate={false}
                        isGlobalTemplate={false}
                    />
                </div>
            </div>
        </SimpleBreadcrumbsPageLayout>
    );
}
