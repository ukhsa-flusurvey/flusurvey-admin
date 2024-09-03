import ErrorAlert from '@/components/ErrorAlert';
import { getSmsTemplate } from '@/lib/data/messagingAPI';
import { SMSTemplate } from '@/utils/server/types/messaging';
import { Cog } from 'lucide-react';
import React from 'react';
import SmsTemplateConfigForm from './sms-template-config-form';

interface SmsTemplateConfigProps {
    messageType: string;
}

const SmsTemplateConfig: React.FC<SmsTemplateConfigProps> = async (props) => {
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

    const resp = await getSmsTemplate(props.messageType);
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

    let currentTemplate: SMSTemplate | undefined = resp.template;
    if (!currentTemplate) {
        currentTemplate = {
            from: process.env.NEXT_PUBLIC_APP_NAME || '',
            messageType: props.messageType || '',
            defaultLanguage: process.env.NEXT_PUBLIC_DEFAULT_LANGUAGE || 'en',
            translations: [],
        }
    }
    return (
        <SmsTemplateConfigForm
            messageType={props.messageType}
            smsTemplateConfig={currentTemplate}
        />
    );
};

// skeleton comp for loading
export const SmsTemplateConfigSkeleton: React.FC = () => {
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


export default SmsTemplateConfig;
