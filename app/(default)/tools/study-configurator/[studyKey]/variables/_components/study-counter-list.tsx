import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty';
import { Spinner } from '@/components/ui/spinner';
import { ExternalLink, Info, Plus, VariableIcon } from 'lucide-react';
import React from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { DOC_BASE_URL } from '@/utils/constants';
import { getStudyCounters } from '@/lib/data/study-counters';
import StudyCounterEditor from './study-counter-editor';
import StudyCounterTable from './study-counter-table';

interface StudyCounterListProps {
    studyKey: string;
}

const StudyCounterListWrapper = (props: {
    studyKey: string;
    children: React.ReactNode
}) => {
    return (
        <Card
            variant={"opaque"}
            className='w-full h-fit'
        >
            <CardHeader className='flex flex-row justify-between items-start '>
                <div className='space-y-1.5'>
                    <CardTitle>
                        Counters
                    </CardTitle>
                    <CardDescription>
                        The following study counter values are currently available in the study.
                    </CardDescription>
                </div>
                <Tooltip>
                    <TooltipTrigger>
                        <Info className='size-4' />
                    </TooltipTrigger>
                    <TooltipContent
                        className='max-w-96 space-y-1 text-sm'
                        align='end'
                        side='bottom'
                    >
                        <p>
                            Study counters are typically controlled by study rules, e.g., to count events such as eligible participant sign-ups.
                        </p>
                        <p>
                            {"If you don't see a counter you expect, check the study rules or if they have been triggered yet."}
                        </p>
                        <p>
                            For more information on study counters, please see the
                            <a
                                href={`${DOC_BASE_URL}/docs/study-configurator/study-variables/#counters`}
                                target='_blank'
                                rel='noreferrer'
                                className='text-primary underline ms-1 inline-flex items-center gap-1'
                            >
                                documentation
                                <span className='size-4 inline-block'>
                                    <ExternalLink className='size-3' />
                                </span>
                            </a>
                            .
                        </p>
                    </TooltipContent>
                </Tooltip>
            </CardHeader>

            <CardContent>
                {props.children}
            </CardContent>
        </Card>
    )
}


const StudyCounterList: React.FC<StudyCounterListProps> = async (props) => {
    const resp = await getStudyCounters(props.studyKey);

    if (resp.error) {
        return (
            <StudyCounterListWrapper studyKey={props.studyKey}>
                <Empty className="border border-dashed">
                    <EmptyHeader>
                        <EmptyMedia variant="icon">
                            <VariableIcon className='size-6 text-white' />
                        </EmptyMedia>
                        <EmptyTitle>Could not load study counters</EmptyTitle>
                        <EmptyDescription>
                            {resp.error}
                        </EmptyDescription>
                    </EmptyHeader>
                </Empty>
            </StudyCounterListWrapper>
        );
    }

    const counters = resp.values || [];

    if (counters.length === 0) {
        return (
            <StudyCounterListWrapper studyKey={props.studyKey}>
                <Empty className="border border-dashed">
                    <EmptyHeader>
                        <EmptyMedia variant="icon">
                            <VariableIcon className='size-6' />
                        </EmptyMedia>
                        <EmptyTitle>No study counters yet</EmptyTitle>
                        <EmptyDescription>
                            Check back later or or initialize a study counter with the button below.
                        </EmptyDescription>
                    </EmptyHeader>
                    <EmptyContent>
                        <StudyCounterEditor
                            studyKey={props.studyKey}
                            usedScopes={counters.map(c => c.scope)}
                            defaultValue={0}
                            trigger={<Button
                                variant={'outline'}
                            ><Plus className='size-4 me-2' />Initialize a new counter</Button>}
                        />
                    </EmptyContent>
                </Empty>
            </StudyCounterListWrapper>
        );
    }


    return (
        <StudyCounterListWrapper studyKey={props.studyKey}>
            <div className='space-y-4'>
                <StudyCounterTable
                    studyKey={props.studyKey}
                    counters={counters}
                    usedScopes={counters.map(c => c.scope)}
                />
                <div className='flex justify-center'>
                    <StudyCounterEditor
                        studyKey={props.studyKey}
                        usedScopes={counters.map(c => c.scope)}
                        defaultValue={0}
                        trigger={<Button
                            variant={'outline'}
                        ><Plus className='size-4 me-2' />Initialize a new counter</Button>}
                    />
                </div >
            </div>

        </StudyCounterListWrapper >
    );
};

export default StudyCounterList;

export const StudyCounterListSkeleton: React.FC<StudyCounterListProps> = (props) => {
    return (
        <StudyCounterListWrapper studyKey={props.studyKey}>
            <div className='flex items-center justify-center gap-2 text-muted-foreground py-8'>
                <Spinner className='size-4' />
                <span>Loading study counters...</span>
            </div>
        </StudyCounterListWrapper>
    );
}


