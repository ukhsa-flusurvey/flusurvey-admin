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
import LoadingButton from '@/components/LoadingButton';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Info } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';


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


    const buttons = <div className="flex justify-end gap-4 ">
        <LoadingButton
            type='submit'
            color='primary'
            size='lg'
            disabled={!schedule || !schedule.label || !schedule.template.translations || schedule.template.translations.length === 0 || !isDirty}
            isLoading={isPending}
            onClick={onSaveSchedule}
        >
            {props.schedule ? 'Save changes' : 'Create schedule'}
        </LoadingButton>
        <Button
            type='button'
            variant='outline'
            disabled={isPending}
            size='lg'
            onClick={() => {
                router.replace('/tools/messaging/schedules');
            }}
        >
            Cancel
        </Button>
    </div>



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
                    className='w-full space-y-4'
                >
                    <div>
                        <Card className='p-4'>
                            <TooltipProvider>
                                <div>
                                    <h3 className='font-bold text-xl mb-4'>
                                        Schedule config
                                    </h3>
                                </div>
                                <div className='grid grid-cols-2 gap-4'>
                                    <div className='space-y-4'>
                                        <div className='space-y-1'>
                                            <Label className='flex gap-2 items-center'
                                                htmlFor='schedule-label'
                                            >
                                                Label
                                                <Tooltip>
                                                    <TooltipTrigger>
                                                        <Info className='size-4 text-neutral-600' />
                                                    </TooltipTrigger>
                                                    <TooltipContent className='max-w-64'>
                                                        {'A label for this schedule. This will be used to identify the schedule in the list of schedules.'}
                                                    </TooltipContent>
                                                </Tooltip>
                                            </Label>
                                            <Input
                                                id='schedule-label'
                                                placeholder='add a label...'
                                                value={schedule.label}
                                                onChange={(event) => {
                                                    const value = event.target.value;
                                                    setIsDirty(true);
                                                    setSchedule((s) => {
                                                        const newSchedule = { ...s };
                                                        newSchedule.label = value;
                                                        return newSchedule;
                                                    })
                                                }}
                                            />
                                        </div>

                                        <div className='space-y-1'>
                                            <Label className='flex gap-2 items-center'
                                                htmlFor='message-send-to'
                                            >
                                                Send to
                                                <Tooltip>
                                                    <TooltipTrigger>
                                                        <Info className='size-4 text-neutral-600' />
                                                    </TooltipTrigger>
                                                    <TooltipContent className='max-w-96 space-y-3'>
                                                        Target group of this message.
                                                    </TooltipContent>
                                                </Tooltip>
                                            </Label>
                                            <Select
                                                name='message-send-to'
                                                value={schedule.type}
                                                onValueChange={(value) => {
                                                    setSchedule((s) => {
                                                        const newSchedule = { ...s };

                                                        newSchedule.type = value as 'all-users' | 'study-participants';
                                                        return newSchedule;
                                                    })
                                                }}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="select a target group..." />
                                                </SelectTrigger>
                                                <SelectContent className='' align='end'>
                                                    <SelectItem
                                                        key='all-users'
                                                        value='all-users'
                                                    >
                                                        All users
                                                    </SelectItem>
                                                    <SelectItem
                                                        key='study-participants'
                                                        value='study-participants'
                                                    >
                                                        Study participants
                                                    </SelectItem>
                                                </SelectContent>

                                            </Select>
                                        </div>

                                        {schedule.type === 'study-participants' && (
                                            <div className='p-4  flex flex-col gap-4 border border-neutral-200 rounded-md'>
                                                <div className='space-y-1'>
                                                    <Label className='flex gap-2 items-center'
                                                        htmlFor='schedule-study-key'
                                                    >
                                                        Label
                                                        <Tooltip>
                                                            <TooltipTrigger>
                                                                <Info className='size-4 text-neutral-600' />
                                                            </TooltipTrigger>
                                                            <TooltipContent className='max-w-64'>
                                                                {'The study key of the study from which to select participants.'}
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </Label>
                                                    <Input
                                                        id='schedule-study-key'
                                                        placeholder='add a study key...'
                                                        value={schedule.studyKey ?? ''}
                                                        onChange={(event) => {
                                                            const value = event.target.value;
                                                            setIsDirty(true);
                                                            setSchedule((s) => {
                                                                const newSchedule = { ...s };
                                                                newSchedule.studyKey = value;
                                                                return newSchedule;
                                                            })
                                                        }}
                                                    />
                                                </div>

                                                <NotImplemented>
                                                    Add a condition to filter participants
                                                </NotImplemented>
                                            </div>
                                        )}




                                    </div>
                                    <div className='space-y-4'>
                                        <div className='space-y-1'>
                                            <Label className='flex gap-2 items-center'
                                                htmlFor='schedule-next-time'
                                            >
                                                Next time
                                                <Tooltip>
                                                    <TooltipTrigger>
                                                        <Info className='size-4 text-neutral-600' />
                                                    </TooltipTrigger>
                                                    <TooltipContent className='max-w-64'>
                                                        {'The next time the message will be sent.'}
                                                    </TooltipContent>
                                                </Tooltip>
                                            </Label>
                                            <Input
                                                id='schedule-next-time'
                                                type='datetime-local'
                                                placeholder='enter next time...'
                                                value={dateToInputStr(new Date(schedule.nextTime * 1000))}
                                                min={dateToInputStr(currentDateTime)}
                                                max={dateToInputStr(addMonths(currentDateTime, 12))}
                                                onChange={(event) => {
                                                    const value = event.target.value;
                                                    setIsDirty(true);
                                                    setSchedule({
                                                        ...schedule,
                                                        nextTime: Math.floor(new Date(value).getTime() / 1000)
                                                    })
                                                }}
                                            />
                                        </div>

                                        <div className='space-y-1'>
                                            <Label className='flex gap-2 items-center'
                                                htmlFor='schedule-period'
                                            >
                                                Period
                                                <Tooltip>
                                                    <TooltipTrigger>
                                                        <Info className='size-4 text-neutral-600' />
                                                    </TooltipTrigger>
                                                    <TooltipContent className='max-w-64'>
                                                        {'The period in seconds after which the message will be sent again.'}
                                                    </TooltipContent>
                                                </Tooltip>
                                            </Label>
                                            <Input
                                                id='schedule-period'
                                                type='number'
                                                placeholder='enter period...'
                                                value={schedule.period.toString()}
                                                min={0}
                                                onChange={(event) => {
                                                    const value = parseInt(event.target.value);
                                                    setIsDirty(true);
                                                    setSchedule({
                                                        ...schedule,
                                                        period: value
                                                    })
                                                }}
                                            />
                                        </div>

                                        <div className='flex items-center gap-4'>
                                            <div className='shrink-0 flex items-center'>
                                                <Switch
                                                    id='auto-delete'
                                                    checked={schedule.until !== null && schedule.until !== undefined && schedule.until !== 0}
                                                    onCheckedChange={(value) => {
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
                                                />
                                                <Label htmlFor='auto-delete' className='ml-2'>
                                                    Auto delete
                                                </Label>
                                            </div>
                                            <div className='grow'>
                                                <div className='space-y-1'>
                                                    <Label className='flex gap-2 items-center'
                                                        htmlFor='schedule-until-time'
                                                    >
                                                        Until
                                                        <Tooltip>
                                                            <TooltipTrigger>
                                                                <Info className='size-4 text-neutral-600' />
                                                            </TooltipTrigger>
                                                            <TooltipContent className='max-w-64'>
                                                                {'The date and time after which the message will not be sent anymore and the schedule wil be deleted.'}
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </Label>
                                                    <Input
                                                        id='schedule-until-time'
                                                        type='datetime-local'
                                                        placeholder='enter a time...'
                                                        disabled={!schedule.until}
                                                        value={dateToInputStr(new Date((schedule.until || 0) * 1000))}
                                                        min={dateToInputStr(currentDateTime)}
                                                        max={dateToInputStr(addMonths(currentDateTime, 24))}
                                                        onChange={(event) => {
                                                            const value = event.target.value;
                                                            setIsDirty(true);
                                                            setSchedule({
                                                                ...schedule,
                                                                until: Math.floor(new Date(value).getTime() / 1000)
                                                            })
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </TooltipProvider>

                        </Card>
                    </div>
                    <div className='flex gap-4'>
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
                            {buttons}
                        </div>
                    </div>
                </CardContent>


            </Card>
        </div>
    )
};

export default ScheduleEditor;
