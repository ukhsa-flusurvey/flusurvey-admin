import { Study } from '@/utils/server/types/studyInfos';
import { Card, CardHeader, CardBody, CardFooter } from '@nextui-org/card';
import { Divider } from '@nextui-org/divider';
import { Button } from '@nextui-org/button';
import React from 'react';
import NotImplemented from '@/components/NotImplemented';
import { BsBell } from 'react-icons/bs';

interface StudyNotificationSubsCardProps {
    study: Study;
}

const StudyNotificationSubsCard: React.FC<StudyNotificationSubsCardProps> = (props) => {
    return (
        <Card
            className='bg-white/50'
            isBlurred
        >
            <CardHeader className="bg-content2">
                <h3 className='text-xl font-bold flex items-center'>
                    <BsBell className='mr-unit-sm text-default-400' />
                    Study notifications
                </h3>
            </CardHeader>
            <Divider />
            <CardBody className='max-h-[400px] overflow-y-scroll'>
                <NotImplemented>
                    which email will receive notifications for which study events
                </NotImplemented>
            </CardBody>
            <Divider />
            <CardFooter>
                <Button
                    variant="flat"
                    color="primary"
                //    as={NextUILink}
                // href={`/tools/study-configurator/${props.studyKey}/survey/new`}
                >

                    Manage notifications
                </Button>
            </CardFooter>
        </Card>
    );
};

export default StudyNotificationSubsCard;
