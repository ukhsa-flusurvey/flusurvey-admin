import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FolderOpen, Plus, StepForward } from 'lucide-react';
import React from 'react';
import TimeAgo from 'timeago-react';
import { StoredSurvey } from '../utils/SurveyStorage';



interface WelcomeScreenProps {
    onOpenSurvey: () => void;
    onCreateSurvey: () => void;
    recentlyEditedStoredSurvey?: StoredSurvey;
    onOpenRecentlyEditedSurvey?: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = (props) => {

    const lastEditedDate = props.recentlyEditedStoredSurvey?.lastUpdated ?? new Date();
    const visualSurveyId = props.recentlyEditedStoredSurvey ? props.recentlyEditedStoredSurvey.id : 'Loading...';

    return (
        <div className='flex w-full h-full justify-center items-center'>
            <Card
                variant={'opaque'}
            >
                <CardHeader>
                    <CardTitle>
                        Welcome to the survey editor
                    </CardTitle>
                    <CardDescription>
                        Open a survey or create a new one to get started.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className='flex flex-col gap-4'>

                        <Button
                            variant={'outline'}
                            className='gap-4 text-lg py-2 h-auto justify-start'
                            onClick={props.onOpenRecentlyEditedSurvey}
                            disabled={!props.recentlyEditedStoredSurvey}
                        >
                            <StepForward className='size-6' />
                            <div className='flex flex-col items-start'>
                                <p>Continue working</p>
                                {props.recentlyEditedStoredSurvey && (<p className='text-sm text-gray-500'>{<>{visualSurveyId} {" ("}<TimeAgo datetime={lastEditedDate} locale="en-US" />{")"}</>}</p>)}
                            </div>

                        </Button>
                        <Button
                            variant={'outline'}
                            className='gap-4 text-lg py-2 h-auto justify-start'
                            onClick={props.onOpenSurvey}
                        >
                            <FolderOpen className='size-6' />
                            Open survey
                        </Button>
                        <Button
                            variant={'outline'}
                            className='gap-4 text-lg py-2 h-auto justify-start'
                            onClick={props.onCreateSurvey}
                        >
                            <Plus className='size-6' />
                            Create new survey
                        </Button>
                    </div>
                </CardContent>
            </Card>

        </div>
    );
};

export default WelcomeScreen;
