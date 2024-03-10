import EmailTemplateConfigurator from "../../_components/EmailTemplateConfigurator";
import SimpleBreadcrumbsPageLayout from "@/components/SimpleBreadcrumbsPageLayout";

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
            <div className="flex">
                <EmailTemplateConfigurator
                    emailTemplateConfig={undefined}
                    isSystemTemplate={false}
                    isGlobalTemplate={false}
                />
            </div>
        </SimpleBreadcrumbsPageLayout>
    );
}
