'use client';

import { SessionProvider } from 'next-auth/react';
import React from 'react';

interface AuthProviderProps {
    children: React.ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = (props) => {
    return (
        <SessionProvider>
            {props.children}
        </SessionProvider>
    );
};

export default AuthProvider;
