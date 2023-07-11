'use client';

import React from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { useState } from "react";
import { ChevronUpDownIcon } from '@heroicons/react/24/solid';
import Filepicker from '../inputs/Filepicker';
import InputForm from '../inputs/Input';
import NotImplemented from '../NotImplemented';
import LoadingButton from '../buttons/LoadingButton';
import { encodeTemplate } from './utils';

const topics = [
    {
        id: 'registration',
        title: 'Registration',
        description: 'Email sent to user after registration',

    },
    {
        id: 'verify-email',
        title: 'Verify Email',
        description: 'Email sent when user aks to re-send infos to be able to verify the email, also used when email address has changed.'
    },
    {
        id: 'verification-code',
        title: 'Verification Code',
        description: 'Email with the 6 digit code (2FA)'
    },
    {
        id: 'password-reset',
        title: 'Password Reset',
        description: 'Email sent when user asks to reset password'
    },
    {
        id: 'password-changed',
        title: 'Password Changed',
        description: 'Email sent when user changes his password'
    },
    {
        id: 'account-deleted',
        title: 'Account Deleted',
        description: 'Email sent when user deletes his account'
    },
    {
        id: 'account-id-changed',
        title: 'Account ID Changed',
        description: 'Email sent when user changes his account ID (email address)'
    },

    {
        id: 'invitation',
        title: 'Invitation',
        description: 'Email sent when user is invited to join a system, after user migration '
    }

]




interface SystemMessageTemplateUploaderProps {

}

