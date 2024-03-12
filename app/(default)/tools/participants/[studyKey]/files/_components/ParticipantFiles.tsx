import React from 'react';
import ParticipantFilesClient from './ParticipantFilesClient';

interface ParticipantFilesProps {
}

const ParticipantFiles: React.FC<ParticipantFilesProps> = (props) => {
    // load initial list
    // error
    // empty

    return (
        <ParticipantFilesClient />
    );
};

export default ParticipantFiles;

export const ParticipantFilesSkeleton = () => {
    return (
        <p>ParticipantFilesSkeleton</p>
    );
}
