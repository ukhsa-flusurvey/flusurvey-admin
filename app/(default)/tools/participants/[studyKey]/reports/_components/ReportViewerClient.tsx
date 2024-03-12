'use client'

import React from 'react';

interface ReportViewerClientProps {
    studyKey: string;
}

const ReportViewerClient: React.FC<ReportViewerClientProps> = (props) => {
    return (
        <p>ReportViewerClient with load more, and download to disk</p>
    );
};

export default ReportViewerClient;
