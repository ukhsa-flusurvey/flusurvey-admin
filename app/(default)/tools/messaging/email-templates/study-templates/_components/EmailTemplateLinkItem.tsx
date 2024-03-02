import { LinkMenuItem } from '@/components/LinkMenu';
import { EmailTemplate } from '@/utils/server/types/messaging';
import { Hash } from 'lucide-react';


import React from 'react';

interface EmailTemplateLinkItemProps {
    template: EmailTemplate;
}

const EmailTemplateLinkItem: React.FC<EmailTemplateLinkItemProps> = (props) => {
    return (
        <LinkMenuItem
            href={`/tools/messaging/email-templates/study-templates/${props.template.studyKey}/${props.template.messageType}`}
        >

            <p className='text-sm font-bold'>
                {props.template.studyKey}
            </p>
            <p className='font-semibold text-lg flex items-center gap-1'>
                <Hash className='size-5 text-neutral-400' />    {props.template.messageType}
            </p>

        </LinkMenuItem>
    );
};

export default EmailTemplateLinkItem;
