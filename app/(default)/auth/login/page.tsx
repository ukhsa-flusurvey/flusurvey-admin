import CaseAdminHeader from "@/components/CaseAdminHeader";
import Login from "@/components/auth/Login";

export default async function Page() {
    return (
        <div className='h-full bg-slate-100 '>
            <div className='h-full ddrop-shadow-[5px_0px_8px_rgba(0,0,0,0.25)]'>
                <div className='h-full bg-repeat bg-[length:350px_350px] bg-[url(/images/random-shapes.svg)] md:right-clipped bg-cyan-800 sm:w-full md:w-9/12 lg:w-7/12 flex flex-col align-middle'>
                    <div className='p-6 m-auto sm:w-[500px] bg-white rounded'>
                        <CaseAdminHeader
                            appName={process.env.NEXT_PUBLIC_APP_NAME || 'Editor Tools'}
                        />
                        <Login />
                    </div>
                </div>
            </div>
        </div>
    )
}
