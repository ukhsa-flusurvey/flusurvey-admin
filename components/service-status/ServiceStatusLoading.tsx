import React from 'react';
import { Spinner } from "@nextui-org/spinner";
import { Card, CardBody } from "@nextui-org/card";


interface ServiceStatusDisplayProps {
    icon: React.ReactElement;
    name: string;
}

export default function ServiceStatusLoading(props: ServiceStatusDisplayProps) {

    return (
        <Card fullWidth shadow='sm'>
            <CardBody>
                <div
                    className='flex items-center'
                >
                    <div className='w-12 h-12 text-gray-400'>{props.icon}</div>
                    <span className='text-2xl font-bold mx-4 grow'>{props.name}</span>
                    <div className='flex flex-col justify-center text-center'>
                        <Spinner color='primary' />
                    </div>
                </div>
            </CardBody>
        </Card>
    );
};

