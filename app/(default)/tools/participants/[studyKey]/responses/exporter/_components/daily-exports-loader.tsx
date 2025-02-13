import ErrorAlert from '@/components/ErrorAlert';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { getAvailableConfidentialResponseExports, getDailyResponseExports } from '@/lib/data/responses';
import React from 'react';
import DailExportsClient, { DailyExport } from './dail-exports-client';

interface DailyExportsLoaderProps {
    studyKey: string;
    type: 'responses' | 'confidential-responses';
}

const DailyExportsLoader: React.FC<DailyExportsLoaderProps> = async (props) => {
    const response = props.type === 'responses' ? await getDailyResponseExports(props.studyKey) : await getAvailableConfidentialResponseExports(props.studyKey);

    if (response.error) {
        return (<ErrorAlert
            title='Error loading available exports'
            error={response.error}
        />
        )
    }



    const availableFiles: Array<DailyExport> = [];
    if (response.availableFiles) {
        for (let i = 0; i < response.availableFiles.length; i++) {
            const dailyExport = response.availableFiles[i];
            const parts = dailyExport.split('##');

            if (parts.length < 4) {
                continue;
            }

            availableFiles.push({
                id: i,
                filename: dailyExport,
                surveyKey: parts[2],
                date: parts[0],
                type: parts[3].split('.')[0],
            })
        }
    }

    availableFiles.sort((a, b) => {
        return b.date.localeCompare(a.date);
    });


    return (
        <DailExportsClient
            studyKey={props.studyKey}
            dailyExports={availableFiles}
            type={props.type}
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
