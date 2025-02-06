import React from 'react';
import EmailTemplateConfigurator from './EmailTemplateConfigurator';
import { EmailTemplate } from '@/utils/server/types/messaging';
import { Cog } from 'lucide-react';
import ErrorAlert from '@/components/ErrorAlert';
import { getGlobalMessageTemplate, getStudyMessageTemplate } from '@/lib/data/messagingAPI';

interface EmailTemplateConfigProps {
    messageType?: string;
    studyKey?: string;
    isSystemTemplate: boolean;
    isGlobalTemplate?: boolean;
}


const EmailTemplateConfig: React.FC<EmailTemplateConfigProps> = async (props) => {
    if (!props.messageType) {
        return (
            <div>
                <ErrorAlert
                    title="Error while loading template:"
                    error="No valid messageType provided"
                    hint="Check if your URL is correct and try again. If the problem persists, contact support."
                />
            </div>
        );
    }

    let resp: {
        template?: EmailTemplate;
        error?: string;
    };
    if (props.studyKey) {
        resp = await getStudyMessageTemplate(props.messageType, props.studyKey);
    } else {
        resp = await getGlobalMessageTemplate(props.messageType);
    }

    const error = resp.error;
    if (error) {
        return (
            <div>
                <ErrorAlert
                    title={`Error while loading template '${props.messageType}':`}
                    error={error}
                    hint="If this is an unexpected, check you connection and try again. Try to refresh the page or log out and log in again. If the problem persists, contact support."
                />
            </div>
        );
    }

    let currentTemplate: EmailTemplate | undefined = resp.template;
    if (!currentTemplate) {
        currentTemplate = {
            messageType: props.messageType || '',
            defaultLanguage: process.env.NEXT_PUBLIC_DEFAULT_LANGUAGE || 'en',
            translations: [],
        }
    }

    return (
        <EmailTemplateConfigurator
            emailTemplateConfig={currentTemplate}
            isSystemTemplate={props.isSystemTemplate}
            isGlobalTemplate={props.isGlobalTemplate}
        />
    );
};

// skeleton comp for loading
export const EmailTemplateConfigSkeleton: React.FC = () => {
    return (
        <div>
            <div className='animate-pulse p-6 rounded-md bg-white'>
                <p className='text-center'>
                    Loading message template...
                </p>
                <p className='text-center flex justify-center mt-3'>
                    <Cog className='size-8 animate-spin' />
                </p>
            </div>
        </div>
    );
}

export default EmailTemplateConfig;
