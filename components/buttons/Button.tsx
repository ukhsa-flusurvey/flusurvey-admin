import React, { ButtonHTMLAttributes } from 'react';
import clsx from 'clsx';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLElement> {
    className?: string;
    color?: 'blue';
}

const Button: React.FC<ButtonProps> = ({ children, color, ...props }) => {
    return (
        <button
            {...props}
            className={clsx(
                'rounded flex justify-center items-center',
                'px-6 py-2',
                'focus:outline-none focus:ring-4 focus:ring-offset-2',
                {
                    'text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 focus:ring-blue-600 focus:ring-opacity-30': color === 'blue' || !color,
                },
                props.className,
            )}
        >
            {children}
        </button>
    );
};

export default Button;

