'use client';


import { Switch } from '@headlessui/react';
import { Button } from '@nextui-org/button';
import React from 'react';
import { ResponseItem, SurveySingleItemResponse } from 'survey-engine/data_types';

interface ConfidentialResponseDownloaderProps {
    studyKey: string;
}

const conditionForActiveParticipants = {
    "name": "hasStudyStatus",
    "data": [
        {
            "dtype": "str",
            "str": "active"
        }
    ]
}

const dummyCondition = {
    "name": "gt",
    "data": [
        {
            "dtype": "num",
            "num": 1
        },
        {
            "dtype": "num",
            "num": 0
        }
    ]
}

const parseSlot = (responseItem: ResponseItem, parentKey: string, hasSiblings?: boolean) => {
    let slotResponses: {
        [key: string]: string;
    } = {};

    const currentKey = `${parentKey}${responseItem.key}`;
    if (!responseItem.items) {
        if (responseItem.value) {
            slotResponses[currentKey] = responseItem.value;
        } else {
            if (hasSiblings) {
                slotResponses[currentKey] = 'TRUE';
            } else {
                slotResponses[parentKey.substring(0, parentKey.length - 1)] = responseItem.key;
            }
        }
        return slotResponses;
    }
    const hasMoreChildren = responseItem.items?.length > 1;
    responseItem.items.forEach((item) => {

        const newSlotes = parseSlot(item, `${currentKey}.`, hasMoreChildren);
        slotResponses = {
            ...slotResponses,
            ...newSlotes,
        }
    })
    return slotResponses;
}



const parseSingleConfidentialResponse = (response: SurveySingleItemResponse) => {
    const itemKey = response.key;
    let slotResponses = {};
    if (!response.response) {
        return slotResponses;
    }
    const slotKey = `${itemKey}-`;
    const newSlots = parseSlot(response.response, slotKey);
    slotResponses = {
        ...slotResponses,
        ...newSlots,
    }
    return slotResponses;
}


const parseConfidentialResponses = (responses: Array<{
    key: string;
    participantId: string;
    responses: SurveySingleItemResponse[];
}>) => {
    return responses.map((response) => {
        let obj = {
            participantId: response.participantId,
        }
        response.responses.forEach((r) => {
            const parsed = parseSingleConfidentialResponse(r);
            obj = {
                ...obj,
                ...parsed,
            }
        })
        return obj;
    })
}


const ConfidentialResponseDownloader: React.FC<ConfidentialResponseDownloaderProps> = (props) => {
    const [participantIds, setParticipantIds] = React.useState<string[]>([]);
    const [onlyForActiveParticipants, setOnlyForActiveParticipants] = React.useState(true);
    const [isPending, startTransition] = React.useTransition();
    const [errorMsg, setErrorMsg] = React.useState<string | undefined>(undefined);

    return (
        <div className='flex flex-col gap-3'>
            <div>
                <label
                    htmlFor='participant-ids'
                    className='text-sm font-medium text-gray-700 mb-1 block'
                >Participant ids</label>
                <textarea
                    id='participant-ids'
                    placeholder='Enter participant ids here, one per line.'
                    className='w-full h-32 resize-none border border-gray-300 rounded-md shadow-sm focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm'
                    onChange={(e) => {
                        setParticipantIds(e.target.value.split('\n').map((s) => s.trim()).filter((s) => s.length > 0));
                    }}
                >

                </textarea>
            </div>

            <div>
                <p
                    className='text-sm font-medium text-gray-700 mb-1 block'
                >With this switch you can limit download to only active participants (default: true)</p>
                <div className='flex gap-2 items-center'>
                    <Switch
                        id='only-for-active-participants'
                        checked={onlyForActiveParticipants}
                        onChange={setOnlyForActiveParticipants}
                        className={`bg-gray-300 ui-checked:bg-cyan-700  relative inline-flex h-[28px] w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
                    >
                        <span
                            className={`${onlyForActiveParticipants ? 'translate-x-5' : 'translate-x-0'
                                } pointer-events-none inline-block h-[24px] w-[24px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
                        />

                    </Switch>
                    <label
                        htmlFor='only-for-active-participants'
                        className='cursor-pointer select-none'
                    >
                        {onlyForActiveParticipants ? 'Only for active participants' : 'Ignore participant status'}
                    </label>
                </div>
            </div>
            {errorMsg && (
                <p className='text-red-600'>
                    {errorMsg}
                </p>
            )}

            <Button
                isLoading={isPending}
                disabled={participantIds.length < 1}
                onClick={async () => {
                    setErrorMsg(undefined);
                    if (participantIds.length < 1) {
                        setErrorMsg('Please enter at least one participant id.');
                        return;
                    }
                    startTransition(async () => {
                        try {
                            const resp = await fetch(`/api/case-management-api/v1/data/${props.studyKey}/fetch-confidential-responses`,
                                {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify({
                                        participantIds: participantIds,
                                        keyFilter: '',
                                        condition: onlyForActiveParticipants ? conditionForActiveParticipants : dummyCondition
                                    }),
                                    next: {
                                        revalidate: 10
                                    }
                                }
                            )


                            if (resp.status !== 200) {
                                const err = await resp.json();
                                setErrorMsg(err.error);
                                //setErrorMsg(await resp.text());
                                return;
                            }
                            const data = await resp.json();
                            if (!data.responses) {
                                setErrorMsg('No responses found.');
                                return;
                            }
                            const result = parseConfidentialResponses(data.responses);

                            const blob = new Blob([JSON.stringify(result)], { type: 'application/json' });
                            const fileName = `${props.studyKey}_confidential_responses.json`
                            const link = document.createElement('a');
                            link.href = window.URL.createObjectURL(blob);
                            link.download = (fileName).replaceAll('"', '');
                            link.click();
                        } catch (err: any) {
                            setErrorMsg(err.message);
                        }
                    });
                }}
            >
                Download confidential responses
            </Button>
        </div>
    );
};

export default ConfidentialResponseDownloader;
