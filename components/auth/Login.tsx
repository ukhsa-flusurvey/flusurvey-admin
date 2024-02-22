'use client';

import React, { useEffect, useTransition } from 'react';
import { useSearchParams } from 'next/navigation';

import { signIn } from 'next-auth/react';
import LoadingButton from '../LoadingButton';
import { ShieldCheck } from 'lucide-react';


interface LoginProps {
}

const Login: React.FC<LoginProps> = (props) => {
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();


    const callBackURL = searchParams.get('callback') || '/';

    const loginWithMsEntraID = async (redirectTo: string) => {
        await signIn('ms-entra-id', { redirectTo: redirectTo });
    }

    useEffect(() => {
        startTransition(() => {
            loginWithMsEntraID(callBackURL as string);
        })
    }, [callBackURL])

    return (
        <div>
            <div className='text-center mb-6'>
                <p className='text-sm mb-1'>
                    After you login, you will be redirected to:
                </p>
                <p className='font-mono p-2 bg-black/10 rounded-md'>
                    {callBackURL}
                </p>

            </div>
            <LoadingButton
                isLoading={isPending}
                onClick={() => loginWithMsEntraID(callBackURL)}
                className='text-lg w-full'
                variant='default'
            >
                <ShieldCheck className='size-6' />
                Login with your Organisation Account
            </LoadingButton>
        </div>
    );
};

export default Login;
