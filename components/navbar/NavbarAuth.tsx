import React, { Suspense } from 'react';
import { auth } from '@/auth';
import UserButton, { UserButtonSkeleton } from '../UserButton';
import { Button } from '../ui/button';
import Link from 'next/link';


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

const NavbarAuth: React.FC = () => {
    return (
        <Suspense fallback={<div>
            <UserButtonSkeleton />
        </div>}>
            <NavbarAuthContent />
        </Suspense>
    )
};

export default NavbarAuth;
