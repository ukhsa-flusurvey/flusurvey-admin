'use client'

import LoadingButton from '@/components/loading-button';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { PlusIcon } from 'lucide-react';
import React, { useTransition } from 'react';
import ListkeySelector from './listkey-selector';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { addStudyCodeListEntries } from '@/actions/study/studyCodeListEntries';
import { toast } from 'sonner';
import getErrorMessage from '@/utils/getErrorMessage';
import { Progress } from '@/components/ui/progress';

interface AddCodeListEntriesProps {
    studyKey: string;
    listKeys: string[];
}

const BATCH_SIZE = 100;

const AddCodeListEntries: React.FC<AddCodeListEntriesProps> = (props) => {
    const [isPending, startTransition] = useTransition();

    const [currentCodes, setCurrentCodes] = React.useState<string[]>([]);
    const [currentListKey, setCurrentListKey] = React.useState<string>('');
    const [isOpen, setIsOpen] = React.useState(false);
    const [respErrors, setRespErrors] = React.useState<string[]>([]);
    const [uploadProgress, setUploadProgress] = React.useState<number>(0);
    const [completedBatches, setCompletedBatches] = React.useState<number>(0);
    const [totalBatches, setTotalBatches] = React.useState<number>(0);


    const addCodes = () => {
        setRespErrors([]);
        startTransition(async () => {

            const chunks: string[][] = [];
            for (let i = 0; i < currentCodes.length; i += BATCH_SIZE) {
                chunks.push(currentCodes.slice(i, i + BATCH_SIZE));
            }

            setTotalBatches(chunks.length);
            setCompletedBatches(0);
            setUploadProgress(0);

            const aggregatedErrors: string[] = [];

            for (let i = 0; i < chunks.length; i++) {
                try {
                    const resp = await addStudyCodeListEntries(props.studyKey, currentListKey, chunks[i]);
                    if (resp.error) {
                        aggregatedErrors.push(`Batch ${i + 1}: ${resp.error}`);
                    } else if (resp.errors && resp.errors.length > 0) {
                        aggregatedErrors.push(...resp.errors.map((e: string) => `Batch ${i + 1}: ${e}`));
                    }
                } catch (error: unknown) {
                    aggregatedErrors.push(`Batch ${i + 1}: ${getErrorMessage(error)}`);
                }

                const completed = i + 1;
                setCompletedBatches(completed);
                setUploadProgress(Math.round((completed / chunks.length) * 100));
            }

            if (aggregatedErrors.length === 0) {
                toast.success('Codes added');
                setIsOpen(false);
            } else {
                setRespErrors(aggregatedErrors);
                toast.success('Request finished with errors');
            }

            // Reset progress state after finishing
            setTimeout(() => {
                setUploadProgress(0);
                setCompletedBatches(0);
                setTotalBatches(0);
            }, 300);
        });
    }

    return (
        <Dialog
            open={isOpen}
            onOpenChange={setIsOpen}
        >
            <DialogTrigger asChild>
                <Button variant="outline" size='icon'>
                    <PlusIcon />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Add Code List Entries
                    </DialogTitle>
                    <DialogDescription>
                        Add codes to an existing or new code list.
                    </DialogDescription>
                </DialogHeader>
                <Separator />
                <div className="flex flex-col gap-6">
                    <Label
                        className='flex flex-col gap-1.5'
                    >
                        Add codes for list:
                        <ListkeySelector
                            value={currentListKey}
                            onChange={setCurrentListKey}
                            options={props.listKeys}
                            placeholder='List key to set the codes for'
                        />
                    </Label>

                    <Label
                        className='flex flex-col gap-1.5'
                    >
                        Codes (one per line):
                        <Textarea
                            defaultValue={currentCodes.join('\n')}
                            onChange={(e) => {
                                setCurrentCodes(e.target.value.split('\n').filter(c => c.trim() !== ''));
                            }}
                            placeholder='Codes to add'
                            className='w-full'
                            rows={10}
                        />
                    </Label>
                </div>
                <p className='text-xs text-muted-foreground'>
                    {currentCodes.length} codes entered.
                    {currentCodes.length > BATCH_SIZE && (
                        <span className='text-xs text-muted-foreground ms-1'>
                            The upload will happen in batches of {BATCH_SIZE} codes.
                        </span>)}
                </p>
                <div className='w-full overflow-hidden'>
                    {isPending && (
                        <div className='flex flex-col gap-2'>
                            <p className='text-sm text-neutral-500'>
                                Adding codes...
                                {totalBatches > 1 && (
                                    <span className='ms-2'>Batch {completedBatches} of {totalBatches}</span>
                                )}
                            </p>
                            <Progress value={uploadProgress} />
                        </div>
                    )}
                    {respErrors.length > 0 && <ul className='overflow-auto max-h-64 w-full p-2 bg-red-50 rounded-sm'>
                        {respErrors.map((error, index) => (
                            <li key={index}
                                className='font-mono text-xs text-'
                            ><pre>{error}</pre></li>
                        ))}
                    </ul>}
                </div>
                <DialogFooter>
                    <Button variant="outline"
                        onClick={() => {
                            setCurrentCodes([]);
                            setCurrentListKey('');
                            setRespErrors([]);
                            setIsOpen(false)
                        }}
                    >Cancel</Button>
                    <LoadingButton isLoading={isPending}
                        disabled={currentCodes.length === 0 || currentListKey === ''}
                        onClick={addCodes}
                    >
                        Upload codes
                    </LoadingButton>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default AddCodeListEntries;
