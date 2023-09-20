import { Card, CardHeader, CardBody, CardFooter } from '@nextui-org/card';
import { Divider } from '@nextui-org/divider';
import { Button } from '@nextui-org/button';
import React from 'react';
import NotImplemented from '@/components/NotImplemented';
import { BsShuffle } from 'react-icons/bs';
import { Link as NextUILink } from '@nextui-org/link'


interface StudyRuleOverviewProps {
    studyKey: string;
}

const StudyRuleOverview: React.FC<StudyRuleOverviewProps> = (props) => {
    return (
        <Card
            className='bg-white/50'
            isBlurred
        >
            <CardHeader className="bg-content2">
                <h3 className='text-xl font-bold flex items-center'>
                    <BsShuffle className='mr-unit-sm text-default-400' />
                    Rules
                </h3>
            </CardHeader>
            <Divider />
            <CardBody className='max-h-[400px] overflow-y-scroll'>
                <NotImplemented>
                    show study rule history here
                    using step view
                    to manage (upload, edit, delete got to study rule page with button below, or to execute one time rules)
                </NotImplemented>
            </CardBody>
            <Divider />
            <CardFooter>
                <Button
                    variant="flat"
                    color="primary"
                    as={NextUILink}
                    href={`/tools/study-configurator/${props.studyKey}/rules`}
                >

                    Manage Rules
                </Button>
            </CardFooter>
        </Card>
    );
};

export default StudyRuleOverview;
