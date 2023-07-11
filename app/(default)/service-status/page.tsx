import Container from "@/components/Container"
import ServiceStatus from "@/components/service-status/ServiceStatus"
import ServiceStatusLoading from "@/components/service-status/ServiceStatusLoading"
import { DocumentChartBarIcon, UserGroupIcon } from "@heroicons/react/24/solid"
import { Suspense } from "react"

export const dynamic = 'force-dynamic';

export default async function Page() {

    return (
        <Container>
            <div className='p-8 bg-white rounded-2xl shadow-lg max-w-[500px] mx-auto'>

                <p className="text-gray-500">
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
            </div>
        </Container>
    )
}
