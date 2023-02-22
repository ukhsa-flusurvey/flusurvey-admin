import React, { ButtonHTMLAttributes } from 'react';
import clsx from 'clsx';

interface PrimaryButtonProps extends ButtonHTMLAttributes<HTMLElement> {
    className?: string;
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({ children, ...props }) => {
    return (
        <button
            {...props}
            className={clsx(
                'mt-4 rounded flex justify-center items-center',
                'px-6 py-2',
                'bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400',
                'text-white',
                'focus:outline-none focus:ring-4 focus:ring-blue-600 focus:ring-offset-2 focus:ring-opacity-30',
                props.className,
            )}
        >
            {children}
        </button>
    );
};

export default PrimaryButton;
