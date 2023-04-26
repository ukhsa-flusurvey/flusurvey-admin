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
            <header className='bg-cyan-800'>
                <Container>
                    <nav className='py-4 flex items-center text-white'>
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
                </Container>
            </header>
        </>
    );
};
