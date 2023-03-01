import React, { ButtonHTMLAttributes } from 'react';
import clsx from 'clsx';

interface SidebarButtonProps extends ButtonHTMLAttributes<HTMLElement> {
    className?: string;
    Icon: React.ElementType;
    iconOnRightSide?: boolean;
    label: string;
}

const SidebarButton: React.FC<SidebarButtonProps> = ({ Icon, iconOnRightSide = false, label, ...props }) => {
    return (
        <a href={'./' + label}
            {...props}
            className={clsx(
                'px-2 py-2 flex',
                props.className,
            )}
        >
            {iconOnRightSide ? (
                <>
                    {label} &nbsp;  {Icon && <Icon className='h-6 w-6 mr-2 text-gray-400' />}
                </>
            ) : (
                <>
                    {Icon && <Icon className='h-6 w-6 mr-2 text-gray-400' />} {label}
                </>
            )}
        </a>
    );
};

export default SidebarButton;
