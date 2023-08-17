import AppbarBaseForTools from '@/components/navbar/AppbarBaseForTools';
import MessagingIcon from '@/components/tool-icons/MessagingIcon';
import React from 'react';

interface MessagingAppbarBaseProps {
}

const MessagingAppbarBase: React.FC<MessagingAppbarBaseProps> = (props) => {
    return (
        <AppbarBaseForTools
            toolName='Messaging'
            toolIcon={<MessagingIcon size="md" />}
            isBordered
        >
        </AppbarBaseForTools>
    );
};

export default MessagingAppbarBase;
