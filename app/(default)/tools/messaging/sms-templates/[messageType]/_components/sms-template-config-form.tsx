'use client';

import { uploadSmsTemplate } from '@/actions/messaging/sms-templates';
import LoadingButton from '@/components/loading-button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SMSTemplate } from '@/utils/server/types/messaging';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import ContentEditor from '../../../email-templates/_components/ContentEditor';
import LanguageSelector from '@/components/LanguageSelector';
import { decodeTemplate, encodeTemplate } from '../../../schedules/_components/utils';
import { Separator } from '@/components/ui/separator';
import getErrorMessage from '@/utils/getErrorMessage';

interface SmsTemplateConfigFormProps {
    smsTemplateConfig: SMSTemplate;
    messageType?: string;
}

const checkMissingTranslations = (template: SMSTemplate): string[] => {
    const expectedLanguages = process.env.NEXT_PUBLIC_SUPPORTED_LOCALES ? process.env.NEXT_PUBLIC_SUPPORTED_LOCALES.split(',') : ['en'];
    const missingLanguages = expectedLanguages.filter(lang => {
        const t = template.translations.find(t => t.lang === lang)
        return !t || !t.templateDef;
    });
    return missingLanguages;
}

const SmsTemplateConfigForm: React.FC<SmsTemplateConfigFormProps> = (props) => {
    const [smsTemplateConfig, setSmsTemplateConfig] = React.useState<SMSTemplate>(props.smsTemplateConfig);
    const router = useRouter();
    const [isPending, startTransition] = React.useTransition();
    const [isDirty, setIsDirty] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = React.useState<string>(process.env.NEXT_PUBLIC_DEFAULT_LANGUAGE ?? 'en');
    const [smsDocSrc, setSmsDocSrc] = React.useState<string | null>(null);

    useEffect(() => {
        setSmsTemplateConfig(props.smsTemplateConfig);
        setIsDirty(false);
    }, [props.smsTemplateConfig, props.messageType]);

    const onSaveSmsTemplate = () => {
        startTransition(async () => {
            try {
                const resp = await uploadSmsTemplate(smsTemplateConfig);
                if (resp.error) {
                    toast.error(resp.error);
                    return;
                }
                toast.success('SMS template saved');
                router.refresh();
                setIsDirty(false);
            } catch (error: unknown) {
                console.error(error);
                toast.error('Something went wrong', { description: getErrorMessage(error) });
            }

        })
    }

    useEffect(() => {
        const t = smsTemplateConfig.translations.find(t => t.lang === selectedLanguage);
        if (!t || !t.templateDef) {
            setSmsDocSrc(null);
            return;
        }
        const docSrc = decodeTemplate(t.templateDef ?? '') ?? '';
        setSmsDocSrc(docSrc);
    }, [selectedLanguage, smsTemplateConfig]);

    const onUpdateTemplateContent = (newTemplateContent: string) => {
        const encodedTemplate = encodeTemplate(newTemplateContent);
        if (!encodedTemplate) {
            toast.error('Failed to encode template');
            return;
        }

        const newSmsTemplateConfig = { ...smsTemplateConfig };
        const translation = newSmsTemplateConfig.translations.find(t => t.lang === selectedLanguage);
        if (translation) {
            translation.templateDef = encodedTemplate;
        } else {
            newSmsTemplateConfig.translations.push({
                lang: selectedLanguage,
                templateDef: encodedTemplate,
            })
        }
        setSmsTemplateConfig(newSmsTemplateConfig);
        setIsDirty(true);
    }


    return (
        <div className='w-full h-full flex flex-col gap-1'>
            <Card
                variant={'opaque'}
                className='w-full h-full grow overflow-y-scroll'
            >
                <CardHeader>
                    <CardTitle className='flex items-center'>
                        <span className='grow'>
                            Edit SMS template
                        </span>
                    </CardTitle>
                </CardHeader>

                <CardContent
                    className='w-full flex flex-col gap-4'
                >
                    <Card className='grow p-6'>
                        <div className='space-y-1.5'>
                            <Label
                                htmlFor='sms-from'
                            >
                                From
                            </Label>
                            <Input
                                id='sms-from'
                                type='text'
                                value={smsTemplateConfig.from}
                                placeholder='Enter the sender of the SMS message...'
                                maxLength={11}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    const updatedTemplate = { ...smsTemplateConfig };
                                    updatedTemplate.from = value;
                                    setSmsTemplateConfig(updatedTemplate);
                                    setIsDirty(true);
                                }}
                            />
                            <p className='text-xs'>
                                The sender ID (or SMS sender name) is a string of up to 11 alphanumeric characters.
                            </p>
                        </div>


                        <div className='space-y-4 mt-6'>
                            <Separator />
                            <h3 className='font-semibold text-sm mb-2'>
                                Content
                            </h3>
                            <div className='flex justify-end'>
                                <LanguageSelector
                                    onLanguageChange={setSelectedLanguage}
                                    showBadgeForLanguages={checkMissingTranslations(smsTemplateConfig)}
                                />
                            </div>

                            <ContentEditor
                                content={smsDocSrc ?? ''}
                                onChange={(content) => {
                                    onUpdateTemplateContent(content);
                                }}
                            />


                        </div>



                        {/*           <EmailContentPreviewAndEditor
                            emailTemplateConfig={emailTemplateConfig}
                            onChange={(newConfig) => {
                                setIsDirty(true);
                                setEmailTemplateConfig(newConfig)
                            }}
                        /> */}
                    </Card>
                    <div className='space-y-4'>

                        <div className="flex justify-end gap-4 pb-6 ">
                            <LoadingButton
                                disabled={!smsTemplateConfig || !smsTemplateConfig.translations || smsTemplateConfig.translations.length === 0 || !isDirty}
                                isLoading={isPending}
                                onClick={() => {
                                    onSaveSmsTemplate();
                                }}
                            >
                                Save changes
                            </LoadingButton>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default SmsTemplateConfigForm;
