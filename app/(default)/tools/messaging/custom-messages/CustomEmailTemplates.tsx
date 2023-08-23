'use client';

import { AuthAPIFetcher } from '@/utils/server/fetcher';
import { EmailTemplate } from '@/utils/server/types/messaging';
import { Card, Spinner } from '@nextui-org/react';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import React from 'react';
import { BsChevronRight, BsEnvelopePaper, BsExclamationTriangle, BsGlobe2, BsJournal, BsJournalMedical } from 'react-icons/bs';
import useSWR from 'swr';

interface CustomEmailTemplatesProps {
}

interface ItemCardProps {
    template: EmailTemplate;
}

const ItemCard = (props: ItemCardProps) => {
    return <Card className="bg-white group  hover:bg-default-100"
        isPressable
        as={Link}
        href={`/tools/messaging/custom-messages/editor?messageType=${props.template.messageType}&studyKey=${props.template.studyKey || ''}`}
    >
        <div className='p-unit-md flex gap-unit-md items-center'>
            <div className='grow'>
                <div className="flex items-center gap-unit-sm">
                    {props.template.studyKey ? <>
                        <span className="text-default-400">
                            <BsJournalMedical />
                        </span>
                        <span className="font-bold text-default-500">{props.template.studyKey}</span></> : <>
                        <span className="text-default-400">
                            <BsGlobe2 />
                        </span>
                        <span className="text-default-500">general template</span></>}

                </div>

                <h3 className="font-bold group-hover:underline my-unit-1 text-large">
                    {props.template.messageType}
                </h3>
            </div>
            <div>
                <BsChevronRight className="text-default-400 text-large" />
            </div>
        </div>
    </Card>
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
]

const CustomEmailTemplates: React.FC<CustomEmailTemplatesProps> = (props) => {
    const { data, error, isLoading } = useSWR<{ templates: EmailTemplate[] }>(`/api/case-management-api/v1/messaging/email-templates`, AuthAPIFetcher)

    if (isLoading) {
        return <div className='py-unit-lg text-center'>
            <Spinner />
        </div>
    }

    let errorComp: React.ReactNode = null;
    if (error) {
        if (error.message === 'Unauthorized') {
            signOut({ callbackUrl: '/auth/login?callbackUrl=/tools/messaging/custom-templates' });
            return null;
        }

        errorComp = <div className='bg-danger-50 gap-unit-md rounded-medium p-unit-md flex items-center'>
            <div className='text-danger text-2xl'>
                <BsExclamationTriangle />
            </div>
            <div>
                <p className='text-danger font-bold'>Something went wrong</p>
                <p className='text-danger text-small'>{error.message}</p>
            </div>
        </div>
    }

    let listItems = <div className="flex py-unit-md flex-col justify-center items-center text-center">
        <BsEnvelopePaper className="text-3xl text-default-300 mb-unit-sm" />
        <p className="font-bold ">No custom email templates</p>
        <p className="text-default-500 text-small">Get started by adding a new template</p>
    </div>

    let messageTemplates: Array<EmailTemplate> = [];
    if (data && data.templates && data.templates.length > 0) {
        messageTemplates = data.templates.filter((t) => systemMessageTypes.includes(t.messageType) === false);

        if (messageTemplates.length > 0) {
            listItems = <div className="grid grid-cols-1  gap-unit-lg">
                {messageTemplates.map((t: EmailTemplate) => <ItemCard key={t.id} template={t} />)}
            </div>
        }
    }

    return (
        <>
            {errorComp}
            {listItems}
        </>
    );
};

export default CustomEmailTemplates;
