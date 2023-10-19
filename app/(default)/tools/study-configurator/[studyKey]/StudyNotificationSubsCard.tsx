import { Study } from '@/utils/server/types/studyInfos';
import React from 'react';
import NotImplemented from '@/components/NotImplemented';
import TwoColumnsWithCards from '@/components/TwoColumnsWithCards';

interface StudyNotificationSubsCardProps {
    study: Study;
}

const StudyNotificationSubsCard: React.FC<StudyNotificationSubsCardProps> = (props) => {
    return (
        <TwoColumnsWithCards
            label='Notifications'
            description='Which email will receive notifications for which study events?'
        >
            <NotImplemented>
                which email will receive notifications for which study events
            </NotImplemented>
        </TwoColumnsWithCards>
    );
};

export default StudyNotificationSubsCard;
