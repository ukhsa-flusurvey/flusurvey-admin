import React from 'react';

interface SurveysPreviewProps {
}

const SurveysPreview: React.FC<SurveysPreviewProps> = (props) => {
    return (
        <p>SurveysPreview</p>
    );
};

export default SurveysPreview;

export const SurveysPreviewSkeleton: React.FC = () => {
    return (
        <p>SurveysPreviewSkeleton</p>
    );
}
