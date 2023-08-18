'use client';

import Filepicker from '@/components/inputs/Filepicker';
import React from 'react';
import SurveyOverview from './SurveyOverview';


interface StudyDashboardProps {
    studyKey: string;
}

const StudyDashboard: React.FC<StudyDashboardProps> = (props) => {
    return (
        <div className='flex flex-col gap-unit-lg'>
            <Filepicker
                id='test'
                label='Upload a file'
                onChange={(files) => {
                    console.log(files);

                }}
            />
            <SurveyOverview
                studyKey={props.studyKey}
            />
        </div>
    );
};

export default StudyDashboard;
