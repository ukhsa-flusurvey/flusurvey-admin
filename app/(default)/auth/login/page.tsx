import CaseAdminHeader from "@/components/CaseAdminHeader";
import Login from "@/app/(default)/auth/login/_components/Login";
import { Suspense } from "react";
import { Card } from "@/components/ui/card";

export default async function Page() {

    const appName = process.env.NEXT_PUBLIC_APP_NAME || 'Editor Tools';
    return (

        <div className="w-full h-screen flex items-center justify-center bg-cover bg-center bg-[url(/images/chart-illustration.png)] p-2">
            <Card
                variant={'opaque'}
                className="w-full h-full sm:h-auto sm:w-[610px]"
            >
                <div className="p-4 sm:p-6 flex flex-col gap-6 justify-center">
                    <CaseAdminHeader
                        appName={appName}
                    />
                    <Suspense fallback={<div>Loading...</div>}>
                        <Login />
                    </Suspense>
                </div>
            </Card>
        </div>
    )
}
