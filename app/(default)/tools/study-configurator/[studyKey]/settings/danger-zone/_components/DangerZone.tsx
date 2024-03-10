'use client';

import React, { useTransition } from 'react';
import { deleteStudyAction } from '../../../../../../../../actions/study/delete';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import LoadingButton from '@/components/LoadingButton';


interface DangerZoneProps {
    studyKey: string;
}

const StudyDeletionDialog = ({ studyKey }: { studyKey: string }) => {
    const [confirmStudyKey, setConfirmStudyKey] = React.useState<string>('');
    const [isPending, startTransition] = useTransition();
    const router = useRouter();
    const [error, setError] = React.useState<string>('');

    const deleteStudy = () => {
        startTransition(async () => {
            setError('');
            try {
                await deleteStudyAction(studyKey);
                router.refresh();
                router.replace('/tools/study-configurator');
            } catch (error: any) {
                setError(`failed to delete study: ${error.message}`);
                console.error(error);
            }
        })
    }


    return (
        <Dialog
            onOpenChange={() => {
                setConfirmStudyKey('');
            }}
        >
            <DialogTrigger
                asChild
            >
                <Button
                    variant='destructive'
                >
                    Delete study
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Delete study
                    </DialogTitle>
                    <DialogDescription>
                        {`Enter study key "${studyKey}" to confirm deletion`}
                    </DialogDescription>
                </DialogHeader>
                <div>
                    <Label
                        htmlFor='confirm-study-key'
                    >
                        Study key
                    </Label>
                    <Input
                        className='mt-1.5'
                        id='confirm-study-key'
                        placeholder='confirm with study key...'
                        autoComplete='off'
                        value={confirmStudyKey}
                        onChange={(e) => setConfirmStudyKey(e.target.value)}
                    />
                </div>
                {error && (
                    <p className='text-red-700 font-bold text-sm'>{error}</p>
                )}
                <DialogFooter>
                    <LoadingButton
                        variant='destructive'
                        onClick={deleteStudy}
                        disabled={confirmStudyKey !== studyKey}
                        isLoading={isPending}
                    >
                        Delete study
                    </LoadingButton>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}


const DangerZone: React.FC<DangerZoneProps> = (props) => {
    return (
        <Card
            variant='opaque'
        >
            <CardHeader>
                <CardTitle
                    className='text-xl'
                >
                    Danger zone
                </CardTitle>
                <CardDescription>
                    Actions that can permanently results in data loss.
                </CardDescription>
            </CardHeader>
            <CardContent className='space-y-3'>
                <Separator />
                <div>
                    <h4 className='font-bold'>
                        Delete study
                    </h4>
                    <p className='text-sm text-slate-500'>
                        If the study is not needed anymore, you can delete it.
                    </p>
                    <p className='bg-yellow-50 p-3 rounded-lg flex gap-3 items-center text-yellow-800 border border-yellow-500 my-3'>
                        <span>
                            <AlertTriangle className='text-yellow-500 size-6' />
                        </span>
                        {"This is an irreversible action. You won't be able to access the study anymore."}
                    </p>
                </div>
                <StudyDeletionDialog
                    studyKey={props.studyKey}
                />
            </CardContent>
        </Card>
    );
};

export default DangerZone;
