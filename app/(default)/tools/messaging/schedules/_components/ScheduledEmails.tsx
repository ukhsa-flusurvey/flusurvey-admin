import { MessageSchedule } from '@/utils/server/types/messaging';
import React from 'react';

import ScheduleCard from './ScheduleCard';
import CogLoader from '@/components/CogLoader';
import ErrorAlert from '@/components/ErrorAlert';
import { LinkMenu } from '@/components/LinkMenu';
import { ItemListCardWrapperWithAddButton } from '@/components/ItemListCardWrapperWithAddButton';
import { getEmailSchedules } from '@/lib/data/messagingAPI';

const ScheduledEmailsCardWrapper = ({
    isLoading,
    children
}: {
    isLoading: boolean;
    children: React.ReactNode;
}) => {
    return (
        <div className="flex">
            <ItemListCardWrapperWithAddButton
                isLoading={isLoading}
                title="Scheduled Emails"
                description="Configure email schedules to send messages automatically on a recurring basis."
                addHref="/tools/messaging/schedules/create-new-schedule"
                addLabel="Add New Schedule"
            >
                {children}
            </ItemListCardWrapperWithAddButton>
        </div>
    )
}



const ScheduledEmails: React.FC = async () => {
    const resp = await getEmailSchedules();

    const schedules: Array<MessageSchedule> = resp.schedules;
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

export const ScheduledEmailsSkeleton: React.FC = () => {
    return (
        <ScheduledEmailsCardWrapper isLoading={true}>
            <CogLoader
                label='Loading scheduled emails...'
            />
        </ScheduledEmailsCardWrapper>
    )
}
