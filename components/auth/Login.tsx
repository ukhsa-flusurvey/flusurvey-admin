'use client';

import React, { useState, useTransition } from 'react';
import LoginForm from './LoginForm';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ERROR_SECOND_FACTOR_NEEDED } from '@/utils/server/types/authAPI';

interface LoginProps {
}

const Login: React.FC<LoginProps> = (props) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();

    const [isLoading, setIsLoading] = useState(false);
    const [loginData, setLoginData] = useState({
        email: '',
        password: '',
        verificationCode: ''
    });

    const [isSecondFactor, setIsSecondFactor] = useState(false);
    const [isError, setError] = useState(false);

    const callBackURL = searchParams.get('callbackUrl') || '/';


    const handleLogin = async () => {
        setIsLoading(true);
        try {
            const res = await signIn('case-credentials', {
                email: loginData.email,
                password: loginData.password,
                redirect: false,
                verificationCode: loginData.verificationCode,
                callbackUrl: callBackURL as string,
            });
            console.log(res)
            if (!res) {
                return
            }
            if (res.ok === false) {
                setError(true);

            } else {
                if (res.url) {
                    const to = res.url;
                    startTransition(() => {
                        router.refresh();
                        router.replace(to);
                    })

                }
                setError(false);
            }
            if (res.error === ERROR_SECOND_FACTOR_NEEDED) {
                setError(false);
                setIsSecondFactor(true);
            }

        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <LoginForm
            isLoading={isLoading || isPending}
            isSecondFactor={isSecondFactor}
            loginData={loginData}
            handleLogin={handleLogin}
            setLoginData={setLoginData}
            hasError={isError}
        />
    );
};

export default Login;
