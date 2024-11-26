import AppbarBaseForTools from '@/components/navbar/AppbarBaseForTools';
import EditorsIcon from '@/components/tool-icons/EditorsIcons';
import React from 'react';


const EditorsAppbarBase: React.FC = () => {
    return (
        <AppbarBaseForTools
            toolName='Standalone Editors'
            toolIcon={<EditorsIcon size="md" />}
            isBordered
            ignoreAuth={true}
        >
        </AppbarBaseForTools>
    );
};

export default EditorsAppbarBase;
