'use client';

import { ArrowRightOnRectangleIcon } from '@heroicons/react/24/solid';
import { signOut } from 'next-auth/react';
import React from 'react';

interface ProfileProps {
    email: string;
}

const Profile: React.FC<ProfileProps> = (props) => {
    return (
        <div className='flex items-center'>
            <span className='bg-gray-500 rounded-full w-8 h-8  flex items-center justify-center me-2'>{props.email[0]}</span>
            {props.email}
            <button
                onClick={() => {
                    signOut({ callbackUrl: '/' })
                }}
                className='ms-2 w-8 h-8 rounded-full hover:bg-white hover:text-black text-center flex justify-center items-center'>
                <ArrowRightOnRectangleIcon className='w-6' />
            </button>
        </div>
    );
};

export default Profile;