const SystemMessageTemplateUploader: React.FC<SystemMessageTemplateUploaderProps> = (props) => {
    const [selectedTopic, setSelectedTopic] = useState(topics[0]);
    const [newTemplate, setNewTemplate] = useState<string | undefined>(undefined);
    const [error, setError] = useState<string | undefined>(undefined);
    const [success, setSuccess] = useState<string | undefined>(undefined);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [subject, setSubject] = useState<string>('');
    const [headerOverrides, setHeaderOverrides] = useState<{ from: string, sender: string, replyTo: string[] }>({ from: '', sender: '', replyTo: [] });


    const uploadTemplate = async () => {
        const defaultLanguage = process.env.NEXT_PUBLIC_DEFAULT_LANGUAGE;
        const payload = {
            messageType: selectedTopic.id,
            defaultLanguage: defaultLanguage,
            headerOverrides: headerOverrides,
            translations: [
                {
                    lang: defaultLanguage,
                    subject: subject,
                    templateDef: encodeTemplate(newTemplate)
                }
            ]
        }

        setError(undefined);
        setSuccess(undefined)
        setIsLoading(true);

        try {
            const url = new URL(`/api/case-management-api/v1/messaging/email-templates`, process.env.NEXT_PUBLIC_API_URL)
            const response = await fetch(url.toString(), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ "template": payload }),
            });
            const data = await response.json();
            setSuccess('Template uploaded successfully');
            console.log(data);

        }
        catch (e: any) {
            setError(e.message);
            console.log(e);
        }

        setIsLoading(false);
    }

    return (
        <>
            <h3 className="text-xl font-bold mb-3">Upload new template</h3>
            <div className='grid grid-cols-2 gap-4'>
                <div>
                    <h4 className='text-lg font-bold'>Message type</h4>
                    <p className='text-sm text-gray-600'>Select for which message type the new templates should be uploaded for.</p>
                </div>
                <div className='relative'>
                    <Listbox
                        value={selectedTopic} onChange={setSelectedTopic}>
                        <Listbox.Button className='flex w-full text-start items-center ps-4 py-3 border border-gray-500 rounded'>
                            <span className='grow'>{selectedTopic.title}</span>
                            <ChevronUpDownIcon className='w-6 h-6 me-3 ms-3 text-gray-400' />
                        </Listbox.Button>
                        <Transition
                            enter="transition duration-100 ease-out"
                            enterFrom="transform scale-95 opacity-0"
                            enterTo="transform scale-100 opacity-100"
                            leave="transition duration-75 ease-out"
                            leaveFrom="transform scale-100 opacity-100"
                            leaveTo="transform scale-95 opacity-0"
                        >
                            <Listbox.Options className='mt-2 absolute divide-y border border-gray-500 rounded bg-slate-50'>
                                {topics.map((topic) => (
                                    <Listbox.Option key={topic.id} value={topic}>
                                        <div className='flex flex-col ui-active:bg-slate-200 px-4 py-2 font-bold cursor-pointer'>
                                            {topic.title}
                                            <span className='text-sm font-normal text-gray-600'>{topic.description}</span>
                                        </div>
                                    </Listbox.Option>
                                ))}
                            </Listbox.Options>
                        </ Transition>
                    </Listbox>
                </div>
            </div>

            <div className='my-8 py-3 border-t border-gray-400 flex flex-col gap-4'>
                <h4 className='text-lg font-bold'>Header Overrides</h4>
                <div className='grid grid-cols-2 gap-4'>

                    <div>
                        <h5 className='font-bold'>From</h5>
                        <p className='text-sm text-gray-600'>With this, you can override the system default email configuration. You can use a simple email address like
                            <span className='font-semibold tracking-wider mx-1'>email@team.tld</span>
                            or
                            <span className='font-semibold tracking-wider mx-1'>CustomName {'<email@team.tld>'}</span>  </p>
                    </div>
                    <div>
                        <InputForm
                            label='From'
                            value={headerOverrides.from}
                            onChange={(e) => setHeaderOverrides({ ...headerOverrides, from: e.target.value })}
                        />

                    </div>
                </div>

                <div className='grid grid-cols-2 gap-4'>

                    <div>
                        <h5 className='font-bold'>Sender</h5>
                        <p className='text-sm text-gray-600'>Set the sender address for this email template.</p>
                    </div>
                    <div>
                        <InputForm
                            label='Sender'
                            value={headerOverrides.sender}
                            onChange={(e) => setHeaderOverrides({ ...headerOverrides, sender: e.target.value })}
                        />

                    </div>
                </div>

                <div className='grid grid-cols-2 gap-4'>

                    <div>
                        <h5 className='font-bold'>Reply To</h5>
                        <p className='text-sm text-gray-600'>Define the reply to addresses in a format like
                            <span className='font-semibold tracking-wider mx-1'>email@team.tld</span>
                            or
                            <span className='font-semibold tracking-wider mx-1'>CustomName {'<email@team.tld>'}</span>.
                            You can also use multiple addresses, separated by comma.

                        </p>
                    </div>
                    <div>
                        <InputForm
                            label='Reply To'
                            value={headerOverrides.replyTo.join(',')}
                            onChange={(e) => setHeaderOverrides({ ...headerOverrides, replyTo: e.target.value.split(',') })}
                        />

                    </div>
                </div>
            </div>

            <div className='my-8 py-3 border-t border-gray-400 flex flex-col gap-4'>
                <h4 className='text-lg font-bold'>Translations</h4>
                <NotImplemented>
                    Manage list of translations for the template | currently default language will be used
                </NotImplemented>
                <div className='grid grid-cols-2 gap-4'>

                    <div>
                        <h5 className='font-bold'>Email Subject</h5>
                        <p className='text-sm text-gray-600'>Set the subject for this email template.</p>
                    </div>
                    <div>
                        <InputForm
                            label='Subject'
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                        />

                    </div>
                </div>
                <div className='grid grid-cols-2 gap-4'>

                    <div>
                        <h5 className='font-bold'>HTML Template</h5>
                        <p className='text-sm text-gray-600'>Select the template file that should be used for this message</p>
                    </div>
                    <div>
                        <Filepicker
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
                                            setNewTemplate(text);

                                        } else {
                                            setNewTemplate(undefined);
                                            console.log('error');
                                        }
                                    }
                                    reader.readAsText(files[0]);
                                }
                                console.log(files);
                            }}
                        />

                    </div>
                </div>
            </div>
            <div className='flex justify-end'>
                <LoadingButton
                    type='button'
                    onClick={uploadTemplate}
                    isLoading={isLoading}
                    disabled={!newTemplate || !selectedTopic || !subject}
                >
                    Upload Template
                </LoadingButton>
            </div>
            <div>
                {error && <p className='text-red-500'>{error}</p>}
                {success && <p className='text-green-500'>{success}</p>}
            </div>
            <div>
                <h4 className='text-lg font-bold'>Template Preview</h4>
                <div className='h-96 border border-dashed mt-6 rounded overflow-scroll'>
                    {newTemplate &&
                        <div dangerouslySetInnerHTML={{ __html: newTemplate }} />
                    }
                </div>
            </div>
        </>
    );
};

export default SystemMessageTemplateUploader;
