import React, { Suspense } from 'react';
import { auth } from '@/auth';
import UserButton from '../UserButton';
import { Button } from '../ui/button';
import Link from 'next/link';
import { BeatLoader } from 'react-spinners';


interface NavbarAuthProps {
}

const NavbarAuthContent = async () => {
    const session = await auth()

    if (!session) {
        return (

            <Button
                variant="secondary"
                asChild
            >
                <Link
                    href='/auth/login'
                >
                    Login
                </Link>
            </Button>
        )
    }

    return (
        <UserButton
            user={session.user}
            expires={session.tokenExpiresAt}
        />
    )
}

const NavbarAuth: React.FC<NavbarAuthProps> = (props) => {
    return (
        <Suspense fallback={<div><BeatLoader /></div>}>
            <NavbarAuthContent />
        </Suspense>
    )
};

export default NavbarAuth;
