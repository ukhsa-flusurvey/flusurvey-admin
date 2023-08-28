import AppbarBaseForTools from '@/components/navbar/AppbarBaseForTools';
import StudyConfigIcon from '@/components/tool-icons/StudyConfigIcon';
import React from 'react';

interface StudyConfigAppbarBaseProps {
}

const StudyConfigAppbarBase: React.FC<StudyConfigAppbarBaseProps> = (props) => {
    return (
        <AppbarBaseForTools
            toolName='Study Configurator'
            toolIcon={<StudyConfigIcon size="md" />}
            isBordered
        >
        </AppbarBaseForTools>
    );
};

export default StudyConfigAppbarBase;
