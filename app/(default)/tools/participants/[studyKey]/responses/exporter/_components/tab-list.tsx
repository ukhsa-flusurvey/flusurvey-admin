'use client'

import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react';

interface TabListProps {
}

const TabList: React.FC<TabListProps> = (props) => {
    const router = useRouter();
    const pathname = usePathname();
    console.log(pathname);
    return (
        <TabsList>
            <TabsTrigger
                onClick={() => {
                    router.replace(pathname + '?tab=responses');
                }}
                value="responses">Responses</TabsTrigger>
            <TabsTrigger value="surveyInfo"
                onClick={() => {
                    router.replace(pathname + '?tab=surveyInfo');
                }}
            >
                Survey Info
            </TabsTrigger>
            <TabsTrigger value="confidentialResponses"
                onClick={() => {
                    router.replace(pathname + '?tab=confidentialResponses');
                }}
            >
                Confidential Responses
            </TabsTrigger>
            <TabsTrigger value="dailyResponses"
                onClick={() => {
                    router.replace(pathname + '?tab=dailyResponses');
                }}
            >
                Daily Response Exports
            </TabsTrigger>
        </TabsList>
    );
};

export default TabList;
