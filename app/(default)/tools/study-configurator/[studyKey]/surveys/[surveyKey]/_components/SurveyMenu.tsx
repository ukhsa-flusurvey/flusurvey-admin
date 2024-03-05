'use client'

import { MoreVertical } from 'lucide-react';
import React from 'react';

interface SurveyMenuProps {
    studyKey: string;
    surveyKey: string;
}

const SurveyMenu: React.FC<SurveyMenuProps> = (props) => {
    return (
        <>
            <MoreVertical className='size-5' />
            unpublish
        </>
    );
};

export default SurveyMenu;
