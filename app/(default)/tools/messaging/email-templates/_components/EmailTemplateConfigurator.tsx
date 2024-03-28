'use client'

import TwoColumnsWithCards from '@/components/TwoColumnsWithCards';
import { EmailTemplate } from '@/utils/server/types/messaging';
import React, { useEffect, useState } from 'react';
import { BsExclamationCircle, BsFileEarmarkCode } from 'react-icons/bs';
import { useRouter } from 'next/navigation';
import {
    deleteEmailTemplate,
    uploadEmailTemplate,
} from '../../../../../../actions/messaging/email-templates';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import BackButton from '@/components/BackButton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import EmailContentPreviewAndEditor from './EmailContentPreviewAndEditor';
import MessageConfig from './MessageConfig';
import LoadingButton from '@/components/LoadingButton';


interface EmailTemplateConfiguratorProps {
    emailTemplateConfig?: EmailTemplate;
    messageType?: string;
    isSystemTemplate: boolean;
    isGlobalTemplate?: boolean;
}

const initialEmailTemplate: EmailTemplate = {
    messageType: '',
    studyKey: '',
    defaultLanguage: process.env.NEXT_PUBLIC_DEFAULT_LANGUAGE || 'en',
    headerOverrides: undefined,
    translations: [],
};

const EmailTemplateConfigurator: React.FC<EmailTemplateConfiguratorProps> = (props) => {
    const [emailTemplateConfig, setEmailTemplateConfig] = React.useState<EmailTemplate>(props.emailTemplateConfig ? props.emailTemplateConfig : { ...initialEmailTemplate });
    const router = useRouter();
    const [isPending, startTransition] = React.useTransition();
    const [isDirty, setIsDirty] = useState(false);

    useEffect(() => {
        if (props.emailTemplateConfig) {
            setEmailTemplateConfig(props.emailTemplateConfig);
        } else {
            setEmailTemplateConfig({ ...initialEmailTemplate, messageType: props.messageType ?? '' });

        }
        setIsDirty(false);
    }, [props.emailTemplateConfig, props.messageType]);


    const onDeleteEmailTemplate = () => {
        if (confirm('Are you sure you want to delete this message template?')) {
            if (!emailTemplateConfig || !emailTemplateConfig.id) return;

            startTransition(async () => {
                try {
                    const resp = await deleteEmailTemplate(
                        emailTemplateConfig.messageType,
                        emailTemplateConfig.studyKey ?? '');
                    if (resp.error) {
                        toast.error(resp.error);
                        return;
                    }
                    toast.success('Message template deleted');
                    router.back();

                } catch (error: any) {
                    console.error(error);
                    toast.error('Something went wrong', { description: error.message });
                }
            })
        }
    }

    const onSaveEmailTemplate = () => {
        startTransition(async () => {
            try {
                const resp = await uploadEmailTemplate(emailTemplateConfig);
                if (resp.error) {
                    toast.error(resp.error);
                    return;
                }
                toast.success('Message template saved');
                if (!props.emailTemplateConfig) {
                    if (props.isGlobalTemplate) {
                        router.replace(`/tools/messaging/email-templates/global-templates/${emailTemplateConfig.messageType}`);
                    } else if (!props.isSystemTemplate) {
                        router.replace(`/tools/messaging/email-templates/study-templates/${emailTemplateConfig.studyKey}/${emailTemplateConfig.messageType}`);
                    }
                }
                setIsDirty(false);
            } catch (error: any) {
                console.error(error);
                toast.error('Something went wrong', { description: error.message });
            }

        })
    }

    return (
        <div className='w-full h-full flex flex-col gap-1'>
            <div>
                <BackButton
                    label='Back to email templates'
                    href={props.isGlobalTemplate ? '/tools/messaging/email-templates/global-templates' : '/tools/messaging/email-templates/study-templates'}
                />
            </div>

            <Card
                variant={'opaque'}
                className='w-full h-full grow overflow-y-scroll'
            >
                <CardHeader>
                    <CardTitle className='flex items-center'>
                        <span className='grow'>
                            {props.emailTemplateConfig ? 'Edit edit template' : 'New template'}
                        </span>
                        {(props.emailTemplateConfig && !props.isSystemTemplate) && (
                            <Button
                                type='button'
                                variant='ghost'
                                size='sm'
                                disabled={isPending}
                                className='text-danger-500 hover:text-danger-600'
                                onClick={onDeleteEmailTemplate}

                            >Delete template</Button>
                        )}
                    </CardTitle>
                </CardHeader>

                <CardContent
                    className='w-full flex gap-4'
                >
                    <Card className='grow'>
                        <EmailContentPreviewAndEditor
                            emailTemplateConfig={emailTemplateConfig}
                            onChange={(newConfig) => {
                                setIsDirty(true);
                                setEmailTemplateConfig(newConfig)
                            }}
                        />
                    </Card>
                    <div className='space-y-4'>
                        <Card>
                            <MessageConfig
                                emailTemplateConfig={emailTemplateConfig}
                                isNewTemplate={!props.emailTemplateConfig}
                                isSystemTemplate={props.isSystemTemplate}
                                isGlobalTemplate={props.isGlobalTemplate}
                                onChange={(newConfig) => {
                                    setIsDirty(true);
                                    setEmailTemplateConfig(newConfig)
                                }}
                            />
                        </Card>


                        <div className="flex justify-end gap-4 pb-6 ">
                            <LoadingButton
                                disabled={!emailTemplateConfig || !emailTemplateConfig.translations || emailTemplateConfig.translations.length === 0 || !isDirty}
                                isLoading={isPending}
                                onClick={() => {
                                    onSaveEmailTemplate();
                                }}
                            >
                                {props.emailTemplateConfig ? 'Save changes' : 'Create message template'}
                            </LoadingButton>
                            {!props.isSystemTemplate && (
                                <Button
                                    type='button'
                                    variant='outline'
                                    disabled={isPending}
                                    onClick={() => {
                                        router.back();
                                    }}
                                >
                                    Cancel
                                </Button>)}
                        </div>
                    </div>
                </CardContent>
            </Card>

        </div>
    );

    return (
        <form
            className='w-full'
        >




            <TwoColumnsWithCards


            >
                <div className='flex flex-col gap-4'>




                    <div>
                        <div className='flex flex-col w-full max-w-full h-[566px]'>
                            <Tabs aria-label="Preview mode" color="default" variant="solid">
                                <Tab
                                    key="source"
                                    title={
                                        <div className="flex items-center space-x-2">
                                            <BsFileEarmarkCode />
                                            <span>Source</span>
                                        </div>
                                    }
                                >
                                    <Code
                                        className='h-[500px] w-full max-w-full overflow-x-scroll'
                                    >
                                        <ScrollShadow
                                            className='h-full'
                                            size={60}
                                        >
                                            {emailPreviewDocSrc ? <>{emailPreviewDocSrc.split('\n').map(
                                                (line, i) => {
                                                    let tabCount = 0;
                                                    let spaceCount = 0;
                                                    const tabMatcher = line.match(/^\t*/);
                                                    if (tabMatcher && tabMatcher.length > 0) {
                                                        tabCount = (tabMatcher[0] || '').length;
                                                    }
                                                    const spaceMatcher = line.match(/^\s*/);
                                                    if (spaceMatcher && spaceMatcher.length > 0) {
                                                        spaceCount = (spaceMatcher[0] || '').length;
                                                    }
                                                    return <div key={i} className='flex items-center'>
                                                        <span className='text-default-400 text-sm w-6 mr-2'>{i + 1}</span>
                                                        <span style={{ width: tabCount * 8 }}></span>
                                                        <span style={{ width: spaceCount * 2 }}></span>
                                                        {line}
                                                    </div>
                                                }
                                            )}</> : <div className='flex flex-col items-center justify-center h-full'>
                                                <p className='font-bold text-lg text-warning'>No template</p>
                                                <BsExclamationCircle className='mt-2 text-4xl text-warning-300' />
                                            </div>}
                                        </ScrollShadow>
                                    </Code>

                                </Tab>

                            </Tabs>
                        </div>
                    </div>
                </div>
            </TwoColumnsWithCards>
        </form >
    );
};

export default EmailTemplateConfigurator;
