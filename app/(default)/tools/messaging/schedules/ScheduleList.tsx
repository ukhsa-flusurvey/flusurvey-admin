'use client';

import { AuthAPIFetcher } from '@/utils/server/fetcher';
import { MessageSchedule } from '@/utils/server/types/messaging';
import { Spinner } from '@nextui-org/react';
import { signOut } from 'next-auth/react';
import React from 'react';
import { BsEnvelopePaper, BsExclamationTriangle } from 'react-icons/bs';
import useSWR from 'swr';
import ScheduleCard from './ScheduleCard';

interface ScheduleListProps {
}


const ScheduleList: React.FC<ScheduleListProps> = (props) => {
    const { data, error, isLoading } = useSWR<{ autoMessages: MessageSchedule[] }>(`/api/case-management-api/v1/messaging/auto-messages`, AuthAPIFetcher)

    if (isLoading) {
        return <div className='py-unit-lg text-center'>
            <Spinner />
        </div>
    }

    let errorComp: React.ReactNode = null;
    if (error) {
        if (error.message === 'Unauthorized') {
            signOut({ callbackUrl: '/auth/login?callbackUrl=/tools/messaging/schedules' });
            return null;
        }

        errorComp = <div className='bg-danger-50 gap-unit-md rounded-medium p-unit-md flex items-center'>
            <div className='text-danger text-2xl'>
                <BsExclamationTriangle />
            </div>
            <div>
                <p className='text-danger font-bold'>Something went wrong</p>
                <p className='text-danger text-small'>{error.message}</p>
            </div>
        </div>
    }

    let scheduleList = <div className="flex py-unit-md flex-col justify-center items-center text-center">
        <BsEnvelopePaper className="text-3xl text-default-300 mb-unit-sm" />
        <p className="font-bold ">No schedules</p>
        <p className="text-default-500 text-small">Get started by adding a new schedule</p>
    </div>

    let schedules: Array<MessageSchedule> = [];
    if (data && data.autoMessages && data.autoMessages.length > 0) {
        schedules = data.autoMessages.map((schedule) => {
            let nt = schedule.nextTime;
            if (typeof nt === 'string') nt = parseInt(nt);

            let until = schedule.until;
            if (typeof until === 'string') until = parseInt(until);

            let period = schedule.period;
            if (typeof period === 'string') period = parseInt(period);

            return {
                ...schedule,
                nextTime: nt,
                until,
                period,
            }
        })

        scheduleList = <div className="grid grid-cols-1  gap-unit-lg">
            {schedules.map((schedule: MessageSchedule) => <ScheduleCard key={schedule.id} schedule={schedule} />)}
        </div>
    }

    return (
        <>
            {errorComp}
            {scheduleList}
        </>
    );
};

export default ScheduleList;
