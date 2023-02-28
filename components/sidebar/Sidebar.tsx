import React, { useState } from 'react';
import NavItem from './NavItem';
import QuestionMarkCircleIcon from '@heroicons/react/24/outline/QuestionMarkCircleIcon';
import UserCircleIcon from '@heroicons/react/24/outline/UserCircleIcon';

interface SidebarProps {
    children?: React.ReactNode
}

const Sidebar: React.FC<SidebarProps> = ({ children, ...props }) => {
    const [activeIndex, setActiveIndex] = useState(0);

    return (
        <div
            {...props}
            className='bg-slate-600 h-screen w-[300px] flex flex-col'>
            <div className='px-4 py-4 bg-slate-600'>
                <div className='text-white text-xl border-l-[4px] border-l-blue-500 pl-3'>
                    <span className='text-base text-blue-200'>CASE-ADMIN</span> <br />
                    <span className='font-semibold tracking-wider'>Infectieradar</span>
                </div>
            </div>
            <div className='grow px-2 py-4'>
                {children}
                <NavItem
                    isActive={activeIndex === 0}
                    onSelect={() => setActiveIndex(0)}
                >
                    Dashboard
                </NavItem>
                <NavItem
                    isActive={activeIndex === 1}
                    onSelect={() => setActiveIndex(1)}
                > Study Management </NavItem>
                <NavItem
                    isActive={activeIndex === 2}
                    onSelect={() => setActiveIndex(2)}
                > Messaging</NavItem>
                <NavItem
                    isActive={activeIndex === 3}
                    onSelect={() => setActiveIndex(3)}
                > Participants </NavItem>
            </div>
            <div className='bg-slate-700 py-4 px-4 text-gray-300 shadow-inner'>
                <div className='px-2 py-2 flex '><UserCircleIcon className='h-6 w-6 mr-2 text-gray-400' /> Profile</div>
                <div className='px-2 py-2 flex'><QuestionMarkCircleIcon className='h-6 w-6 mr-2 text-gray-400' /> Help</div>
                <div className='px-2 py-2 '>Logout</div>
            </div>
        </div>
    );
};

export default Sidebar;