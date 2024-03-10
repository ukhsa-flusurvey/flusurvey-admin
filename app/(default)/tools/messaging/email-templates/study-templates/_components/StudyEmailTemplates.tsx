'use server'

import ErrorAlert from '@/components/ErrorAlert';
import { EmailTemplate } from '@/utils/server/types/messaging';
import { Cog } from 'lucide-react';
import React from 'react';
import EmailTemplateLinkItem from './EmailTemplateLinkItem';
import { LinkMenu } from '@/components/LinkMenu';
import { ItemListCardWrapperWithAddButton } from '@/components/ItemListCardWrapperWithAddButton';
import { getStudyMessageTemplates } from '@/lib/data/messagingAPI';


// StudyEmailTemplates Wrapper Card
interface StudyEmailTemplatesCardProps {
    isLoading: boolean;
    children: React.ReactNode;
}

const StudyEmailTemplatesCard: React.FC<StudyEmailTemplatesCardProps> = (props) => {
    return (
        <div className="flex">
            <ItemListCardWrapperWithAddButton
                className='w-full sm:w-auto'
                isLoading={props.isLoading}
                title="Study Email Templates"
                description="Configure email templates for study-specific messages."
                addHref="/tools/messaging/email-templates/study-templates/create-new-template"
                addLabel="Add New Template"
            >
                {props.children}
            </ItemListCardWrapperWithAddButton>
        </div>
    );
}

interface StudyEmailTemplatesProps {

}



const StudyEmailTemplates: React.FC<StudyEmailTemplatesProps> = async (props) => {

    const resp = await getStudyMessageTemplates();

    const studyTemplates: EmailTemplate[] | undefined = resp.templates;

    let cardContent = null;
    const error = null;
    if (error) {
        cardContent = <ErrorAlert
            title="Error loading global templates"
            error={error}
        />
    } else if (!studyTemplates || studyTemplates.length === 0) {
        cardContent = (
            <p className='py-6 text-center text-neutral-600'>
                No study templates have been created yet.
            </p>
        );
    } else {
        cardContent = (
            <LinkMenu
                className='max-h-[520px] overflow-y-auto'
            >
                {studyTemplates.map((template: any) => (
                    <EmailTemplateLinkItem key={template.messageType} template={template} />
                ))}
            </LinkMenu>
        )
    }


    return (
        <StudyEmailTemplatesCard isLoading={false}>
            {cardContent}
        </StudyEmailTemplatesCard>
    );
};

export default StudyEmailTemplates;

export const StudyEmailTemplatesSkeleton: React.FC<StudyEmailTemplatesProps> = (props) => {
    return (
        <StudyEmailTemplatesCard isLoading={true}>
            <div className='animate-pulse px-6 py-3 rounded-md bg-white'>
                <p className='text-center'>
                    Loading global templates...
                </p>
                <p className='text-center flex justify-center mt-3'>
                    <Cog className='size-8 animate-spin' />
                </p>
            </div>
        </StudyEmailTemplatesCard>
    );
}
