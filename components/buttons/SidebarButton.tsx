import React, { ButtonHTMLAttributes } from 'react';
import clsx from 'clsx';

interface SidebarButtonProps extends ButtonHTMLAttributes<HTMLElement> {
    className?: string;
    icon?: any;
    label: string;
}

const SidebarButton: React.FC<SidebarButtonProps> = ({ icon, label, ...props }) => {
    return (
        <button
            {...props}
            className={clsx(
                'px-2 py-2 flex',
                props.className,
            )}
        >
            {icon}
            {label}
        </button>
    );
};

export default SidebarButton;
