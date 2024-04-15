import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FolderOpen, Plus } from 'lucide-react';
import React from 'react';

interface WelcomeScreenProps {
    onOpenSurvey: () => void;
    onCreateSurvey: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = (props) => {
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
