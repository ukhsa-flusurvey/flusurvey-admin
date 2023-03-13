import React, { useEffect, useState } from 'react';
import clsx from 'clsx';

interface NavItemProps {
    children: string;
    isActive: boolean;
    onSelect: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ children, isActive, onSelect, ...props }) => {

    return (
        <div
            {...props}
            onClick={onSelect}
            className={clsx(
                'rounded cursor-pointer',
                'px-2 py-2',
                {
                    'bg-slate-600': !isActive,
                    'bg-slate-700': isActive
                },
                'hover:bg-slate-700',
                {
                    'text-gray-300': !isActive,
                    'text-white': isActive
                },
                'hover:underline',
                {
                    'shadow-inner': isActive
                }
            )}
        >

            {children}
        </div>
    );
};

export default NavItem;
