import ErrorAlert from '@/components/ErrorAlert';
import { EmailTemplate } from '@/utils/server/types/messaging';
import React from 'react';
import EmailTemplateLinkItem from './EmailTemplateLinkItem';
import CogLoader from '@/components/CogLoader';
import { LinkMenu } from '@/components/LinkMenu';
import { ItemListCardWrapperWithAddButton } from '@/components/ItemListCardWrapperWithAddButton';
import { getGlobalMessageTemplates } from '@/lib/data/messagingAPI';


// GlobalEmailTemplates Wrapper Card
interface GlobalEmailTemplatesCardProps {
    isLoading: boolean;
    children: React.ReactNode;
}

const GlobalEmailTemplatesCard: React.FC<GlobalEmailTemplatesCardProps> = (props) => {
    return (
        <div className="flex">
            <ItemListCardWrapperWithAddButton
                className='w-full'
                isLoading={props.isLoading}
                title="Global Email Templates"
                description="Configure email templates for global messages, like newsletters, etc."
                addHref="/tools/messaging/email-templates/global-templates/create-new-template"
                addLabel="Add New Template"
            >
                {props.children}
            </ItemListCardWrapperWithAddButton>
        </div>
    );
}

interface GlobalEmailTemplatesProps {

}

const systemMessageTypes = [
    'registration',
    'password-reset',
    'password-changed',
    'verify-email',
    'verification-code',
    'account-id-changed',
    'account-deleted',
    'invitation',
    'account-inactivity',
    'account-deleted-after-inactivity'
]


const GlobalEmailTemplates: React.FC<GlobalEmailTemplatesProps> = async (props) => {

    const resp = await getGlobalMessageTemplates();

    const globalTemplates: EmailTemplate[] | undefined = resp.templates;
    const relevantTemplates = globalTemplates?.filter((template: any) => !systemMessageTypes.includes(template.messageType));

    let cardContent = null;
    const error = null;
    if (error) {
        cardContent = <ErrorAlert
            title="Error loading global templates"
            error={error}
        />
    } else if (!relevantTemplates || relevantTemplates.length === 0) {
        cardContent = (
            <p className='py-6 text-center text-neutral-600'>
                No global templates have been created yet.
            </p>
        );
    } else {
        cardContent = (
            <LinkMenu>
                {relevantTemplates.map((template: any) => (
                    <EmailTemplateLinkItem key={template.messageType} template={template} />
                ))}
            </LinkMenu>
        )
    }


    return (
        <GlobalEmailTemplatesCard isLoading={false}>
            {cardContent}
        </GlobalEmailTemplatesCard>
    );
};

export default GlobalEmailTemplates;

export const GlobalEmailTemplatesSkeleton: React.FC<GlobalEmailTemplatesProps> = (props) => {
    return (
        <GlobalEmailTemplatesCard isLoading={true}>
            <CogLoader
                label='Loading global templates...'
            />
        </GlobalEmailTemplatesCard>
    );
}
