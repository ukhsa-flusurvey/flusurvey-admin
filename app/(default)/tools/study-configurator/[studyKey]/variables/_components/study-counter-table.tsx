'use client'

import React, { useState, useTransition } from 'react'
import { StudyCounter } from '@/utils/server/types/study-counters'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Pen, Trash2 } from 'lucide-react'
import StudyCounterEditor from './study-counter-editor'
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { deleteStudyCounter } from '@/lib/data/study-counters'
import { toast } from 'sonner'
import { getErrorMessage } from '@/utils/getErrorMessage'
import LoadingButton from '@/components/loading-button'

interface StudyCounterTableProps {
    studyKey: string
    counters: StudyCounter[]
    usedScopes: string[]
}

const StudyCounterTable: React.FC<StudyCounterTableProps> = ({
    studyKey,
    counters,
    usedScopes,
}) => {
    const [isPending, startTransition] = useTransition()
    const [deletingScope, setDeletingScope] = useState<string | null>(null)

    const handleDelete = (scope: string) => {
        startTransition(async () => {
            try {
                const resp = await deleteStudyCounter(studyKey, scope)
                if (resp.error) {
                    toast.error(resp.error)
                    return
                }
                toast.success(`Counter "${scope}" deleted successfully`)
                setDeletingScope(null)
            } catch (error: unknown) {
                toast.error(`Failed to delete counter: ${getErrorMessage(error)}`)
            }
        })
    }

    return (
        <Table className='table-fixed'>
            <TableHeader>
                <TableRow>
                    <TableHead>Scope</TableHead>
                    <TableHead className='text-end pe-12'>Value</TableHead>
                    <TableHead className='w-16'></TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {counters.map((counter) => (
                    <TableRow key={counter.scope}>
                        <TableCell className='font-medium px-4 py-1'>{counter.scope}</TableCell>
                        <TableCell className='px-4 py-1'>
                            <div className='flex items-center gap-2 justify-end'>
                                <span className='font-mono text-sm'>{counter.value}</span>
                                <StudyCounterEditor
                                    key={counter.scope + counter.value.toString()}
                                    studyKey={studyKey}
                                    scope={counter.scope}
                                    usedScopes={usedScopes}
                                    defaultValue={counter.value}
                                    trigger={
                                        <Button
                                            variant='ghost'
                                            size='sm'
                                            className='h-6 w-6 p-0'
                                            title='Edit counter value'
                                        >
                                            <Pen className='size-3.5' />
                                        </Button>
                                    }
                                />
                            </div>
                        </TableCell>
                        <TableCell className='px-4 py-1 w-16'>
                            <div className='flex items-center justify-end gap-2'>

                                {/* Delete Button with Alert Dialog */}
                                <AlertDialog open={deletingScope === counter.scope} onOpenChange={(open) => {
                                    if (!open) setDeletingScope(null)
                                }}>
                                    <AlertDialogTrigger asChild>
                                        <Button
                                            variant='ghost'
                                            size='sm'
                                            className='h-8 px-2.5'
                                            onClick={() => setDeletingScope(counter.scope)}
                                            disabled={isPending}
                                            title='Delete counter'
                                        >
                                            <Trash2 className='size-3.5' />
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Delete Counter</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This will remove the counter <code className='bg-muted px-1.5 py-0.5 rounded text-xs'>{counter.scope}</code> and its current value ({counter.value}). If study rules increment this counter, it will start from 0 again.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel disabled={isPending}>
                                                Cancel
                                            </AlertDialogCancel>
                                            <LoadingButton
                                                onClick={() => handleDelete(counter.scope)}
                                                isLoading={isPending}
                                                variant='destructive'
                                            >
                                                Delete
                                            </LoadingButton>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}

export default StudyCounterTable
