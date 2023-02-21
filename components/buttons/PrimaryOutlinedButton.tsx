import React, { ButtonHTMLAttributes, useState } from 'react';


interface PrimaryOutlinedButtonProps extends ButtonHTMLAttributes<HTMLElement> {
}

const PrimaryOutlinedButton: React.FC<PrimaryOutlinedButtonProps> = ({ children, ...props }) => {
    return (
        <button 
        {...props}
        className='mt-2 rounded text-blue-600 border border-blue-600 w-full px-6 py-2 flex justify-center items-center hover:text-blue-800 hover:border-blue-800 hover:bg-gray-200'>
            {children}
        </button>
    );
};

export default PrimaryOutlinedButton;
