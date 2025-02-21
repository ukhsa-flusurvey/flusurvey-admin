'use client';
import { runStudyActionForParticipant } from '@/actions/study/runStudyActions';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { CircleAlertIcon, CircleCheck, Loader2 } from 'lucide-react';
import React, { useEffect } from 'react';
import { Expression } from 'survey-engine/data_types';

interface TaskRunnerProps {
    messageType: string;
    participantID: string;
    rules: Expression[];
    studyKey: string;
}

const TaskRunner: React.FC<TaskRunnerProps> = (props) => {
    const [isPending, startTransition] = React.useTransition();
    const [hasStarted, setHasStarted] = React.useState(false);
    const [error, setError] = React.useState<string | undefined>(undefined);

    useEffect(() => {
        if (hasStarted) {
            return;
        }

        startTransition(async () => {
            try {
                setHasStarted(true);
                const resp = await runStudyActionForParticipant(
                    props.studyKey,
                    props.rules,
                    props.participantID
                );
                if (resp.error) {
                    setError(resp.error);
                    return;
                }
            } catch (error: unknown) {
                setError((error as Error).message);
            }
        });
    }, [props.participantID, props.rules, props.studyKey, hasStarted])

    return (
        <div className='flex gap-4 w-full items-center'>
            <div className='flex flex-col grow'>
                <span>
                    {props.messageType}
                </span>
                <span className='text-xs font-mono'>
                    {props.participantID}
                </span>
            </div>



            <div>
                {isPending && <Loader2
                    className='animate-spin'
                />}
                {(!isPending && error) && <Tooltip
                >
                    <TooltipTrigger>
                        <span>
                            <CircleAlertIcon className='text-destructive size-5' />
                        </span>
                    </TooltipTrigger>
                    <TooltipContent>
                        {error}
                    </TooltipContent>
                </Tooltip>}
                {(!isPending && !error) && <span>
                    <CircleCheck className='text-green-600 size-5' />
                </span>
                }

            </div>

        </div>
    );
};

export default TaskRunner;
