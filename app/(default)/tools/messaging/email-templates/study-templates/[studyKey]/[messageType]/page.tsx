import Breadcrumbs from "@/components/Breadcrumbs";
import { Suspense } from "react";
import EmailTemplateConfig, { EmailTemplateConfigSkeleton } from "../../../_components/EmailTemplateConfig";

interface PageProps {
    params: {
        studyKey: string;
        messageType: string;
    }
}

export default function Page(props: PageProps) {

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
                                title: props.params.studyKey,
                            },
                            {
                                title: props.params.messageType,
                            },
                        ]
                    }
                />
            </div>
            <main className="py-6">
                <div className="flex">
                    <Suspense fallback={<EmailTemplateConfigSkeleton />}>
                        <EmailTemplateConfig
                            messageType={props.params.messageType}
                            studyKey={props.params.studyKey}
                            isSystemTemplate={false}
                            isGlobalTemplate={false}
                        />
                    </Suspense>
                </div>
            </main>

        </div>
    );
}
