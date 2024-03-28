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
                        title: 'Global Email Templates',
                        href: '/tools/messaging/email-templates/global-templates',
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
                        isSystemTemplate={false}
                        isGlobalTemplate={true}
                    />
                </div>
            </div>
        </SimpleBreadcrumbsPageLayout>
    );
}
