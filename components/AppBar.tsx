import React from 'react';
import Container from './Container';
import Link from 'next/link';

interface AppBarProps {
}

const AppBar: React.FC<AppBarProps> = (props) => {
    return (
        <>
            <header className='bg-cyan-800'>
                <Container>
                    <nav className='py-4 flex align-center text-white'>
                        <h1 className='text-xl'>
                            <Link href={'/'}>
                                CASE Admin
                            </Link>
                        </h1>
                    </nav>
                </Container>
            </header>
        </>
    );
};

export default AppBar;
