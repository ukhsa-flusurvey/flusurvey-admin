'use server';

import React from 'react';
import EmailTemplateConfigurator from '../../EmailTemplateConfigurator';
import { EmailTemplate } from '@/utils/server/types/messaging';
import { Cog } from 'lucide-react';
import ErrorAlert from '@/components/ErrorAlert';
import { auth } from '@/auth';
import { fetchCASEManagementAPI } from '@/utils/server/fetch-case-management-api';

interface EmailTemplateConfigProps {
    messageType?: string;
    studyKey?: string;
    isSystemTemplate: boolean;
}

const getGlobalMessageTemplate = async (messageType: string) => {
    const session = await auth();
    if (!session || !session.CASEaccessToken) {
        return { error: 'Unauthorized' };
    }
    const url = '/v1/messaging/email-templates/global-templates/' + messageType;
    const resp = await fetchCASEManagementAPI(
        url,
        session.CASEaccessToken,
        {
            revalidate: 0,
        }
    );
    if (resp.status !== 200) {
        return { error: `Failed to fetch message template: ${resp.status} - ${resp.body.error}` };
    }
    return resp.body;
}

const getStudyMessageTemplate = async (messageType: string, studyKey: string) => {
    const session = await auth();
    if (!session || !session.CASEaccessToken) {
        return { error: 'Unauthorized' };
    }
    const url = `/v1/messaging/email-templates/study-templates/${studyKey}/${messageType}`;
    const resp = await fetchCASEManagementAPI(
        url,
        session.CASEaccessToken,
        {
            revalidate: 0,
        }
    );
    if (resp.status !== 200) {
        return { error: `Failed to fetch message template: ${resp.status} - ${resp.body.error}` };
    }
    return resp.body;
}

const EmailTemplateConfig: React.FC<EmailTemplateConfigProps> = async (props) => {
    if (!props.messageType) {
        return (
            <ErrorAlert
                title="Error while loading template:"
                error="No valid messageType provided"
                hint="Check if your URL is correct and try again. If the problem persists, contact support."
            />
        );
    }

    let resp: any;
    if (props.studyKey) {
        resp = await getStudyMessageTemplate(props.messageType, props.studyKey);
    } else {
        resp = await getGlobalMessageTemplate(props.messageType);
    }

    const error = resp.error;
    if (error) {
        return (
            <ErrorAlert
                title={`Error while loading template '${props.messageType}':`}
                error={error}
                hint="If this is an unexpected, check you connection and try again. Try to refresh the page or log out and log in again. If the problem persists, contact support."
            />
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
