import { getStudies } from "@/lib/data/studyAPI";
import EmailTemplateConfigurator from "../../_components/EmailTemplateConfigurator";
import SimpleBreadcrumbsPageLayout from "@/components/SimpleBreadcrumbsPageLayout";

export const dynamic = 'force-dynamic';

export default async function Page() {

    const studies = await getStudies();
    const availableStudyKeys = studies.studies?.map(s => s.key);
    console.log(availableStudyKeys)

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
                        availableStudyKeys={availableStudyKeys}
                    />
                </div>
            </div>
        </SimpleBreadcrumbsPageLayout>
    );
}
