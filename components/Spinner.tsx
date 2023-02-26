import clsx from 'clsx';
import React from 'react';

interface SpinnerProps {
    color?: 'blue';
    size?: 'sm' | 'md' | 'lg' | 'xl';
    invisibleLabel?: string;
}

const Spinner: React.FC<SpinnerProps> = (props) => {
    return (
        <div
            className={clsx(
                "inline-block animate-spin rounded-full  netalign-[-0.125em]  motion-reduce:animate-[spin-2.0s_linear_infinite]",
                'border-solid border-current border-r-gray-100',
                {
                    'border-gray-300': props.color === undefined,
                    'border-blue-500': props.color === 'blue',
                    'h-6 w-6 border-[3px]': props.size === 'sm',
                    'h-8 w-8 border-4': props.size === 'md' || props.size === undefined,
                    'h-12 w-12 border-[5px]': props.size === 'lg',
                    'h-16 w-16 border-[6px]': props.size === 'xl',
                }
            )}

            role="status">
            <span
                className="sr-only"
            >
                {props.invisibleLabel ? props.invisibleLabel : 'Loading...'}
            </span>
        </div>

    );
};

export default Spinner;
