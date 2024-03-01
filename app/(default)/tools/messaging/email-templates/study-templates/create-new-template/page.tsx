import Breadcrumbs from "@/components/Breadcrumbs";
import EmailTemplateConfigurator from "../../../EmailTemplateConfigurator";

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
                                title: 'Study Email Templates',
                                href: '/tools/messaging/email-templates/study-templates',
                            },
                            {
                                title: 'Create New Template',
                            },
                        ]
                    }
                />
            </div>
            <main className="py-6">
                <div className="flex">
                    <EmailTemplateConfigurator
                        emailTemplateConfig={undefined}
                        isSystemTemplate={false}
                        isGlobalTemplate={false}
                    />
                </div>
            </main>

        </div>
    );
}
