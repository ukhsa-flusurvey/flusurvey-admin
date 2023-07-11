import React, { ButtonHTMLAttributes, useState } from 'react';
import clsx from 'clsx';
import Link, { LinkProps } from 'next/link';



interface PrimaryOutlinedLinkProps extends LinkProps {
    className?: string;
    children: React.ReactNode;
}

const PrimaryOutlinedLink: React.FC<PrimaryOutlinedLinkProps> = ({ children, ...props }) => {
    return (
        <Link
            {...props}
            className={clsx(
                'rounded inline-flex justify-center items-center',
                'px-6 py-2',
                'border-2 border-blue-600 hover:border-transparent',
                'hover:bg-blue-600',
                'text-blue-600  hover:text-white',
                'focus:outline-none focus:ring-4 focus:ring-blue-600 focus:ring-offset-2 focus:ring-opacity-30',
                props.className,
            )}
        >

            {children}
        </Link >
    );
};

export default PrimaryOutlinedLink;
