import NotImplemented from '@/components/NotImplemented';
import { ParticipantState } from '@/utils/server/types/participantState';
import React from 'react';
import StatusBadge from './StatusBadge';
import { UserIcon } from '@heroicons/react/24/solid';
import { format } from 'date-fns';
import clsx from 'clsx';

interface ParticipantDetailsProps {
    participant?: ParticipantState;
}

const ParticipantDetails: React.FC<ParticipantDetailsProps> = (props) => {
    if (!props.participant) return (
        <div className='p-4 bg-gray-50 sticky top-0 w-full rounded'>
            <h3 className='text-lg font-bold mb-2'>Participant Details</h3>
            <p>No participant selected</p>
        </div>
    )

    return (
        <div className='sticky top-0 w-full flex flex-col p-4 border rounded'>
            <h3 className='text-lg font-bold mb-2'>Participant Details</h3>
            <div className='flex py-2' >
                <StatusBadge status={props.participant.studyStatus} />
            </div>

            <div className='py-2'>
                <span className='font-bold text-sm text-gray-600'>Participant ID</span>
                <div className='flex items-center justify-start w-full overflow-hidden text-ellipsis'>
                    <UserIcon className="block shrink-0 w-4 h-4 mr-2 text-gray-400" />
                    <span className=' font-mono'>{props.participant.participantId}</span>
                </div>
            </div>

            <div className='mb-2'>
                <span className='block font-bold text-sm text-gray-600 mb-2'>Flags:</span>
                {(!props.participant.flags || Object.entries(props.participant.flags).length < 1) && <span className=' text-gray-400'>None</span>}
                {(props.participant.flags && Object.entries(props.participant.flags).length > 0) && <table className="table-auto rounded overflow-hidden border bg-gray-50">
                    <thead className='bg-gray-300'>
                        <tr>
                            <th className='px-4 py-2'>Key</th>
                            <th className='px-4 py-2'>Value</th>
                        </tr>
                    </thead>
                    <tbody className='divide-y'>
                        {Object.entries(props.participant.flags).map(([key, value], index) => {
                            return <tr key={key}
                                className={clsx({
                                    'bg-gray-100': index % 2 !== 0,
                                })}
                            >
                                <td className='py-2 px-4'>{key}</td>
                                <td className='py-2 px-4'>{value}</td>
                            </tr>
                        })}
                    </tbody>
                </table>}
            </div>

            <div className='py-4'>
                <hr />
            </div>

            <div className='mb-2'>
                <span className='block font-bold text-sm text-gray-600 mb-2'>Currently assigned surveys:</span>
                {!props.participant.assignedSurveys && <span className=' text-gray-400'>None</span>}
                {props.participant.assignedSurveys && <table className="table-auto rounded overflow-hidden bg-gray-50">
                    <thead className='bg-gray-300'>
                        <tr>
                            <th className='px-4 py-2'>Key</th>
                            <th className='px-4 py-2'>Category</th>
                            <th className='px-4 py-2'>From</th>
                            <th className='px-4 py-2'>Until</th>
                        </tr>
                    </thead>
                    <tbody className='divide-y'>
                        {props.participant.assignedSurveys.map((value, index) => {
                            return <tr key={index.toFixed()}
                                className={clsx({
                                    'bg-gray-100': index % 2 !== 0,
                                })}
                            >
                                <td className='py-2 px-4'>{value.surveyKey}</td>
                                <td className='py-2 px-4'>{value.category}</td>
                                <td className='py-2 px-4'>{value.validFrom && format(new Date(value.validFrom * 1000), 'dd-MMM-yyyy HH:mm')}</td>
                                <td className='py-2 px-4'>{value.validUntil && format(new Date(value.validUntil * 1000), 'dd-MMM-yyyy HH:mm')}</td>
                            </tr>
                        })}
                    </tbody>
                </table>}
            </div>


            <div className='py-4'>
                <hr />
            </div>

            <div className='mb-2'>
                <span className='block font-bold text-sm text-gray-600 mb-2'>Last submissions:</span>
                {!props.participant.lastSubmissions && <span className=' text-gray-400'>None</span>}
                {props.participant.lastSubmissions && <table className="table-auto rounded overflow-hidden bg-gray-50">
                    <thead className='bg-gray-300'>
                        <tr>
                            <th className='px-4 py-2'>Survey</th>
                            <th className='px-4 py-2'>Date</th>
                        </tr>
                    </thead>
                    <tbody className='divide-y'>
                        {Object.entries(props.participant.lastSubmissions).map(([key, value], index) => {
                            const date = new Date(value * 1000)
                            return <tr key={key}
                                className={clsx({
                                    'bg-gray-100': index % 2 !== 0,
                                })}
                            >
                                <td className='py-2 px-4'>{key}</td>
                                <td className='py-2 px-4'>{format(date, 'dd-MMM-yyyy')}</td>
                            </tr>
                        })}
                    </tbody>
                </table>}
            </div>




            <div className='flex flex-col gap-2 w-full mt-6'>
                <NotImplemented className='w-full'>
                    Update participant details or perform actions on participant
                </NotImplemented>
                <NotImplemented>
                    Download responses for the selected participant
                </NotImplemented>
            </div>
        </div>
    );
};

export default ParticipantDetails;
