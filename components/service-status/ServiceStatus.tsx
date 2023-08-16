import React from 'react';
import { CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/solid';
import { ServiceStatusInfo, getServiceStatus } from '@/utils/server/status';
import Spinner from '../Spinner';
import { Card, CardBody } from '@nextui-org/card';


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
    let serviceStatus: ServiceStatusInfo | undefined = undefined;
    try {
        serviceStatus = await getServiceStatus(props.service);
    } catch (e) {
        console.error(e);
    }

    const status = getStatusFlag(serviceStatus);


    const renderStatusIconWithText = () => {
        if (props.isLoading) {
            return <div className='flex flex-col justify-center text-center'>
                <Spinner color='blue' />
            </div>
        }

        if (status === 'ok') {
            return <div className='flex flex-col justify-center text-center'>
                <CheckCircleIcon className="w-6 h-6 mx-auto text-success" />
                <span className='text-success-800 text-sm'>Available</span>
            </div>
        }

        return <div className='flex flex-col justify-center text-center'>
            <ExclamationCircleIcon className="w-6 h-6 mx-auto text-danger" />
            <span className='text-danger-700 text-sm'>Not Available</span>
        </div>
    }

    return (
        <Card fullWidth shadow='sm'>
            <CardBody>
                <div
                    className='flex items-center'
                >
                    <div className='w-12 h-12 text-gray-400'>{props.icon}</div>
                    <span className='text-2xl font-bold mx-4 grow'>{props.name}</span>
                    <span>
                        {renderStatusIconWithText()}
                    </span>
                </div>
            </CardBody>
        </Card>
    );
};

