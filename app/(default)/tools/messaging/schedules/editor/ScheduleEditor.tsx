'use client';
import TwoColumnsWithCards from '@/components/TwoColumnsWithCards';
import { MessageSchedule } from '@/utils/server/types/messaging';
import { Button, Card, CardHeader, Divider, Input } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { deleteMessageSchedule } from './actions';
import { BsExclamationTriangle, BsFiletypeHtml } from 'react-icons/bs';
import LanguageSelector from '@/components/LanguageSelector';
import { decodeTemplate, encodeTemplate } from './utils';
import Filepicker from '@/components/inputs/Filepicker';


interface ScheduleEditorProps {
    schedule?: MessageSchedule;
}

const initialSchedule: MessageSchedule = {
    id: '',
    label: '',
    type: 'all-users',
    studyKey: '',
    nextTime: new Date().getTime() / 1000,
    period: 86400,
    until: 0,
    condition: undefined,
    template: {
        defaultLanguage: process.env.NEXT_PUBLIC_DEFAULT_LANGUAGE ?? 'en',
        messageType: '',
        headerOverrides: undefined,
        translations: [

        ]
    }
}

const checkMissingTranslations = (schedule: MessageSchedule): string[] => {
    const expectedLanguages = process.env.NEXT_PUBLIC_SUPPORTED_LOCALES ? process.env.NEXT_PUBLIC_SUPPORTED_LOCALES.split(',') : ['en'];
    const missingLanguages = expectedLanguages.filter(lang => {
        const t = schedule.template.translations.find(t => t.lang === lang)
        return !t || !t.subject || !t.templateDef;
    });
    return missingLanguages;
}

