import React from 'react';
import EmailTemplateConfigurator from '../../EmailTemplateConfigurator';
import { EmailTemplate } from '@/utils/server/types/messaging';
import { Cog } from 'lucide-react';

interface EmailTemplateConfigProps {
    messageType?: string;
    studyKey?: string;
    templateId?: string;
    isSystemTemplate: boolean;
}

const EmailTemplateConfig: React.FC<EmailTemplateConfigProps> = async (props) => {

    // simulate loading by 5 seconds
    await new Promise(resolve => setTimeout(resolve, 5000));


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
