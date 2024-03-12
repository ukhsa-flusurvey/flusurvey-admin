import React from 'react';
import ReportViewerClient from './ReportViewerClient';

interface ReportViewerProps {
    studyKey: string;
}

const ReportViewer: React.FC<ReportViewerProps> = async (props) => {
    // wait 3 seconds
    await new Promise(resolve => setTimeout(resolve, 3000));

    return (
        <ReportViewerClient
            studyKey={props.studyKey}
        />

    );
};

export default ReportViewer;

export const ReportViewerSkeleton = () => {
    return (
        <p>ReportViewerSkeleton</p>
    );
}
