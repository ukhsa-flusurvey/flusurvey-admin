import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty';
import { Spinner } from '@/components/ui/spinner';
import { getStudyVariables } from '@/lib/data/study-variables-api';
import { ExternalLink, Info, Plus, VariableIcon } from 'lucide-react';
import React from 'react';
import VariableListClient from './VariableListClient';
import VariableDefEditDialog from '@/app/(default)/tools/study-configurator/[studyKey]/variables/_components/VariableDefEditDialog';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { DOC_BASE_URL } from '@/utils/constants';

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
            className='w-full'
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
    const resp = await getStudyVariables(props.studyKey);

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

    const variables = resp.variables || [];

    if (variables.length === 0) {
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
                        <VariableDefEditDialog
                            studyKey={props.studyKey}
                            usedKeys={[]}
                            trigger={<Button><Plus className='size-4 me-2' />Create variable</Button>}
                        />
                    </EmptyContent>
                </Empty>
            </StudyCounterListWrapper>
        );
    }


    return (
        <StudyCounterListWrapper studyKey={props.studyKey}>
            <VariableListClient studyKey={props.studyKey} variables={variables} />
        </StudyCounterListWrapper>
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


