'use client';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info, Play } from 'lucide-react';
import React from 'react';
import ActionExpressionPicker from '../../_components/action-expression-picker';
import { Expression } from 'survey-engine/data_types';
import LoadingButton from '@/components/LoadingButton';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { runStudyActionForAllParticipants, runStudyActionForParticipant } from '@/actions/study/runStudyActions';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface StartActionFormProps {
    studyKey: string;
}

const StartActionForm: React.FC<StartActionFormProps> = (props) => {
    const [isPending, startTransition] = React.useTransition();
    const [currentRules, setCurrentRules] = React.useState<Expression[] | undefined>(undefined);
    const [participantScope, setParticipantScope] = React.useState<'all' | 'single'>('all');
    const [participantID, setParticipantID] = React.useState<string | undefined>(undefined);
    const router = useRouter();

    const onStartActionForParticipant = () => {
        startTransition(async () => {
            try {
                const resp = await runStudyActionForParticipant(
                    props.studyKey,
                    currentRules || [],
                    participantID || ''
                );
                if (resp.error) {
                    toast.error(resp.error);
                    return;
                }
                toast.success('Action performed successfully');
            } catch (error) {
                toast.error('Failed to start action');
            }
        });
    }

    const onStateActionForAll = () => {
        startTransition(async () => {
            try {
                const resp = await runStudyActionForAllParticipants(
                    props.studyKey,
                    currentRules || [],
                );
                if (resp.error) {
                    toast.error(resp.error);
                    return;
                }
                toast.success('Action started successfully');
                router.push(`/tools/participants/${props.studyKey}/actions/general/${resp.task.id}`);
            } catch (error) {
                toast.error('Failed to start action');
            }
        });
    }

    return (
        <div className='p-4 space-y-4'>
            <h2 className='text-lg font-semibold mb-4'>Start action</h2>
            <Alert className="">
                <Info className="size-4" />
                <AlertDescription>
                    This action will be applied to the current state of the participant(s). Unless you select a specific participant, it will be applied to all participants in the study except for temporary and deleted users.

                </AlertDescription>
            </Alert>

            <ActionExpressionPicker
                onChange={(newRules) => {
                    setCurrentRules(newRules);
                }}
            />

            <div className=''>
                <Label className="block text-sm font-medium text-gray-700 mb-2">
                    Participant Scope
                </Label>
                <RadioGroup
                    name="participantScope"
                    value={participantScope}
                    onValueChange={(value: 'all' | 'single') => setParticipantScope(value)}
                    className="flex space-x-4"
                >
                    <Label htmlFor="all-participants" className="flex items-center space-x-2">
                        <RadioGroupItem value="all" id="all-participants" />
                        <span>
                            All Participants
                        </span>
                    </Label>

                    <Label htmlFor="single-participant" className="flex items-center space-x-2">
                        <RadioGroupItem value="single" id="single-participant" />
                        <span>
                            Single Participant
                        </span>
                    </Label>
                </RadioGroup>
            </div>

            {
                participantScope === 'single' && <div className='space-y-1.5 py-2'>
                    <Label className="block text-sm font-medium text-gray-700 mb-2"
                        htmlFor='participant-id'
                    >
                        Participant ID
                    </Label>

                    <Input
                        type="text"
                        id='participant-id'
                        name='participant-id'
                        placeholder="Enter participant ID..."
                        value={participantID}
                        onChange={(e) => {
                            setParticipantID(e.target.value);
                        }}
                    />
                    <p className="text-xs text-muted-foreground">
                        Enter the participant ID to apply the action to.
                    </p>
                </div>
            }

            <LoadingButton
                isLoading={isPending}
                variant={'default'}
                disabled={!currentRules || currentRules.length === 0 || (participantScope === 'single' && !participantID)}

                onClick={() => {
                    switch (participantScope) {
                        case 'all':
                            onStateActionForAll();
                            break;
                        case 'single':
                            onStartActionForParticipant();
                            break;
                    }
                }}
            >
                <span>
                    <Play className='size-4 me-2' />
                </span>

                Start action
            </LoadingButton>
        </div>
    );
};

export default StartActionForm;
