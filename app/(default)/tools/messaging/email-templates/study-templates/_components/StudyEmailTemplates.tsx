'use server'
import ErrorAlert from '@/components/ErrorAlert';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { EmailTemplate } from '@/utils/server/types/messaging';
import { Cog } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import EmailTemplateLinkItem from './EmailTemplateLinkItem';
import { auth } from '@/auth';
import { fetchCASEManagementAPI } from '@/utils/server/fetch-case-management-api';
import { LinkMenu } from '@/components/LinkMenu';


// StudyEmailTemplates Wrapper Card
interface StudyEmailTemplatesCardProps {
    isLoading: boolean;
    children: React.ReactNode;
}

const StudyEmailTemplatesCard: React.FC<StudyEmailTemplatesCardProps> = (props) => {
    return (
        <div className="flex">
            <Card
                variant={"opaque"}
                className="p-1"
            >
                <CardHeader>

                    <CardTitle>
                        Study Email Templates
                    </CardTitle>
                    <CardDescription>
                        Configure email templates for study-specific messages.
                    </CardDescription>
                </CardHeader>
                <div className='px-6'>
                    {props.children}
                </div>
                <div className='p-6'>
                    <Button
                        disabled={props.isLoading}
                        asChild={!props.isLoading}
                    >
                        <Link
                            href="/tools/messaging/email-templates/study-templates/create-new-template">
                            Add New Template
                        </Link>
                    </Button>
                </div>
            </Card>
        </div>
    );
}

interface StudyEmailTemplatesProps {

}

const getStudyMessageTemplates = async () => {
    const session = await auth();
    if (!session || !session.CASEaccessToken) {
        return { error: 'Unauthorized' };
    }
    const url = '/v1/messaging/email-templates/study-templates';
    const resp = await fetchCASEManagementAPI(
        url,
        session.CASEaccessToken,
        {
            revalidate: 0,
        }
    );
    if (resp.status !== 200) {
        return { error: `Failed to fetch message templates: ${resp.status} - ${resp.body.error}` };
    }
    return resp.body;
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
            <LinkMenu>
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
