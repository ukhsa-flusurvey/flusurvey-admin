import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { EmailTemplate } from '@/utils/server/types/messaging';
import { Info } from 'lucide-react';
import React from 'react';

interface MessageConfigProps {
    emailTemplateConfig: EmailTemplate;
    isNewTemplate: boolean;
    isSystemTemplate?: boolean;
    isGlobalTemplate?: boolean;
    availableStudyKeys?: string[];
    onChange: (template: EmailTemplate) => void;
}

const MessageConfig: React.FC<MessageConfigProps> = (props) => {
    const availableStudyKeys = props.availableStudyKeys ?? [];
    if (props.emailTemplateConfig.studyKey && !availableStudyKeys.includes(props.emailTemplateConfig.studyKey)) {
        availableStudyKeys.push(props.emailTemplateConfig.studyKey);
    }

    console.log(availableStudyKeys)

    return (
        <TooltipProvider>
            <div className='p-4 min-w-96 max-w-96 space-y-4'>
                <div>
                    <h3 className='font-bold text-xl'>
                        Message config
                    </h3>
                </div>

                <div className='space-y-4'>
                    <div className='space-y-1'>
                        <Label className='flex gap-2 items-center'
                            htmlFor='message-type'
                        >
                            Message type
                            {!props.isSystemTemplate && <Tooltip>
                                <TooltipTrigger>
                                    <Info className='size-4 text-neutral-600' />
                                </TooltipTrigger>
                                <TooltipContent className='max-w-64'>
                                    {'This message type will be used to identify the message in the system, e.g. "T3_reminder". Cannot be changed later.'}
                                </TooltipContent>
                            </Tooltip>}
                        </Label>
                        <Input
                            id='message-type'
                            readOnly={!props.isNewTemplate}
                            placeholder='Enter the message type'
                            value={props.emailTemplateConfig.messageType ?? ''}
                            onChange={(event) => {
                                const value = event.target.value;
                                const newEmailTemplateConfig = { ...props.emailTemplateConfig };
                                newEmailTemplateConfig.messageType = value;
                                props.onChange(newEmailTemplateConfig);
                            }}
                        />
                    </div>

                    {(!props.isSystemTemplate && !props.isGlobalTemplate) && <div className='space-y-1'>
                        <Label className='flex gap-2 items-center'
                            htmlFor='study-key'
                        >
                            Study key
                            <Tooltip>
                                <TooltipTrigger>
                                    <Info className='size-4 text-neutral-600' />
                                </TooltipTrigger>
                                <TooltipContent className='max-w-64'>
                                    {'Assign this message to a study if you want to use it in a study, to avoid name (message type) collisions. Cannot be changed later.'}
                                </TooltipContent>
                            </Tooltip>
                        </Label>
                        <Select
                            //id='study-key'
                            disabled={!props.isNewTemplate}
                            value={props.emailTemplateConfig.studyKey ?? ''}
                            onValueChange={(value) => {
                                const newEmailTemplateConfig = { ...props.emailTemplateConfig };
                                newEmailTemplateConfig.studyKey = value;
                                props.onChange(newEmailTemplateConfig);
                            }}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select a study key..." />
                            </SelectTrigger>
                            <SelectContent>
                                {availableStudyKeys?.map((studyKey) => {
                                    return <SelectItem
                                        key={studyKey}
                                        value={studyKey}
                                    >{studyKey}</SelectItem>
                                })}
                            </SelectContent>
                        </Select>
                    </div>}

                    <Separator />

                    <div className=''>

                        <div className='flex items-center mb-2 gap-2'>
                            <Switch
                                id='override-headers-toggle'
                                checked={props.emailTemplateConfig.headerOverrides !== null && props.emailTemplateConfig.headerOverrides !== undefined}
                                onCheckedChange={(checked) => {
                                    if (!checked && props.emailTemplateConfig.headerOverrides !== undefined && (
                                        props.emailTemplateConfig.headerOverrides.from ||
                                        (props.emailTemplateConfig.headerOverrides.replyTo && props.emailTemplateConfig.headerOverrides.replyTo.length > 0) ||
                                        props.emailTemplateConfig.headerOverrides.sender
                                    )) {
                                        if (!confirm('Are you sure you want to remove the email header overrides?')) {
                                            return;
                                        }
                                    }

                                    const newTemplateConfig = { ...props.emailTemplateConfig };
                                    if (checked) {
                                        newTemplateConfig.headerOverrides = {
                                            from: '',
                                            replyTo: [],
                                            noReplyTo: false,
                                            sender: '',
                                        }
                                    } else {
                                        newTemplateConfig.headerOverrides = undefined;
                                    }

                                    props.onChange(newTemplateConfig);
                                }}
                            />
                            <Label htmlFor='override-headers-toggle'>
                                Override email headers
                            </Label>
                        </div>

                        <p className='text-xs text-neutral-600'>
                            Override the email headers for this message. This will override the default headers set in the email server configuration.
                        </p>
                        <div
                            className={cn('flex flex-col gap-4 mt-4 p-4 border border-default-200 rounded-md',
                                {
                                    'hidden bg-gray-100 opacity-50': !props.emailTemplateConfig.headerOverrides
                                }
                            )}
                        >
                            <div className='space-y-1'>
                                <Label className='flex gap-2 items-center'
                                    htmlFor='header-from'
                                >
                                    From
                                    <Tooltip>
                                        <TooltipTrigger>
                                            <Info className='size-4 text-neutral-600' />
                                        </TooltipTrigger>
                                        <TooltipContent className='max-w-64'>
                                            {'This will appear as the sender of the email. E.g. "Name <email@comp.tld" or simply "email@comp.tld"'}
                                        </TooltipContent>
                                    </Tooltip>
                                </Label>
                                <Input
                                    id='header-from'
                                    placeholder='enter email address...'
                                    type='email'
                                    value={props.emailTemplateConfig.headerOverrides?.from ?? ''}
                                    disabled={!props.emailTemplateConfig.headerOverrides}
                                    onChange={(event) => {
                                        const value = event.target.value;
                                        const newEmailTemplateConfig = { ...props.emailTemplateConfig };
                                        if (newEmailTemplateConfig.headerOverrides) {
                                            newEmailTemplateConfig.headerOverrides.from = value;
                                        }
                                        props.onChange(newEmailTemplateConfig);
                                    }}
                                />
                            </div>

                            <div className='space-y-1'>
                                <Label className='flex gap-2 items-center'
                                    htmlFor='header-sender'
                                >
                                    Sender
                                    <Tooltip>
                                        <TooltipTrigger>
                                            <Info className='size-4 text-neutral-600' />
                                        </TooltipTrigger>
                                        <TooltipContent className='max-w-64'>
                                            {'This email address will be used for the email server as a sender.'}
                                        </TooltipContent>
                                    </Tooltip>
                                </Label>
                                <Input
                                    id='header-from'
                                    placeholder='enter email address...'
                                    type='email'
                                    value={props.emailTemplateConfig.headerOverrides?.sender ?? ''}
                                    disabled={!props.emailTemplateConfig.headerOverrides}
                                    onChange={(event) => {
                                        const value = event.target.value;
                                        const newEmailTemplateConfig = { ...props.emailTemplateConfig };
                                        if (newEmailTemplateConfig.headerOverrides) {
                                            newEmailTemplateConfig.headerOverrides.sender = value;
                                        }
                                        props.onChange(newEmailTemplateConfig);
                                    }}
                                />
                            </div>

                            <div className='space-y-1'>
                                <Label className='flex gap-2 items-center'
                                    htmlFor='header-sender'
                                >
                                    Reply to
                                    <Tooltip>
                                        <TooltipTrigger>
                                            <Info className='size-4 text-neutral-600' />
                                        </TooltipTrigger>
                                        <TooltipContent className='max-w-64'>
                                            {'List of email addresses that will be used as reply to addresses. Comma separated.'}
                                        </TooltipContent>
                                    </Tooltip>
                                </Label>
                                <Input
                                    id='header-replyto'
                                    placeholder='enter email addresses...'
                                    type='text'
                                    value={props.emailTemplateConfig.headerOverrides?.replyTo?.join(',') ?? ''}
                                    disabled={!props.emailTemplateConfig.headerOverrides}
                                    onChange={(event) => {
                                        const value = event.target.value;
                                        const newEmailTemplateConfig = { ...props.emailTemplateConfig };
                                        if (newEmailTemplateConfig.headerOverrides) {
                                            newEmailTemplateConfig.headerOverrides.replyTo = value.split(',').map(v => v.trim());
                                        }
                                        props.onChange(newEmailTemplateConfig);
                                    }}
                                />
                            </div>

                            <div className='flex items-center gap-2'>
                                <Checkbox
                                    checked={props.emailTemplateConfig.headerOverrides?.noReplyTo ?? false}
                                    onCheckedChange={(checked) => {

                                        const newTemplateConfig = { ...props.emailTemplateConfig };
                                        if (newTemplateConfig.headerOverrides) {
                                            newTemplateConfig.headerOverrides.noReplyTo = checked ? true : false
                                        }
                                        props.onChange(newTemplateConfig);

                                    }
                                    }
                                    id='header-no-reply-to'
                                />
                                <Label htmlFor='header-no-reply-to'>
                                    {'Mark this address with "no-reply"'}
                                </Label>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </TooltipProvider >
    );
};

export default MessageConfig;
