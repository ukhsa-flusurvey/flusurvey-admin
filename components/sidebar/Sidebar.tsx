import React, { useState } from 'react';
import NavItem from './NavItem';
import SidebarButton from './SidebarButton';
import QuestionMarkCircleIcon from '@heroicons/react/24/outline/QuestionMarkCircleIcon';
import UserCircleIcon from '@heroicons/react/24/outline/UserCircleIcon';
import ArrowRightOnRectangleIcon from '@heroicons/react/24/outline/ArrowRightOnRectangleIcon';

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
                <SidebarButton
                    label='Profile' Icon={UserCircleIcon}
                ></SidebarButton>
                <SidebarButton
                    label='Help' Icon={QuestionMarkCircleIcon}
                > </SidebarButton>
                <div className='flex row items-center my-2'>
                    <div className='border-t-2 border-t-gray-500 grow h-[1px] rounded-md'></div>
                </div>
                <SidebarButton
                    label='Logout' Icon={ArrowRightOnRectangleIcon} iconOnRightSide={true}
                > </SidebarButton>
            </div>
        </div>
    );
};

export default Sidebar;