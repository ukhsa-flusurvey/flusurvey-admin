import React, { ButtonHTMLAttributes, useState } from 'react';
import clsx from 'clsx';


interface PrimaryOutlinedButtonProps extends ButtonHTMLAttributes<HTMLElement> {
    className?: string;
}

const PrimaryOutlinedButton: React.FC<PrimaryOutlinedButtonProps> = ({ children, ...props }) => {
    return (
        <button
            {...props}
            className={clsx(
                'rounded flex justify-center items-center',
                'px-6 py-2',
                'border-2 border-blue-600 hover:border-transparent',
                'hover:bg-blue-600',
                'text-blue-600 hover:text-white',
                'disabled:border-gray-400 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed',
                'focus:outline-none focus:ring-4 focus:ring-blue-600 focus:ring-offset-2 focus:ring-opacity-30',
                props.className,
            )}
        >

            {children}
        </button >
    );
};

export default PrimaryOutlinedButton;
