import AppbarBaseForTools from '@/components/navbar/AppbarBaseForTools';
import ParticipantsIcon from '@/components/tool-icons/ParticipantsIcon';
import React from 'react';

interface ParticipantsAppbarBaseProps {
}

const ParticipantsAppbarBase: React.FC<ParticipantsAppbarBaseProps> = (props) => {
    return (
        <AppbarBaseForTools
            toolName='Participants'
            toolIcon={<ParticipantsIcon size="md" />}
            isBordered
        >
        </AppbarBaseForTools>
    );
};

export default ParticipantsAppbarBase;
