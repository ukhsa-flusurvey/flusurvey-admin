import React from 'react';

interface StudyCardProps {
    studyKey: string;
}

const StudyCard: React.FC<StudyCardProps> = async (props) => {
    // wait 2 seconds
    await new Promise(resolve => setTimeout(resolve, 2000));

    return (
        <p>StudyCard</p>
    );
};

export default StudyCard;

export const StudyCardSkeleton: React.FC = () => {
    return (
        <p>StudyCardSkeleton</p>
    );
}
