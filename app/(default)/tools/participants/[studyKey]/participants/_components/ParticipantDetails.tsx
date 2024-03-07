import { ArrowDownLeft } from 'lucide-react';
import React from 'react';

interface ParticipantDetailsProps {
    studyKey: string;
    participantKey?: string;
}

const ParticipantDetails: React.FC<ParticipantDetailsProps> = (props) => {
    if (!props.participantKey) {
        return (
            <div className='flex gap-2 p-4'>
                <ArrowDownLeft className='size-6' />
                <p>Select a participant to view details</p>
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
        <p>ParticipantDetailsSkeleton</p>
    );
}
