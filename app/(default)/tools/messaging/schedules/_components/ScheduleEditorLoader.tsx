'use server'

import { auth } from '@/auth';
import CogLoader from '@/components/CogLoader';
import ErrorAlert from '@/components/ErrorAlert';
import { fetchCASEManagementAPI } from '@/utils/server/fetch-case-management-api';
import { MessageSchedule } from '@/utils/server/types/messaging';
import React from 'react';
import ScheduleEditor from './ScheduleEditor';

interface ScheduleEditorLoaderProps {
    id: string;
}

const getScheduleById = async (id: string) => {
    const session = await auth();
    if (!session || !session.CASEaccessToken) {
        return { error: 'Unauthorized' };
    }
    const url = '/v1/messaging/scheduled-emails/' + id;
    const resp = await fetchCASEManagementAPI(
        url,
        session.CASEaccessToken,
        {
            revalidate: 0,
        }
    );
    if (resp.status !== 200) {
        return { error: `Failed to fetch scheduled email: ${resp.status} - ${resp.body.error}` };
    }
    return resp.body;
}

const ScheduleEditorLoader: React.FC<ScheduleEditorLoaderProps> = async (props) => {
    const resp = await getScheduleById(props.id);

    const schedule: MessageSchedule = resp.schedule;

    const error = resp.error;
    if (error) {
        return (
            <ErrorAlert
                title={`Error while loading schedule '${props.id}':`}
                error={error}
                hint="If this is an unexpected, check you connection and try again. Try to refresh the page or log out and log in again. If the problem persists, contact support."
            />
        );
    }

    if (!schedule) {
        return (
            <ErrorAlert
                title={`Error while loading schedule '${props.id}':`}
                error="No schedule found"
                hint="Check if your URL is correct and try again. If the problem persists, contact support."
            />
        );
    }

    return (
        <ScheduleEditor
            schedule={schedule}
        />
    );
};

export default ScheduleEditorLoader;

export const ScheduleEditorLoaderSkeleton: React.FC = () => {
    return (
        <div className='flex justify-center grow'>
            <CogLoader label='Loading schedule...'
                className='w-full'
            />
        </div>
    );
}
