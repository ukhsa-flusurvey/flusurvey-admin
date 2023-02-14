import React, { ButtonHTMLAttributes } from 'react';

interface PrimaryButtonProps extends ButtonHTMLAttributes<HTMLElement> {

}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({ children, ...props }) => {
    return (
        <button
            {...props}
            className='mt-4 rounded bg-blue-600 hover:bg-blue-700 px-6 disabled:bg-blue-400 py-2 text-white'
        >
            {children}
        </button>
    );
};

export default PrimaryButton;