const ScheduleEditor: React.FC<ScheduleEditorProps> = (props) => {
    const router = useRouter();
    const [isPending, startTransition] = React.useTransition();
    const [schedule, setSchedule] = React.useState<MessageSchedule>(props.schedule ?? {
        ...initialSchedule
    });
    const [selectedLanguage, setSelectedLanguage] = React.useState<string>(process.env.NEXT_PUBLIC_DEFAULT_LANGUAGE ?? 'en');
    const [submitError, setSubmitError] = React.useState('');

    const [currentDateTime, setCurrentDateTime] = React.useState(new Date());
    useEffect(() => {
        setCurrentDateTime(new Date());
    }, []);

    useEffect(() => {
        if (!schedule) {
            setEmailPreviewDocSrc(null);
            return
        };
        const t = schedule.template.translations.find(t => t.lang === selectedLanguage);
        if (!t || !t.templateDef) {
            setEmailPreviewDocSrc(null);
            return;
        }
        const docSrc = `data:text/html;charset=UTF-8,${encodeURIComponent(decodeTemplate(t.templateDef ?? '') ?? '')}`;
        setEmailPreviewDocSrc(docSrc);
    }, [selectedLanguage, schedule]);

    const [emailPreviewDocSrc, setEmailPreviewDocSrc] = React.useState<string | null>(null);

    let errorComp: React.ReactNode = null;
    if (submitError) {
        errorComp = <div className='bg-danger-50 gap-unit-md rounded-medium p-unit-md flex items-center'>
            <div className='text-danger text-2xl'>
                <BsExclamationTriangle />
            </div>
            <div>
                <p className='text-danger font-bold'>Something went wrong</p>
                <p className='text-danger text-small'>{submitError}</p>
            </div>
        </div>
    }

    const currentTranslatedContent = schedule.template.translations.find(t => t.lang === selectedLanguage);

    console.log('schedule', schedule);
    return (
        <form>
            <h2 className="font-bold text-2xl mb-unit-sm flex items-start">
                <span className='grow'>
                    {props.schedule ? 'Edit schedule' : 'New schedule'}

                </span>
                {props.schedule && (
                    <Button
                        type='button'
                        variant='light'
                        color='danger'
                        size='sm'
                        isDisabled={isPending}
                        onPress={() => {
                            if (confirm('Are you sure you want to delete this schedule?')) {
                                if (!schedule || !schedule.id) return;

                                startTransition(async () => {
                                    try {
                                        await deleteMessageSchedule(schedule.id);
                                        router.refresh();
                                        router.replace('/tools/messaging/schedules');
                                    } catch (error: any) {
                                        console.error(error);
                                        setSubmitError(`Failed to delete schedule: ${error.message}`);
                                    }
                                })
                            }
                        }}

                    >Delete schedule</Button>
                )}
            </h2>
            {errorComp}
            <TwoColumnsWithCards
                label='Schedule infos'
                description='Set properties like how often the message should be sent and to whom.'
            >
                <div className='flex flex-col gap-unit-lg'>
                    todo: add properties
                </div>
            </TwoColumnsWithCards>
            <Divider />
            <TwoColumnsWithCards
                label="Message settings"
                description="General settings for the message."
            >

            </TwoColumnsWithCards>


            <Divider />

            <TwoColumnsWithCards
                label="Content"
                description="Set subject and content of the message for each language."
            >
                <div className='flex flex-col gap-unit-md'>
                    <div className='flex justify-end'>
                        <LanguageSelector
                            onLanguageChange={setSelectedLanguage}
                            showBadgeForLanguages={checkMissingTranslations(schedule)}
                        />

                    </div>
                    <Input
                        type='text'
                        label='Subject'
                        placeholder='Enter subject'
                        value={currentTranslatedContent?.subject ?? ''}
                        onValueChange={(value) => {
                            setSchedule((s) => {
                                const newSchedule = { ...s };
                                const translation = newSchedule.template.translations.find(t => t.lang === selectedLanguage);
                                if (translation) {
                                    translation.subject = value;
                                } else {
                                    newSchedule.template.translations.push({
                                        lang: selectedLanguage,
                                        subject: value,
                                        templateDef: '',
                                    })
                                }
                                return newSchedule;
                            })
                        }}
                        variant='bordered'
                        labelPlacement='outside'

                    />

                    <Filepicker
                        label='Pick a new file to replace/set the current template'
                        id='template-upload'
                        accept={{
                            'application/html': ['.html'],
                        }}
                        onChange={(files) => {
                            if (files.length > 0) {
                                // read file as a json
                                const reader = new FileReader();
                                reader.onload = (e) => {
                                    const text = e.target?.result;
                                    if (typeof text === 'string') {

                                        const encodedTemplate = encodeTemplate(text);
                                        if (!encodedTemplate) {
                                            setSubmitError('Failed to encode template');
                                            return;
                                        }

                                        setSchedule((s) => {
                                            const newSchedule = { ...s };
                                            const translation = newSchedule.template.translations.find(t => t.lang === selectedLanguage);
                                            if (translation) {
                                                translation.templateDef = encodedTemplate;
                                            } else {
                                                newSchedule.template.translations.push({
                                                    lang: selectedLanguage,
                                                    subject: '',
                                                    templateDef: encodedTemplate,
                                                })
                                            }
                                            return newSchedule;
                                        })
                                    }
                                }
                                reader.readAsText(files[0]);
                            }
                        }}
                    />

                    <Card
                        className='boder-large border-dsshed mt-6'>
                        <CardHeader className='bg-content2'>
                            <h3 className='font-bold text-large'>Email preview</h3>
                        </CardHeader>
                        <Divider />
                        {emailPreviewDocSrc ?
                            <iframe
                                src={emailPreviewDocSrc}
                                style={{ width: '100%', height: '500px' }}
                                title="Email template preview"
                            /> : <div className='flex flex-col items-center justify-center h-[500px]'>
                                <p className='font-bold text-large text-warning'>No template</p>
                                <BsFiletypeHtml className='mt-unit-sm text-4xl text-warning-300' />
                            </div>}
                    </Card>
                </div>
            </TwoColumnsWithCards>


            <Divider />

            <div className='mt-unit-lg flex flex-col gap-unit-lg'>
                {errorComp}
                <div className="flex justify-end gap-unit-md pb-unit-lg ">
                    <Button
                        type='submit'
                        color='primary'
                        size='lg'
                        // isDisabled={!validateStudy()}
                        isLoading={isPending}
                    >
                        {props.schedule ? 'Save changes' : 'Create schedule'}
                    </Button>
                    <Button
                        type='button'
                        color='danger'
                        variant='ghost'
                        isDisabled={isPending}
                        size='lg'
                        onPress={() => {
                            router.replace('/tools/messaging/schedules');
                        }}
                    >
                        Cancel
                    </Button>
                </div>

            </div >
        </form>
    );
};

export default ScheduleEditor;
