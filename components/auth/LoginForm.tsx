import React from 'react';
import ShieldCheckIcon from '@heroicons/react/24/outline/ShieldCheckIcon';
import { signIn } from 'next-auth/react';
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";

interface LoginFormProps {
    isSecondFactor: boolean;
    isLoading: boolean;
    loginData: {
        email: string;
        verificationCode: string;
        password: string;
    };
    setLoginData: (loginData: {
        email: string;
        verificationCode: string;
        password: string;
    }) => void;
    handleLogin: () => void;
    hasError?: boolean;
    errorMsg?: string;
}

const LoginForm: React.FC<LoginFormProps> = ({ setLoginData, loginData, isLoading, isSecondFactor, handleLogin, hasError, errorMsg, ...props }) => {

    if (isSecondFactor) {
        return (
            <div>
                <form onSubmit={(event) => {
                    event.preventDefault();
                    handleLogin();
                }} >
                    <label className="block mt-4">
                        <span className="text-gray-700">6 digit code</span>

                        <Input type="text"
                            value={loginData.verificationCode}
                            onValueChange={(value) => {
                                setLoginData({
                                    ...loginData,
                                    verificationCode: value.replaceAll('-', '')
                                })
                            }}
                            validationState={hasError ? 'invalid' : 'valid'}
                            errorMessage={hasError ? 'Wrong verification code' : ''}
                        />

                    </label>
                    <Button >Submit</Button>
                </form>
            </div>);
    }

    return (
        <div className='flex flex-col gap-unit-md'>
            <h2 className='text-3xl'>Login</h2>
            <form onSubmit={(event) => {
                event.preventDefault();
                handleLogin();
            }}
                className='flex flex-col gap-unit-md'
            >

                <Input
                    type="email"
                    value={loginData.email}
                    variant="flat"
                    label='Email'
                    labelPlacement='outside'
                    size='lg'
                    autoComplete='email'
                    name='email'
                    placeholder='Enter your email'
                    onValueChange={(value) => {
                        setLoginData({
                            ...loginData,
                            email: value
                        })
                    }}
                    isInvalid={hasError}
                    errorMessage={hasError ? 'Wrong email or password' : ''}
                />

                <Input
                    label='Password'
                    type="password"
                    variant='flat'
                    security='true'
                    size='lg'
                    autoComplete='current-password'
                    name='password'
                    labelPlacement='outside'
                    placeholder='Enter your password'
                    value={loginData.password}
                    onValueChange={(value) => {
                        setLoginData({
                            ...loginData,
                            password: value
                        })
                    }}
                    validationState={hasError ? 'invalid' : 'valid'}
                    errorMessage={hasError ? 'Wrong email or password' : ''}
                />


                <Button
                    isLoading={isLoading}
                    type='submit'
                    isDisabled={loginData.email === '' || loginData.password === ''}
                    color='primary'
                    size='lg'
                >
                    Login
                </Button>
            </form>

            <div className='flex row items-center my-4'>
                <div className='border-t border-t-gray-400 grow h-[1px]'></div>
                <span className='px-2 text-gray-400'>OR</span>
                <div className='border-t border-t-gray-400 grow h-[1px]'></div>
            </div>

            <Button
                type='button'
                variant='ghost'
                size='lg'
                color='primary'
                onClick={async () => {
                    await signIn('management-user-oauth', { redirect: false, callbackUrl: '/' });
                    console.log('login')
                }}
            >
                <ShieldCheckIcon className="h-6 w-6 mr-2" />
                Login Via Institute Account
            </Button>

        </div>
    );

}


export default LoginForm;
