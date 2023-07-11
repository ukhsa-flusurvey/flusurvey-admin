import CaseAdminHeader from "@/components/CaseAdminHeader";
import Login from "@/components/auth/Login";

export default async function Page() {
    return (
        <div className='h-full bg-slate-100 '>
            <div className='h-full bg-repeat bg-[length:350px_350px] bg-[url(/images/random-shapes.svg)] bg-cyan-800 w-full flex flex-col align-middle'>
                <div className='p-6 m-auto sm:w-[500px] bg-white rounded'>
                    <CaseAdminHeader
                        appName={process.env.NEXT_PUBLIC_APP_NAME || 'Editor Tools'}
                    />
                    <Login />
                </div>
            </div>
        </div>
    )
}
