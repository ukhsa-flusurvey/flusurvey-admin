import Head from 'next/head'
import ShieldCheckIcon from '@heroicons/react/24/outline/ShieldCheckIcon';
import PrimaryOutlinedButton from '@/components/buttons/PrimaryOutlinedButton';
import { useSession, signIn, signOut } from "next-auth/react";
import LoadingButton from '@/components/buttons/LoadingButton';
import Spinner from '@/components/Spinner';
import { useRouter } from 'next/router'
import Button from '@/components/buttons/Button';
import { useState } from 'react';


export default function Login() {
    const { data: session, status } = useSession()
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false);
    const [loginData, setLoginData] = useState({
        email: '',
        password: '',
        verificationCode: ''
    });


    console.log(session, status)
    if (session?.error === 'RefreshAccessTokenError') {
        signOut();
    }

    if (status === 'loading') {
        return <div className='h-screen bg-slate-100 flex justify-center items-center'>
            <Spinner size='xl' />
        </div>
    }

    if (status === 'authenticated') {
        return <div className='h-screen bg-slate-100 flex justify-center items-center'>
            <div className='bg-white rounded shadow p-6'>
                <h1 className=' text-gray-600 mb-2'>You are already logged in as:</h1>
                <p className='text-2xl font-bold'>{session.user?.email}</p>
                <div className='flex space-x-4'>
                    <Button onClick={() => router.push('/dashboard')}>Go to dashboard</Button>
                    <Button onClick={() => signOut()}>Logout</Button>
                </div>
            </div>
        </div>
    }

    const handleLogin = async () => {
        setIsLoading(true);
        try {
            const res = await signIn('case-credentials', {
                email: loginData.email,
                password: loginData.password,
                redirect: false,
            });
            console.log(res)
            if (!res) {
                return
            }
            if (res.error === 'Second factor needed') {
                console.log('todo, ask code');
            }

        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <>
            <Head>
                <title>CASE Admin - Login</title>
                <meta name="description" content="admin page for CASE instance" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className='h-screen bg-blue-500 bg-repeat bg-[length:350px_350px] bg-[url(/images/random-shapes.svg)]'>

                <div className='h-full drop-shadow-[5px_0px_8px_rgba(0,0,0,0.25)]'>
                    <div className='h-full md:right-clipped bg-slate-100 sm:w-full md:w-9/12 lg:w-7/12 flex flex-col align-middle'>


                        <div className='px-10 m-auto w-[500px]'>
                            <div className='border-l-[5px] border-l-blue-600 px-4'>
                                <h1 className='text-2xl'>
                                    <span className='font-normal text-blue-600 text-lg'>CASE ADMIN</span> <br />
                                    <span className='font-semibold tracking-wider'>Infectieradar</span>
                                </h1>
                            </div>

                            <div className='mt-10'>
                                <h2 className='text-3xl'>Login</h2>
                                <form onSubmit={(event) => {
                                    event.preventDefault();
                                    handleLogin();
                                }} >
                                    <label className="block mt-4">
                                        <span className="text-gray-700">Email</span>
                                        <input type="email"
                                            onChange={(event) => {
                                                setLoginData({
                                                    ...loginData,
                                                    email: event.target.value
                                                })
                                            }}
                                            className='form-input block w-full mt-1 rounded border-gray-300'></input>

                                    </label>
                                    <label className="block mt-4">
                                        <span className="text-gray-700">Password</span>
                                        <input type="password"
                                            onChange={(event) => {
                                                setLoginData({
                                                    ...loginData,
                                                    password: event.target.value
                                                })
                                            }}
                                            className='form-input block w-full mt-1 rounded border-gray-300'></input>


                                    </label>

                                    <LoadingButton
                                        isLoading={isLoading}
                                        type='submit'
                                        onClick={() => {
                                            handleLogin();
                                        }}
                                    >
                                        Login
                                    </LoadingButton>
                                </form>

                                <div className='flex row items-center my-4'>
                                    <div className='border-t border-t-gray-400 grow h-[1px]'></div>
                                    <span className='px-2 text-gray-400'>OR</span>
                                    <div className='border-t border-t-gray-400 grow h-[1px]'></div>
                                </div>

                                <PrimaryOutlinedButton
                                    className='mt-2 w-full'
                                    type='button'
                                    onClick={() => {
                                        signIn('management-user-oauth', { redirect: true, callbackUrl: '/dashboard' });
                                    }}
                                >
                                    <ShieldCheckIcon className="h-6 w-6 mr-2" />
                                    Login Via Institute Account
                                </PrimaryOutlinedButton>

                            </div>

                        </div>

                    </div>
                </div>
            </main>
        </>
    )
}
