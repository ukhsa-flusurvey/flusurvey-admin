import CogLoader from '@/components/CogLoader';
import ErrorAlert from '@/components/ErrorAlert';
import { getParticipantById } from '@/lib/data/participants';
import { ArrowDownLeft } from 'lucide-react';
import React from 'react';

interface ParticipantDetailsProps {
    studyKey: string;
    participantID?: string;
}

const ParticipantDetails: React.FC<ParticipantDetailsProps> = async (props) => {
    if (!props.participantID) {
        return (
            <div className='flex gap-2 p-4'>
                <ArrowDownLeft className='size-6' />
                <p>Select a participant to view details</p>
            </div>
        );
    }

    const resp = await getParticipantById(props.studyKey, props.participantID);
    const participant = resp.participant;
    const error = resp.error;

    if (error) {
        return (
            <div className='p-4'>
                <ErrorAlert
                    title='Error loading participant details'
                    error={error}
                />
            </div>
        );
    }


    return (
        <p>ParticipantDetails</p>
    );
};

export default ParticipantDetails;

export const ParticipantDetailsSkeleton = () => {
    return (
        <div className='p-4 h-full'>
            <CogLoader
                label='Loading participant details...'
                className='h-full flex flex-col justify-center items-center'
            />
        </div>
    );
}
