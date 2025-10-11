import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty';
import { Spinner } from '@/components/ui/spinner';
import { getStudyVariables } from '@/lib/data/study-variables-api';
import { Plus, VariableIcon } from 'lucide-react';
import React from 'react';
import VariableListClient from './VariableListClient';
import VariableDefEditDialog from '@/app/(default)/tools/study-configurator/[studyKey]/variables/_components/VariableDefEditDialog';
import { Button } from '@/components/ui/button';

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
            className='w-full sm:w-1/2 sm:min-w-[400px]'
        >
            <CardHeader>
                <CardTitle>
                    Variables
                </CardTitle>
                <CardDescription>
                    Configure dynamic values to control the study flow.
                </CardDescription>
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


