import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty';
import { Spinner } from '@/components/ui/spinner';
import { getStudyVariables } from '@/lib/data/study-variables-api';
import { Plus, VariableIcon } from 'lucide-react';
import React from 'react';
import VariableListClient from './VariableListClient';
import VariableDefEditDialog from '@/app/(default)/tools/study-configurator/[studyKey]/variables/_components/VariableDefEditDialog';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { ExternalLink, Info } from 'lucide-react';
import { DOC_BASE_URL } from '@/utils/constants';

interface VariableListProps {
    studyKey: string;
}

const VariableListWrapper = (props: {
    studyKey: string;
    children: React.ReactNode
}) => {
    return (
        <Card
            variant={"opaque"}
            className='w-full'
        >
            <CardHeader className='flex flex-row justify-between items-start'>
                <div className='space-y-1.5'>
                    <CardTitle>
                        Variables
                    </CardTitle>
                    <CardDescription>
                        Configure dynamic values to control the study flow.
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
                            Study variables are dynamic values that can be used to customize and control your study flow. They can be referenced in study rules, conditions, and expressions to create flexible study logic.
                        </p>
                        <p>
                            For more information on study variables, please see the
                            <a
                                href={`${DOC_BASE_URL}/docs/study-configurator/study-variables/`}
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


const VariableList: React.FC<VariableListProps> = async (props) => {
    const resp = await getStudyVariables(props.studyKey);

    if (resp.error) {
        return (
            <VariableListWrapper studyKey={props.studyKey}>
                <Empty className="border border-dashed">
                    <EmptyHeader>
                        <EmptyMedia variant="icon">
                            <VariableIcon className='size-6 text-white' />
                        </EmptyMedia>
                        <EmptyTitle>Could not load variables</EmptyTitle>
                        <EmptyDescription>
                            {resp.error}
                        </EmptyDescription>
                    </EmptyHeader>
                </Empty>
            </VariableListWrapper>
        );
    }

    const variables = resp.variables || [];

    if (variables.length === 0) {
        return (
            <VariableListWrapper studyKey={props.studyKey}>
                <Empty className="border border-dashed">
                    <EmptyHeader>
                        <EmptyMedia variant="icon">
                            <VariableIcon className='size-6' />
                        </EmptyMedia>
                        <EmptyTitle>No variables yet</EmptyTitle>
                        <EmptyDescription>
                            Create your first variable to start configuring your study.
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
            </VariableListWrapper>
        );
    }


    return (
        <VariableListWrapper studyKey={props.studyKey}>
            <VariableListClient studyKey={props.studyKey} variables={variables} />
        </VariableListWrapper>
    );
};

export default VariableList;

export const VariableListSkeleton: React.FC<VariableListProps> = (props) => {
    return (
        <VariableListWrapper studyKey={props.studyKey}>
            <div className='flex items-center justify-center gap-2 text-muted-foreground py-8'>
                <Spinner className='size-4' />
                <span>Loading variables...</span>
            </div>
        </VariableListWrapper>
    );
}


