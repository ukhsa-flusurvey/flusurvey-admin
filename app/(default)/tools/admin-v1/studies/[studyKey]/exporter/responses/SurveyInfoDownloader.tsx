'use client';

import { SurveyInfos } from '@/utils/server/types/studyInfos';
import React from 'react';

interface SurveyInfoDownloaderProps {
    studyKey: string;
    surveyInfos?: SurveyInfos;
}

const SurveyInfoDownloader: React.FC<SurveyInfoDownloaderProps> = (props) => {
    return (
        <div>
            <p>
                TODO:
                - download survey infos for surveyKey
                - survey info lang
                - survey info format (CSV or JSON)
                - use short keys?
            </p>
        </div>
    );
};

export default SurveyInfoDownloader;
