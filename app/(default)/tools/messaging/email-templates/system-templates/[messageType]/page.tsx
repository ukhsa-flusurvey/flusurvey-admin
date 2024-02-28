import { Suspense } from "react";
import EmailTemplateConfig, { EmailTemplateConfigSkeleton } from "../../_components/EmailTemplateConfig";

export const dynamic = 'force-dynamic';

interface PageProps {
    params: {
        messageType: string;
    }
}

export default function Page(props: PageProps) {

    return (
        <main className="p-6">
            <Suspense fallback={<EmailTemplateConfigSkeleton />}>
                <EmailTemplateConfig
                    messageType={props.params.messageType}
                    isSystemTemplate={true}
                />
            </Suspense>
        </main>
    );
}
