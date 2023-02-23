import React, { useState } from 'react';
import clsx from 'clsx';

interface NavItemProps {
    children?: string
}

const NavItem: React.FC<NavItemProps> = ({ children, ...props }) => {
    const [active, setActive] = useState(false);
    function handleClick() {
        setActive(!active);
    }

    return (
        <div
            {...props}
            onClick={handleClick}
            className={clsx(
                'rounded cursor-pointer',
                'px-2 py-2',
                { 'bg-slate-600': !active }, { 'bg-slate-700': active }, 'hover:bg-slate-700',
                { 'text-gray-300': !active }, { 'text-white': active }, 'hover:underline',
                { 'shadow-inner': active }
            )}
        >
            {children}
        </div>
    );
};

export default NavItem;