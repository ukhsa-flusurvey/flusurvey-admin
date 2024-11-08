import ErrorAlert from '@/components/ErrorAlert';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { getDailyResponseExports } from '@/lib/data/responses';
import React from 'react';
import DailExportsClient, { DailyExport } from './dail-exports-client';

interface DailyExportsLoaderProps {
    studyKey: string;
}

const DailyExportsLoader: React.FC<DailyExportsLoaderProps> = async (props) => {
    const dailyExports = await getDailyResponseExports(props.studyKey);

    if (dailyExports.error) {
        return (<ErrorAlert
            title='Error loading daily exports'
            error={dailyExports.error}
        />
        )
    }


    const availableDailyExports: Array<DailyExport> = [];
    if (dailyExports.dailyExports) {
        for (let i = 0; i < dailyExports.dailyExports.length; i++) {
            const dailyExport = dailyExports.dailyExports[i];
            const parts = dailyExport.split('##');

            if (parts.length < 3) {
                continue;
            }

            availableDailyExports.push({
                id: i,
                filename: dailyExport,
                surveyKey: parts[2],
                date: parts[0],
            })
        }
    }

    availableDailyExports.sort((a, b) => {
        return b.date.localeCompare(a.date);
    });


    return (
        <DailExportsClient
            studyKey={props.studyKey}
            dailyExports={availableDailyExports}
        />
    );
};

export default DailyExportsLoader;

export const DailyExportsLoaderSkeleton = () => {
    return <Card className='p-4 space-y-1'>
        <Skeleton className='h-8 w-full' />
        <Skeleton className='h-6 w-full' />
        <Skeleton className='h-6 w-full' />
        <Skeleton className='h-6 w-full' />
        <Skeleton className='h-6 w-full' />
    </Card>
}
