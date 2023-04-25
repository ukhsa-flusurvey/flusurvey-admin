import ServiceStatus from "@/components/service-status/ServiceStatus"
import ServiceStatusLoading from "@/components/service-status/ServiceStatusLoading"
import { DocumentChartBarIcon, UserGroupIcon } from "@heroicons/react/24/solid"
import { Suspense } from "react"

export default async function Page() {

    return (
        <div className="flex flex-col items-center justify-center w-full h-screen bg-gray-100">
            <div className='p-8 bg-white rounded-2xl shadow-lg'>
                <h1 className="text-3xl font-bold text-gray-800">
                    {'Service Status'}
                </h1>
                <p className="text-gray-500 mt-2">
                    Last Updated at: {(new Date()).toLocaleTimeString()}
                </p>

                <div className="flex flex-col items-center justify-center mt-4 space-y-4">
                    <Suspense fallback={
                        <ServiceStatusLoading
                            name='Study Service'
                            icon={<DocumentChartBarIcon className="w-full h-full" />}
                        />
                    }>
                        {/* @ts-expect-error Async Server Component */}
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
                        {/* @ts-expect-error Async Server Component */}
                        <ServiceStatus
                            service='user-management'
                            name='User Management'
                            icon={<UserGroupIcon className="w-full h-full" />}
                        />
                    </Suspense>
                </div>
            </div>
        </div>
    )
}
