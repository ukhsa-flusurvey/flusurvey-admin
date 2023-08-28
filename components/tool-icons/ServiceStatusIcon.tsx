import React from 'react';
import { BsCloudCheck } from 'react-icons/bs';
import ToolIconBase from './ToolIconBase';

interface ServiceStatusIconProps {
    size: 'md' | 'lg';
}

const ServiceStatusIcon: React.FC<ServiceStatusIconProps> = (props) => {
    return (
        <ToolIconBase
            size={props.size}
            icon={<BsCloudCheck />}
            color='bg-gradient-to-b from-neutral-400 to-neutral-600 text-white'
        />
    );
};

export default ServiceStatusIcon;
