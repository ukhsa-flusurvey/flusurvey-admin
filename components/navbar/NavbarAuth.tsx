import React, { Suspense } from 'react';
import {
    Link as NextUILink,
    Button, NavbarItem, Spinner
} from '@nextui-org/react';
import { auth } from '@/auth';
import UserButton from '../UserButton';


interface NavbarAuthProps {
}

const NavbarAuthContent = async () => {
    const session = await auth()

    if (!session) {
        return (
            <NavbarItem
            >
                <Button
                    variant="flat"
                    radius="sm"
                    as={NextUILink}
                    href='/auth/login'
                >
                    Login
                </Button>
            </NavbarItem>
        )
    }

    return (
        <UserButton
            user={session.user}
        />
    )
}

const NavbarAuth: React.FC<NavbarAuthProps> = (props) => {
    return (
        <Suspense fallback={<div><Spinner color='secondary' size='md' /></div>}>
            <NavbarAuthContent />
        </Suspense>
    )
};

export default NavbarAuth;
