import clsx from 'clsx';
import React from 'react';
import { BsJournalMedical } from 'react-icons/bs';

interface ToolIconBaseProps {
    size: 'md' | 'lg';
    color?: string;
    icon: React.ReactNode;
}

const ToolIconBase: React.FC<ToolIconBaseProps> = (props) => {
    return (
        <div
            className={clsx(
                'shadow-sm rounded-small flex items-center justify-center text-center',
                props.color,
                {
                    'w-8 h-8 text-lg': props.size === 'md',
                    'w-14 h-14 text-3xl': props.size === 'lg'
                }
            )}        >
            {props.icon}
        </div>
    );
};

export default ToolIconBase;
