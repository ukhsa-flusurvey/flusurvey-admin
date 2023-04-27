import React from 'react';
import { CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/solid';
import { ServiceStatusInfo, getServiceStatus } from '@/utils/server/status';
import Spinner from '../Spinner';


interface ServiceStatusDisplayProps {
    icon: React.ReactElement;
    service: string;
    name: string;
    isLoading?: boolean;
}

const getStatusFlag = (response?: ServiceStatusInfo) => {
    if (response !== undefined && response.msg !== 'Service is not available') {
        return 'ok';
    }
    return 'error';
}

export default async function ServiceStatus(props: ServiceStatusDisplayProps) {
    const serviceStatus = await getServiceStatus(props.service);

    const status = getStatusFlag(serviceStatus);


    const renderStatusIconWithText = () => {
        if (props.isLoading) {
            return <div className='flex flex-col justify-center text-center'>
                <Spinner color='blue' />
            </div>
        }

        if (status === 'ok') {
            return <div className='flex flex-col justify-center text-center'>
                <CheckCircleIcon className="w-6 h-6 mx-auto text-green-500" />
                <span className='text-green-500 text-sm'>Available</span>
            </div>
        }

        return <div className='flex flex-col justify-center text-center'>
            <ExclamationCircleIcon className="w-6 h-6 mx-auto text-red-500" />
            <span className='text-red-500 text-sm'>Not Available</span>
        </div>
    }

    return (
        <div className='flex items-center border-2 p-4 rounded w-full'>
            <div className='w-12 h-12 text-gray-400'>{props.icon}</div>
            <span className='text-2xl font-bold mx-4 grow'>{props.name}</span>
            <span>
                {renderStatusIconWithText()}
            </span>
        </div>
    );
};

