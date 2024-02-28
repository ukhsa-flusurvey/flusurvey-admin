import React from 'react';
import EmailTemplateConfigurator from '../../EmailTemplateConfigurator';
import { EmailTemplate } from '@/utils/server/types/messaging';
import { AlertTriangle, Cog } from 'lucide-react';
import ErrorAlert from '@/components/ErrorAlert';

interface EmailTemplateConfigProps {
    messageType?: string;
    studyKey?: string;
    templateId?: string;
    isSystemTemplate: boolean;
}

const EmailTemplateConfig: React.FC<EmailTemplateConfigProps> = async (props) => {

    // simulate loading by 5 seconds
    await new Promise(resolve => setTimeout(resolve, 500));


    if (props.templateId) {
        // load by id
    } else if (props.messageType) {
        // otherwise load by type and study key (if defined)

    } else {
        // error - no id or type
        return (
            <p>Error - no id or type</p>
        );
    }

    const error = 'Unauthorized';
    if (error) {
        return (
            <ErrorAlert
                title="Error while loading template:"
                error={error}
                hint="If this is an unexpected, check you connection and try again. Try to refresh the page or log out and log in again. If the problem persists, contact support."
            />
        );
    }


    let currentTemplate: EmailTemplate | undefined = undefined;
    if (!currentTemplate) {
        currentTemplate = {
            messageType: props.messageType || '',
            defaultLanguage: process.env.NEXT_PUBLIC_DEFAULT_LANGUAGE || 'en',
            translations: [],
        }
    }

    return (
        <div>
            <EmailTemplateConfigurator
                emailTemplateConfig={currentTemplate}
                isSystemTemplate={props.isSystemTemplate}
            />
        </div>
    );
};

// skeleton comp for loading
export const EmailTemplateConfigSkeleton: React.FC = () => {
    return (
        <div className='animate-pulse p-6 rounded-md bg-white'>
            <p className='text-center'>
                Loading message template...
            </p>
            <p className='text-center flex justify-center mt-3'>
                <Cog className='size-8 animate-spin' />
            </p>
        </div>
    );
}

export default EmailTemplateConfig;
