'use client';

import React, { useEffect, useTransition } from 'react';
import { useSearchParams } from 'next/navigation';

import { signIn } from 'next-auth/react';
import { ShieldCheck } from 'lucide-react';
import LoadingButton from '@/components/LoadingButton';


interface LoginProps {
}

const Login: React.FC<LoginProps> = (props) => {
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();


    const callBackURL = searchParams.get('callback') || '/';
    const autoLoginOff = searchParams.get('auto-login') === 'false';

    const loginWithMsEntraID = async (redirectTo: string) => {
        await signIn('ms-entra-id', { callbackUrl: redirectTo });
    }

    useEffect(() => {
        if (autoLoginOff) return;
        startTransition(async () => {
            await loginWithMsEntraID(callBackURL as string);
        })
    }, [callBackURL, autoLoginOff])

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
