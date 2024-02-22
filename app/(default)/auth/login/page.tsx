import { login } from "@/actions/auth/login";
import CaseAdminHeader from "@/components/CaseAdminHeader";
import Login from "@/components/auth/Login";
import { Card, CardBody } from "@nextui-org/card";
import { Suspense } from "react";

export default async function Page() {

    const appName = process.env.NEXT_PUBLIC_APP_NAME || 'Editor Tools';
    return (

        <div className="w-full h-screen flex items-center justify-center bg-cover bg-center bg-[url(/images/chart-illustration.png)] p-unit-2">
            <Card
                isBlurred
                className="bg-content2/80 w-full h-full sm:h-auto sm:w-[610px]"
                shadow="sm"
            >
                <CardBody className="p-unit-md sm:p-unit-xl flex flex-col gap-unit-xl justify-center">
                    <CaseAdminHeader
                        appName={appName}
                    />
                    <Suspense fallback={<div>Loading...</div>}>
                        <Login />
                    </Suspense>
                </CardBody>
            </Card>
        </div>
    )
}
