import React from 'react';
import { CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/solid';
import { ServiceStatusInfo, getServiceStatus } from '@/utils/server/status';
import Spinner from '../Spinner';


interface ServiceStatusDisplayProps {
    icon: React.ReactElement;
    name: string;
}

export default function ServiceStatusLoading(props: ServiceStatusDisplayProps) {

    return (
        <div className='flex items-center border-2 p-4 rounded w-full'>
            <div className='w-12 h-12 text-gray-400'>{props.icon}</div>
            <span className='text-2xl font-bold mx-4 grow'>{props.name}</span>
            <div className='flex flex-col justify-center text-center'>
                <Spinner color='blue' />
            </div>
        </div>
    );
};

