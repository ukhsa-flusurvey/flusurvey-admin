import { signIn, useSession } from 'next-auth/react';
import React, { useEffect } from 'react';

interface AuthManagerProps {
    children: React.ReactNode;
}

const AuthManager: React.FC<AuthManagerProps> = (props) => {
    const { data: session } = useSession();

    useEffect(() => {
        if (session?.error === 'RefreshAccessTokenError') {
            signIn();
        }
    }, [session]);

    return (
        <>
            {props.children}
        </>
    );
};

export default AuthManager;
