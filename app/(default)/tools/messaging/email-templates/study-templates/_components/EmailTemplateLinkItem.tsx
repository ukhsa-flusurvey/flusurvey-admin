import { EmailTemplate } from '@/utils/server/types/messaging';
import { ChevronRight, Hash } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

interface EmailTemplateLinkItemProps {
    template: EmailTemplate;
}

const EmailTemplateLinkItem: React.FC<EmailTemplateLinkItemProps> = (props) => {
    return (
        <li>
            <Link
                href={`/tools/messaging/email-templates/study-templates/${props.template.studyKey}/${props.template.messageType}`}
                className='flex gap-4 items-center px-3 py-3 bg-gray-50 hover:bg-gray-100 transition-colors duration-200 ease-in-out cursor-pointer'
            >
                <div className='grow'>
                    <p className='text-sm font-bold'>
                        {props.template.studyKey}
                    </p>
                    <p className='font-semibold text-lg flex items-center gap-1'>
                        <Hash className='size-5 text-neutral-400' />    {props.template.messageType}
                    </p>
                </div>
                <div>
                    <ChevronRight
                        className='size-6 text-neutral-600'
                    />
                </div>
            </Link>
        </li>
    );
};

export default EmailTemplateLinkItem;
