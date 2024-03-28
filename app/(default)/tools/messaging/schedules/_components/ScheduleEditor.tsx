'use client';

import { MessageSchedule } from '@/utils/server/types/messaging';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { deleteMessageSchedule, saveMessageSchedule } from '../../../../../../actions/messaging/schedules';
import { BsExclamationCircle, BsExclamationTriangle, BsFileEarmarkCode, BsFiletypeHtml } from 'react-icons/bs';
import clsx from 'clsx';
import NotImplemented from '@/components/NotImplemented';
import { addMonths, addWeeks, format, set } from 'date-fns';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import BackButton from '@/components/BackButton';
import { Button } from '@/components/ui/button';
import EmailContentPreviewAndEditor from '../../email-templates/_components/EmailContentPreviewAndEditor';
import MessageConfig from './MessageConfig';


const dateToInputStr = (date: Date) => {
    return format(date, 'yyyy-MM-dd\'T\'HH:mm')
}


interface ScheduleEditorProps {
    schedule?: MessageSchedule;
}

const initialSchedule: MessageSchedule = {
    id: '',
    label: '',
    type: 'all-users',
    studyKey: '',
    nextTime: Math.floor(new Date().getTime() / 1000),
    period: 86400,
    until: undefined,
    condition: undefined,
    template: {
        defaultLanguage: process.env.NEXT_PUBLIC_DEFAULT_LANGUAGE ?? 'en',
        messageType: 'weekly',
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
    const [isDirty, setIsDirty] = useState(false);


    const [currentDateTime, setCurrentDateTime] = React.useState(new Date());
    useEffect(() => {
        setCurrentDateTime(new Date());
    }, []);


    const onSaveSchedule = () => {
        startTransition(async () => {
            try {
                const resp = await saveMessageSchedule(schedule);
                if (resp.error) {
                    toast.error(resp.error);
                    return;
                }
                toast.success('Schedule saved');
                router.replace('/tools/messaging/schedules');
            } catch (error: any) {
                console.error(error);
                toast.error('Something went wrong', { description: error.message });
            }

        })
    }

    const onDeleteSchedule = () => {
        if (confirm('Are you sure you want to delete this schedule?')) {
            if (!schedule || !schedule.id) return;

            startTransition(async () => {
                try {
                    await deleteMessageSchedule(schedule.id);
                    router.refresh();
                    router.replace('/tools/messaging/schedules');
                } catch (error: any) {
                    console.error(error);
                    toast.error('Something went wrong', { description: error.message });
                }
            })
        }
    }



    return (
        <div className='w-full h-full flex flex-col gap-1'>
            <div>
                <BackButton
                    label='Back to schedules'
                    href={'/tools/messaging/schedules'}
                />
            </div>

            <Card
                variant={'opaque'}
                className='w-full h-full grow overflow-y-scroll'
            >
                <CardHeader>
                    <CardTitle className='flex items-center'>
                        <span className='grow'>
                            {props.schedule ? 'Edit schedule' : 'New schedule'}
                        </span>
                        {props.schedule && (
                            <Button
                                type='button'
                                variant='ghost'
                                size='sm'
                                disabled={isPending}
                                className='text-danger-500 hover:text-danger-600'
                                onClick={onDeleteSchedule}

                            >Delete schedule</Button>
                        )}
                    </CardTitle>
                </CardHeader>

                <CardContent
                    className='w-full flex gap-4'
                >
                    <Card className='grow'>
                        <EmailContentPreviewAndEditor
                            emailTemplateConfig={schedule.template}
                            onChange={(newConfig) => {
                                setIsDirty(true);
                                setSchedule((s) => {
                                    const newSchedule = { ...s };
                                    newSchedule.template = newConfig;
                                    return newSchedule;
                                });
                            }}
                        />
                    </Card>
                    <div className='space-y-4'>
                        <p>schedule edit</p>
                        <Card>
                            <MessageConfig
                                emailTemplateConfig={schedule.template}
                                isNewTemplate={true}
                                onChange={(newConfig) => {
                                    setIsDirty(true);
                                    setSchedule((s) => {
                                        const newSchedule = { ...s };
                                        newSchedule.template = newConfig;
                                        return newSchedule;
                                    });
                                }}
                            />
                        </Card>
                        <p>buttons</p>
                    </div>
                </CardContent>


            </Card>
        </div>
    )

    return (
        <form
            className='w-full'
        >

            <TwoColumnsWithCards
                label='Schedule infos'
                description='Set properties like how often the message should be sent and to whom.'
            >
                <div className='flex flex-col gap-4'>
                    <Input
                        id='label'
                        type='text'
                        label='Label'
                        placeholder='Enter label'
                        value={schedule.label}
                        onValueChange={(value) => {
                            setSchedule((s) => {
                                const newSchedule = { ...s };
                                newSchedule.label = value;
                                return newSchedule;
                            })
                        }}
                        variant='bordered'
                        labelPlacement='outside'
                        description='A label for this schedule. This will be used to identify the schedule in the list of schedules.'
                    />


                    <Select
                        label='Send to'
                        labelPlacement='outside'
                        variant='bordered'
                        placeholder='Select target group'
                        description='Target group of this message.'
                        selectedKeys={new Set([schedule.type])}
                        onSelectionChange={(keys: Set<React.Key> | 'all') => {
                            const selectedKey = (keys as Set<React.Key>).values().next().value;
                            if (!selectedKey) return;
                            setSchedule((s) => {
                                const newSchedule = { ...s };

                                newSchedule.type = selectedKey;
                                return newSchedule;
                            })
                        }}
                    >
                        <SelectItem
                            key='all-users'
                            value='all-users'
                            description='Consider all users in the system when sending the message'
                        >
                            All users
                        </SelectItem>
                        <SelectItem
                            key='study-participants'
                            value='study-participants'
                            description='Only consider users that are participating in a specific study who fulfill a condition'
                        >
                            Study participants
                        </SelectItem>
                    </Select>

                    {schedule.type === 'study-participants' && (
                        <div className='p-4  flex flex-col gap-4 border border-neutral-200 rounded-medium'>
                            <Input
                                label='From study (by study key)'
                                placeholder='Enter the study key'
                                value={schedule.studyKey ?? ''}
                                onValueChange={(value) => {
                                    setSchedule((s) => {
                                        const newSchedule = { ...s };
                                        newSchedule.studyKey = value;
                                        return newSchedule;
                                    })
                                }}
                                variant='bordered'
                                labelPlacement='outside'
                                description='The study key of the study from which to select participants.'
                            />
                            <NotImplemented>
                                Add a condition to filter participants
                            </NotImplemented>
                        </div>
                    )}


                    <Input
                        type='datetime-local'
                        label='Next time'
                        placeholder='Enter next time'
                        value={dateToInputStr(new Date(schedule.nextTime * 1000))}
                        min={dateToInputStr(currentDateTime)}
                        max={dateToInputStr(addMonths(currentDateTime, 12))}
                        onValueChange={(value) => {
                            setSchedule({
                                ...schedule,
                                nextTime: Math.floor(new Date(value).getTime() / 1000)
                            })
                        }}
                        variant='bordered'
                        labelPlacement='outside'
                        description='The next time the message will be sent.'
                    />

                    <Input
                        type='number'
                        label='Period'
                        placeholder='Enter period'
                        value={schedule.period.toString()}
                        min={0}
                        onValueChange={(value) => {
                            setSchedule({
                                ...schedule,
                                period: parseInt(value)
                            })
                        }
                        }
                        variant='bordered'
                        labelPlacement='outside'
                        description='The period in seconds after which the message will be sent again.'
                        endContent={<span className='text-neutral-400'>seconds</span>}
                    />

                    <div className='flex items-center gap-4'>
                        <div className='shrink-0'>
                            <Switch
                                isSelected={schedule.until !== null && schedule.until !== undefined && schedule.until !== 0}
                                onValueChange={(value) => {
                                    setSchedule((s) => {
                                        const newSchedule = { ...s };
                                        if (value) {
                                            newSchedule.until = Math.floor(addWeeks(new Date(), 1).getTime() / 1000);
                                        } else {
                                            newSchedule.until = undefined;
                                        }
                                        return newSchedule;
                                    })
                                }}
                            >
                                Auto delete
                            </Switch>
                        </div>
                        <div className='grow'>
                            <Input
                                id='until'
                                type='datetime-local'
                                label='Until (optional)'
                                placeholder='Enter date time'
                                isDisabled={!schedule.until}
                                value={dateToInputStr(new Date((schedule.until || 0) * 1000))}
                                min={dateToInputStr(currentDateTime)}
                                max={dateToInputStr(addMonths(currentDateTime, 24))}
                                onValueChange={(value) => {
                                    setSchedule({
                                        ...schedule,
                                        until: Math.floor(new Date(value).getTime() / 1000)
                                    })
                                }}
                                variant='bordered'
                                labelPlacement='outside'
                                description='The date and time after which the message will not be sent anymore and the schedule wil be deleted.'
                            />
                        </div>
                    </div>
                </div>
            </TwoColumnsWithCards>



            <div className='mt-6 flex flex-col gap-6'>
                {errorComp}
                <div className="flex justify-end gap-4 pb-6 ">
                    <Button
                        type='submit'
                        color='primary'
                        size='lg'
                        isDisabled={!schedule || !schedule.label || !schedule.template.translations || schedule.template.translations.length === 0}
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
        </form >
    );
};

export default ScheduleEditor;
