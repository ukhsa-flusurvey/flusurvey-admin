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

interface AddCodeListEntriesProps {
    studyKey: string;
    listKeys: string[];
}

const AddCodeListEntries: React.FC<AddCodeListEntriesProps> = (props) => {
    const [isPending, startTransition] = useTransition();

    const [currentCodes, setCurrentCodes] = React.useState<string[]>([]);
    const [currentListKey, setCurrentListKey] = React.useState<string>('');
    const [isOpen, setIsOpen] = React.useState(false);
    const [respErrors, setRespErrors] = React.useState<string[]>([]);


    const addCodes = () => {
        setRespErrors([]);
        startTransition(async () => {

            try {
                const resp = await addStudyCodeListEntries(props.studyKey, currentListKey, currentCodes);
                if (resp.error) {
                    toast.error(resp.error);
                    return;
                }
                if (!resp.errors || resp.errors.length === 0) {
                    toast.success('Codes added');
                    setIsOpen(false);
                    return;
                }
                setRespErrors(resp.errors);

                toast.success('Request finished with errors');
            } catch (error: unknown) {
                toast.error('Failed to add codes', { description: getErrorMessage(error) });
            }
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
                <div className='w-full overflow-hidden'>
                    {isPending && <p className='text-sm text-neutral-500'>Adding codes...</p>}
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
                    >Add codes</LoadingButton>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default AddCodeListEntries;
