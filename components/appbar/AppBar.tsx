import React from 'react';
import Container from '../Container';
import Link from 'next/link';
import Profile from './Profile';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

interface AppBarProps {
}

export default async function AppBar(props: AppBarProps) {
    const session = await getServerSession(authOptions);


    return (
        <>
            <header className='bg-cyan-800 px-4 fixed w-full z-50'>
                <nav className='flex items-center text-white  h-16'>
                    <h1 className='text-xl grow'>
                        <Link href={'/'}>
                            CASE Admin
                        </Link>
                    </h1>
                    {session && session.user && session.user.email &&
                        <Profile email={
                            session.user.email
                        } />}
                </nav>
            </header>
        </>
    );
};
