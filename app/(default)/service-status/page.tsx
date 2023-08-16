import CaseAdminHeader from "@/components/CaseAdminHeader";
import ServiceStatus from "@/components/service-status/ServiceStatus"
import ServiceStatusLoading from "@/components/service-status/ServiceStatusLoading"
import { DocumentChartBarIcon, UserGroupIcon } from "@heroicons/react/24/solid"
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Divider } from "@nextui-org/divider";
import { Suspense } from "react"

export const dynamic = 'force-dynamic';

export default async function Page() {
    const appName = process.env.NEXT_PUBLIC_APP_NAME || 'Editor Tools';

    return (
        <main className="flex items-center justify-center h-full p-unit-2">
            <Card className='bg-content2/80 w-full sm:w-[600px]'
                isBlurred={true}
            >
                <CardBody>
                    <CaseAdminHeader
                        appName={appName}
                    />
                    <Divider
                        className='my-unit-lg'
                    />
                    <h2 className="text-3xl font-bold mb-unit-1">
                        Service Status
                    </h2>

                    <p className="text-default-600 text-small">
                        Last Updated at: {(new Date()).toLocaleTimeString()}
                    </p>

                    <div className="flex flex-col items-center justify-center mt-4 space-y-4">
                        <Suspense fallback={
                            <ServiceStatusLoading
                                name='Study Service'
                                icon={<DocumentChartBarIcon className="w-full h-full" />}
                            />
                        }>
                            <ServiceStatus
                                service='study-service'
                                name='Study Service'
                                icon={<DocumentChartBarIcon className="w-full h-full" />}
                            />
                        </Suspense>

                        <Suspense fallback={<ServiceStatusLoading
                            name='User Management'
                            icon={<UserGroupIcon className="w-full h-full" />}
                        />}>
                            <ServiceStatus
                                service='user-management'
                                name='User Management'
                                icon={<UserGroupIcon className="w-full h-full" />}
                            />
                        </Suspense>
                    </div>
                </CardBody>
            </Card>
        </main>
    )
}
