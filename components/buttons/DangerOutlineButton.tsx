import React, { ButtonHTMLAttributes, useState } from 'react';
import clsx from 'clsx';


interface DangerOutlinedButtonProps extends ButtonHTMLAttributes<HTMLElement> {
    className?: string;
}

const DangerOutlinedButton: React.FC<DangerOutlinedButtonProps> = ({ children, ...props }) => {
    return (
        <button
            {...props}
            className={clsx(
                'rounded flex justify-center items-center',
                'px-6 py-2',
                'border-2 border-red-600 hover:border-transparent',
                'hover:bg-red-600',
                'text-red-600 hover:text-white',
                'disabled:border-gray-400 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed',
                'focus:outline-none focus:ring-4 focus:ring-red-600 focus:ring-offset-2 focus:ring-opacity-30',
                props.className,
            )}
        >

            {children}
        </button >
    );
};

export default DangerOutlinedButton;
