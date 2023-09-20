'use client'

import React from 'react';
import {
    Link as NextUILink,
    Avatar, Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, NavbarItem, Spinner, Divider, DropdownSection
} from '@nextui-org/react';
import { signOut, useSession } from 'next-auth/react';

interface NavbarAuthProps {
}

const NavbarAuth: React.FC<NavbarAuthProps> = (props) => {
    const { data: sessionInfos, status } = useSession();

    if (status === 'loading') {
        return (
            <Spinner color='secondary' size='md' />
        )
    }

    if (status === 'unauthenticated') {
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
        <>
            <Dropdown placement="bottom-end">
                <DropdownTrigger>
                    <Avatar
                        isBordered
                        as="button"
                        className="transition-transform"
                        color="secondary"
                        name={sessionInfos?.user?.email || 'User'}
                        size="sm"
                    />
                </DropdownTrigger>
                <DropdownMenu aria-label="Profile Actions" variant="flat">
                    <DropdownSection showDivider>
                        <DropdownItem key="profile" isReadOnly>
                            <p className="">Signed in as</p>
                            <p className="font-semibold">{sessionInfos?.user?.email}</p>
                        </DropdownItem>
                    </DropdownSection>
                    <DropdownSection>
                        <DropdownItem key="logout" color="danger"
                            onClick={() => {
                                signOut({
                                    callbackUrl: '/'
                                });
                            }}
                        >
                            Log Out
                        </DropdownItem>
                    </DropdownSection>
                </DropdownMenu>
            </Dropdown>
        </>
    );
};

export default NavbarAuth;
