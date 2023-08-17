'use client';

import React, { useEffect } from 'react';

import { MessageSchedule } from '@/utils/server/types/messaging';
import { RadioGroup } from '@headlessui/react';
import { CheckBadgeIcon } from '@heroicons/react/24/outline';
import InputForm from '../inputs/Input';
import { addMonths, format } from 'date-fns';
import NotImplemented from '../NotImplemented';
import Filepicker from '../inputs/Filepicker';
import { encodeTemplate } from './utils';
import { useRouter } from 'next/navigation';
import { deleteMessageSchedule, saveMessageSchedule } from './actions';
import { useSession } from 'next-auth/react';


interface MessageScheduleEditorProps {
    scheduleToEdit?: MessageSchedule;
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
            {
                lang: process.env.NEXT_PUBLIC_DEFAULT_LANGUAGE ?? 'en',
                subject: '',
                templateDef: '',
            }
        ]
    }
}


const dateToInputStr = (date: Date) => {
    return format(date, 'yyyy-MM-dd\'T\'HH:mm')
}

const MessageScheduleEditor: React.FC<MessageScheduleEditorProps> = (props) => {
    const [schedule, setSchedule] = React.useState<MessageSchedule>(props.scheduleToEdit ?? {
        ...initialSchedule
    });

    const [isPending, startTransition] = React.useTransition();
    const router = useRouter();
    const [showSubmitError, setShowSubmitError] = React.useState(false);

    const [currentDateTime, setCurrentDateTime] = React.useState(new Date());
    useEffect(() => {
        setCurrentDateTime(new Date());
    }, []);

    const session = useSession({
        required: true,
        onUnauthenticated() {
            router.push('/auth/login?callbackUrl=/tools/admin-v1/messaging/schedules');
        }
    });


    const scheduleTypeSelector = <RadioGroup value={schedule.type}
        onChange={(value) => {
            setSchedule({
                ...schedule,
                type: value as MessageSchedule['type']
            })
        }}
    >
        <RadioGroup.Label className='block text-sm font-medium text-gray-700 mb-1'>
            Message Recipients
        </RadioGroup.Label>
        <div className='flex items-center rounded bg-slate-200'>
            <RadioGroup.Option
                className='w-1/2 rounded-l ui-checked:bg-sky-600 focus:outline-none focus:ring-4 focus:ring-sky-600/60 ui-checked:text-white py-2 flex items-center font-medium justify-center cursor-pointer'
                value='all-users'
            >
                {({ checked }) => (
                    <>
                        {checked && <CheckBadgeIcon className='w-4 h-4 text-white/80 me-1' />}
                        <span className=''>All Users</span>
                    </>

                )}
            </RadioGroup.Option>
            <RadioGroup.Option
                className='w-1/2 rounded-r ui-checked:bg-sky-600 focus:outline-none focus:ring-4 focus:ring-sky-600/60 ui-checked:text-white py-2 flex items-center font-medium justify-center cursor-pointer'
                value='study-participants'
            >
                {({ checked }) => (
                    <>
                        {checked && <CheckBadgeIcon className='w-4 h-4 text-white/80 me-1' />}
                        <span className=''>Study Participants</span>

                    </>
                )}
            </RadioGroup.Option>
        </div>
    </RadioGroup>

    return (
        <div className='flex flex-col gap-4 p-4 bg-white rounded'>
            <h1 className='text-2xl font-bold'>
                {schedule.id ? 'Edit' : 'New'} Message Schedule
            </h1>
            <form className='divide-y'
                onSubmit={(event) => {
                    event.preventDefault();
                    setShowSubmitError(false);
                    startTransition(async () => {
                        console.log(schedule);
                        try {
                            await saveMessageSchedule(schedule, session.data?.accessToken ?? '');
                            router.refresh();
                            router.push('/tools/admin-v1/messaging/schedules');
                        } catch (error) {
                            console.error(error);
                            setShowSubmitError(true);
                        }

                    })
                }}
            >

                <div className='flex flex-col gap-4 pb-4'>
                    <h3>Schedule configuration:</h3>
                    <InputForm
                        id='label'
                        label='Label'
                        className='w-full'
                        value={schedule.label}
                        required
                        onChange={(event) => {
                            setSchedule({
                                ...schedule,
                                label: event.target.value
                            })
                        }}
                    />

                    {scheduleTypeSelector}

                    {schedule.type === 'study-participants' && (
                        <div className='p-4 flex flex-col gap-4 bg-slate-50 rounded'>
                            <h4 className='font-semibold text-gray-700'>Participant selection:</h4>
                            <InputForm
                                label='From study (by study key)'
                                placeholder='Enter the study key'
                                value={schedule.studyKey}
                                onChange={(event) => {
                                    setSchedule({
                                        ...schedule,
                                        studyKey: event.target.value
                                    })
                                }}
                            />
                            <NotImplemented>
                                Add a condition to filter participants
                            </NotImplemented>
                        </div>
                    )}

                    <InputForm
                        id='next-time'
                        label='Next Time'
                        type='datetime-local'
                        value={dateToInputStr(new Date(schedule.nextTime * 1000))}
                        min={dateToInputStr(currentDateTime)}
                        max={dateToInputStr(addMonths(currentDateTime, 12))}
                        onChange={(event) => {
                            console.log(event.target.value);
                            setSchedule({
                                ...schedule,
                                nextTime: Math.floor(new Date(event.target.value).getTime() / 1000)
                            })
                        }}
                    />

                    <div className='flex gap-2 items-end'>
                        <InputForm
                            id='period'
                            label='Period'
                            type='number'
                            className='w-40'
                            value={schedule.period.toString()}
                            min={0}
                            onChange={(event) => {
                                setSchedule({
                                    ...schedule,
                                    period: parseInt(event.target.value)
                                })
                            }}
                        />
                        <span className='inline-block text-gray-700 pb-2'>
                            Seconds
                        </span>
                    </div>

                    <NotImplemented>
                        Possibiliy to set an optional end date (until)
                    </NotImplemented>



                </div>
                <div className='py-4 flex flex-col gap-4'>
                    <h4>Message config</h4>
                    <InputForm
                        id='messageType'
                        label='Message Type'
                        className='w-full'
                        value={schedule.template.messageType}
                        onChange={(event) => {
                            setSchedule({
                                ...schedule,
                                template: {
                                    ...schedule.template,
                                    messageType: event.target.value
                                }
                            })
                        }}
                    />
                    <NotImplemented>
                        Set custom message overrides for this schedule
                    </NotImplemented>

                    <NotImplemented>
                        Manage different translations for this message
                    </NotImplemented>

                    <InputForm
                        id='messageSubject'
                        label='Message Subject'
                        className='w-full'
                        value={schedule.template.translations[0].subject}
                        onChange={(event) => {
                            setSchedule({
                                ...schedule,
                                template: {
                                    ...schedule.template,
                                    translations: [{
                                        ...schedule.template.translations[0],
                                        subject: event.target.value
                                    }]
                                }
                            })
                        }}
                    />

                    <Filepicker
                        // id='messageTemplate'
                        accept={{
                            'text/html': ['.html'],
                        }}
                        onChange={(files) => {
                            if (files.length > 0) {
                                // read file as a json
                                const reader = new FileReader();
                                reader.onload = (e) => {
                                    const text = e.target?.result;
                                    if (typeof text === 'string') {
                                        setSchedule({
                                            ...schedule,
                                            template: {
                                                ...schedule.template,
                                                translations: [{
                                                    ...schedule.template.translations[0],
                                                    templateDef: encodeTemplate(text) || ''
                                                }]
                                            }
                                        })

                                    } else {
                                        setSchedule({
                                            ...schedule,
                                            template: {
                                                ...schedule.template,
                                                translations: [{
                                                    ...schedule.template.translations[0],
                                                    templateDef: ''
                                                }]
                                            }
                                        })
                                        console.log('error');
                                    }
                                }
                                reader.readAsText(files[0]);
                            }
                            console.log(files);
                        }}
                    />
                </div>
                <div className='flex gap-2 pt-4'>
                    <PrimaryOutlinedButton
                        type='submit'
                        disabled={!schedule.label || !schedule.template.translations[0].templateDef || isPending}
                    >
                        Save
                    </PrimaryOutlinedButton>
                    <SecondaryOutlinedLink href="/tools/admin-v1/messaging/schedules">
                        Cancel
                    </SecondaryOutlinedLink>
                    {schedule.id && (
                        <DangerOutlinedButton
                            className='ml-auto'
                            type='button'
                            onClick={() => {
                                if (confirm('Are you sure you want to delete this schedule?')) {
                                    startTransition(async () => {
                                        try {
                                            await deleteMessageSchedule(schedule.id, session.data?.accessToken ?? '');
                                            router.refresh();
                                            router.push('/tools/admin-v1/messaging/schedules');
                                        } catch (error) {
                                            console.error(error);
                                            setShowSubmitError(true);
                                        }
                                    })
                                }

                            }}
                            disabled={isPending}
                        >
                            Delete
                        </DangerOutlinedButton>)}
                </div>
                {showSubmitError && (
                    <div className='mt-4 pt-4'>
                        <p className='text-red-500'>
                            Something went wrong. Please try again.
                        </p>
                    </div>
                )}
            </form>
        </div>
    );
};

export default MessageScheduleEditor;
