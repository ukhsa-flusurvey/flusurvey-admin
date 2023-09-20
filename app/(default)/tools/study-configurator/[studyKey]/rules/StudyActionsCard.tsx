'use client';


import NotImplemented from '@/components/NotImplemented';
import { Card, CardBody, CardHeader, Divider } from '@nextui-org/react';
import React from 'react';
import { BsBracesAsterisk } from 'react-icons/bs';


interface StudyActionsCardProps {
    studyKey: string;
}


const StudyActionsCard: React.FC<StudyActionsCardProps> = (props) => {

    return (
        <Card
            className='bg-white/50'
            isBlurred
        >
            <CardHeader className="bg-content2">
                <h3 className='text-xl font-bold flex items-center'>
                    <BsBracesAsterisk className='mr-unit-sm text-default-400' />
                    Study actions
                </h3>
            </CardHeader>
            <Divider />
            <CardBody className='max-h-[400px] overflow-y-scroll'>
                <NotImplemented>
                    go to study actions page: - run custom rules on time - templates to generate actions for common tasks
                </NotImplemented>
            </CardBody>
            <Divider />

        </Card>
    );
};

export default StudyActionsCard;
