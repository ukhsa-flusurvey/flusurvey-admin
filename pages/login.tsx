import Head from 'next/head'
import ShieldCheckIcon from '@heroicons/react/24/outline/ShieldCheckIcon';
import PrimaryButton from '@/components/buttons/PrimaryButton';
import PrimaryOutlinedButton from '@/components/buttons/PrimaryOutlinedButton';


export default function Login() {
    return (
        <>
            <Head>
                <title>Create Next App</title>
                <meta name="description" content="Generated by create next app" />
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
                                <label className="block mt-4">
                                    <span className="text-gray-700">Email</span>
                                    <input type="email" className='form-input block w-full mt-1 rounded border-gray-300'></input>

                                </label>
                                <label className="block mt-4">
                                    <span className="text-gray-700">Password</span>
                                    <input type="password"
                                        placeholder='XXXXXX'
                                        className='form-input block w-full mt-1 rounded border-gray-300'></input>

                                </label>

                                <PrimaryButton

                                >
                                    Login
                                </PrimaryButton>


                                <div className='flex row items-center my-4'>
                                    <div className='border-t border-t-gray-400 grow h-[1px]'></div>
                                    <span className='px-2 text-gray-400'>OR</span>
                                    <div className='border-t border-t-gray-400 grow h-[1px]'></div>
                                </div>

                                <PrimaryOutlinedButton
                                    className='mt-2 w-full'
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