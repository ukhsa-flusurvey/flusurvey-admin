import React from 'react';
import SurveyOverview from '../SurveyOverview';
import { Study } from '@/utils/server/types/studyInfos';
import StudyOverview from '../StudyOverview';
import DangerZone from './DangerZone';
import StudyRuleOverview from '../StudyRuleOverview';
import StudyMembersCard from '../StudyMembersCard';
import StudyNotificationSubsCard from '../StudyNotificationSubsCard';
import { Divider } from '@nextui-org/divider';


interface StudyDashboardProps {
    studyKey: string;
}

const StudyDashboard: React.FC<StudyDashboardProps> = async (props) => {
    return (
        <>
            <div className=''>
                {/*<StudyOverview
                    study={props.study}
    />
                <Divider />
                <SurveyOverview
                    studyKey={props.studyKey}
                />
                <Divider />
                <StudyRuleOverview
                    studyKey={props.studyKey}
                />
                <Divider />
                <StudyNotificationSubsCard
                    studyKey={props.studyKey}
                />
                <Divider />
    */}

                <DangerZone
                    studyKey={props.studyKey}
                />
            </div>
        </>
    );
};

export default StudyDashboard;
