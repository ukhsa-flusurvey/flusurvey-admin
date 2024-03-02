'use server';

import { MessageSchedule } from '@/utils/server/types/messaging';
import React from 'react';

import ScheduleCard from './ScheduleCard';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import CogLoader from '@/components/CogLoader';
import ErrorAlert from '@/components/ErrorAlert';
import { auth } from '@/auth';
import { fetchCASEManagementAPI } from '@/utils/server/fetch-case-management-api';
import { LinkMenu } from '@/components/LinkMenu';

const ScheduledEmailsCardWrapper = ({
    isLoading,
    children
}: {
    isLoading: boolean;
    children: React.ReactNode;
}) => {
    return (
        <div className="flex">
            <Card
                variant={"opaque"}
                className="p-1"
            >
                <CardHeader>
                    <CardTitle>
                        Scheduled Emails
                    </CardTitle>
                    <CardDescription>
                        Configure email schedules to send messages automatically on a recurring basis.
                    </CardDescription>
                </CardHeader>
                <div className='px-6'>
                    {children}
                </div>
                <div className='p-6'>
                    <Button
                        disabled={isLoading}
                        asChild={!isLoading}
                    >
                        <Link
                            href="/tools/messaging/schedules/create-new-schedule">
                            Add New Schedule
                        </Link>
                    </Button>
                </div>
            </Card>
        </div>
    )
}

interface ScheduleListProps {
}

const getSchedules = async () => {
    const session = await auth();
    if (!session || !session.CASEaccessToken) {
        return { error: 'Unauthorized' };
    }
    const url = '/v1/messaging/scheduled-emails';
    const resp = await fetchCASEManagementAPI(
        url,
        session.CASEaccessToken,
        {
            revalidate: 0,
        }
    );
    if (resp.status !== 200) {
        return { error: `Failed to fetch message templates: ${resp.status} - ${resp.body.error}` };
    }
    return resp.body;
}


const ScheduledEmails: React.FC<ScheduleListProps> = async (props) => {
    const resp = await getSchedules();

    let schedules: Array<MessageSchedule> = resp.schedules;
    const error = resp.error;


    let content = null;
    if (error) {
        content = <ErrorAlert
            title="Error loading schedules"
            error={error}
        />
    } else if (!schedules || schedules.length === 0) {
        content = <p className='py-6 text-center text-neutral-600'>No schedules found.</p>
    } else {
        content = (
            <LinkMenu>
                {schedules.map((schedule: MessageSchedule) => <ScheduleCard key={schedule.id} schedule={schedule} />)}
            </LinkMenu>
        )
    }

    return (
        <ScheduledEmailsCardWrapper isLoading={false}>
            {content}
        </ScheduledEmailsCardWrapper >
    );
};

export default ScheduledEmails;

export const ScheduledEmailsSkeleton: React.FC<ScheduleListProps> = (props) => {
    return (
        <ScheduledEmailsCardWrapper isLoading={true}>
            <CogLoader
                label='Loading scheduled emails...'
            />
        </ScheduledEmailsCardWrapper>
    )
}
