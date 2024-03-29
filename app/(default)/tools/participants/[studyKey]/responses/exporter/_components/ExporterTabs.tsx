'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SurveyInfoDownloader from './SurveyInfoDownloader';
import ResponseDownloader from './ResponseDownloader';
import ConfidentialResponseDownloader from './ConfidentialResponseDownloader';

interface ExporterTabsProps {
    studyKey: string;
    availableSurveyKeys: string[];
}

const ExporterTabs: React.FC<ExporterTabsProps> = (props) => {
    return (
        <div>
            <Card
                variant={'opaque'}
            >
                <CardHeader>
                    <CardTitle>
                        Export Survey Responses
                    </CardTitle>
                    <CardDescription>
                        Prepares a file based on your query and when ready downloads the file.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className='font-bold'>What do you want to export:</p>
                    <Tabs defaultValue="responses" className="w-auto mt-2">
                        <TabsList>
                            <TabsTrigger value="responses">Responses</TabsTrigger>
                            <TabsTrigger value="surveyInfo">
                                Survey Info
                            </TabsTrigger>
                            <TabsTrigger value="confidentialResponses">
                                Confidential Responses
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value="responses">
                            <ResponseDownloader
                                studyKey={props.studyKey}
                                availableSurveys={props.availableSurveyKeys}
                            />
                        </TabsContent>
                        <TabsContent value="surveyInfo">
                            <SurveyInfoDownloader
                                studyKey={props.studyKey}
                                availableSurveyKeys={props.availableSurveyKeys}
                            />
                        </TabsContent>
                        <TabsContent value="confidentialResponses">
                            <ConfidentialResponseDownloader
                                studyKey={props.studyKey}
                            />
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card >
        </div>
    );
};

export default ExporterTabs;
