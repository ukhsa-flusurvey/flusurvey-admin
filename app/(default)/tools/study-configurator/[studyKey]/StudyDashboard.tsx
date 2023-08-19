import React from 'react';
import SurveyOverview from './SurveyOverview';
import { Study } from '@/utils/server/types/studyInfos';
import StudyOverview from './StudyOverview';
import DangerZone from './DangerZone';


interface StudyDashboardProps {
    studyKey: string;
    study: Study;
}

const StudyDashboard: React.FC<StudyDashboardProps> = async (props) => {
    return (
        <>
            <div className='grid grid-cols-2 gap-unit-lg'>
                <StudyOverview
                    study={props.study}
                />
                <SurveyOverview
                    studyKey={props.studyKey}
                />
            </div>
            <div className='py-unit-lg'>
                <DangerZone
                    studyKey={props.studyKey}
                />
            </div>
        </>
    );
};

export default StudyDashboard;
