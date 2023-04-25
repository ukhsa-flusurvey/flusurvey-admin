import React, { useEffect, useState } from 'react';
import useSWR, { Fetcher } from 'swr'
import { ServiceStatusInfo } from './api/service-status/[serviceName]';
import { ServerStackIcon, DocumentChartBarIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/solid';
import ServiceStatusDisplay from '@/components/ServiceStatusDisplay';
import Spinner from '@/components/Spinner';

interface ServiceStatusProps {
}

const ServiceStatusFetcher: Fetcher<ServiceStatusInfo, string> = (serviceName: string) => fetch(`/api/service-status/${serviceName}`).then((res) => res.json());

const getStatusFlag = (response?: ServiceStatusInfo) => {
    if (response !== undefined && response.msg !== 'Service is not available') {
        return 'ok';
    }
    return 'error';
}

const ServiceStatus: React.FC<ServiceStatusProps> = (props) => {
    const { data: studyServiceStatus, error: errorStudyServStatus, isLoading: isLoadingStudyServStatus } = useSWR<ServiceStatusInfo, Error>('study-service', ServiceStatusFetcher);
    const { data: umServiceStatus, error: errorUmServStatus, isLoading: isLoadingUmServStatus } = useSWR<ServiceStatusInfo, Error>('user-management', ServiceStatusFetcher);

    const [lastUpdated, setLastUpdated] = useState<Date | undefined>(undefined);

    useEffect(() => {
        setLastUpdated(new Date());
    }, [studyServiceStatus, umServiceStatus, errorStudyServStatus, errorUmServStatus]);

    const isAllOk = getStatusFlag(studyServiceStatus) === 'ok' && getStatusFlag(umServiceStatus) === 'ok';
    const isAnyLoading = isLoadingStudyServStatus || isLoadingUmServStatus;


    const renderGlobalStatus = () => {
        if (isAllOk) {
            return <CheckCircleIcon className="w-16 h-16 text-green-500" />
        }
        return <ExclamationCircleIcon className="w-16 h-16 text-red-500" />
    }

    return (
        <div className="flex flex-col items-center justify-center w-full h-screen bg-gray-100">
            <div className='p-8 bg-white rounded-2xl shadow-lg'>

                <div className="flex items-top justify-center">
                    {isAnyLoading ? <Spinner /> : renderGlobalStatus()}
                    <ServerStackIcon className="w-36 h-36 text-gray-400" />
                </div>
                <h1 className="text-3xl font-bold text-gray-800">
                    {isAllOk ? 'All services are up and running' : 'Some services are not available'}
                </h1>
                <p className="text-gray-500 text-center mt-2">
                    Last Updated at: {lastUpdated ? lastUpdated.toLocaleTimeString() : 'Update in Progress'}
                </p>

                <div className="flex flex-col items-center justify-center mt-4 space-y-4">
                    <ServiceStatusDisplay
                        name="Study Service"
                        status={getStatusFlag(studyServiceStatus)}
                        isLoading={isLoadingStudyServStatus}
                        icon={<DocumentChartBarIcon className="w-full h-full" />}
                    />
                    <ServiceStatusDisplay
                        name="User Management"
                        status={getStatusFlag(umServiceStatus)}
                        isLoading={isLoadingUmServStatus}
                        icon={<UserGroupIcon className="w-full h-full" />}
                    />
                </div>
            </div>
        </div>
    );
};

export default ServiceStatus;
