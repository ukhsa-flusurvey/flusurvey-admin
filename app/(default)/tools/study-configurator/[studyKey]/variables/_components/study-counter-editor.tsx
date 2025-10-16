'use client'

import React from 'react'
import { useState, useTransition } from 'react'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Field, FieldContent, FieldLabel, FieldDescription, FieldError } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { saveStudyCounter } from '@/lib/data/study-counters'
import { toast } from 'sonner'
import { getErrorMessage } from '@/utils/getErrorMessage'
import LoadingButton from '@/components/loading-button'

interface StudyCounterEditorProps {
    studyKey: string
    scope?: string
    usedScopes?: string[]
    defaultValue: number
    trigger: React.ReactNode
}

const StudyCounterEditor: React.FC<StudyCounterEditorProps> = ({
    studyKey,
    scope,
    usedScopes = [],
    defaultValue,
    trigger,
}) => {
    const [open, setOpen] = useState(false)
    const [isPending, startTransition] = useTransition()
    const [value, setValue] = useState<string>(defaultValue.toString())
    const [newScope, setNewScope] = useState<string>('')
    const [scopeError, setScopeError] = useState<string>('')

    const isEditMode = scope !== undefined
    const activeScope = isEditMode ? scope : newScope

    const validateScope = (scope: string): string => {
        if (!scope.trim()) {
            return 'Scope is required'
        }
        if (usedScopes.includes(scope)) {
            return 'This scope is already in use'
        }
        return ''
    }

    const handleScopeChange = (newValue: string) => {
        setNewScope(newValue)
        if (newValue.trim()) {
            setScopeError(validateScope(newValue))
        } else {
            setScopeError('')
        }
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (!isEditMode) {
            const error = validateScope(activeScope)
            if (error) {
                setScopeError(error)
                return
            }
        }

        const numValue = parseInt(value, 10)
        if (isNaN(numValue)) {
            toast.error('Value must be a valid number')
            return
        }

        startTransition(async () => {
            try {
                const resp = await saveStudyCounter(
                    studyKey,
                    activeScope,
                    numValue,
                )

                if (resp.error) {
                    toast.error(resp.error)
                    return
                }

                toast.success(`Counter ${isEditMode ? 'updated' : 'created'} successfully`)
                setValue(defaultValue.toString())
                if (!isEditMode) {
                    setNewScope('')
                }
                setScopeError('')
                setOpen(false)
            } catch (error: unknown) {
                toast.error(`Failed to save counter: ${getErrorMessage(error)}`)
            }
        })
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                {trigger}
            </PopoverTrigger>
            <PopoverContent className="w-96 space-y-4" align="start">
                <div className="space-y-1">
                    <h4 className="font-medium text-sm">
                        {isEditMode ? `Edit Counter: ${scope}` : 'Create New Counter'}
                    </h4>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Scope Field - only shown in creation mode */}
                    {!isEditMode && (
                        <Field>
                            <FieldLabel>Scope</FieldLabel>
                            <FieldContent>
                                <Input
                                    placeholder="e.g., eligible_signups"
                                    value={newScope}
                                    onChange={(e) => handleScopeChange(e.target.value)}
                                    disabled={isPending}
                                    aria-invalid={!!scopeError}
                                />
                                <FieldDescription>
                                    A unique identifier for this counter
                                </FieldDescription>
                                {scopeError && (
                                    <FieldError>{scopeError}</FieldError>
                                )}
                            </FieldContent>
                        </Field>
                    )}

                    {/* Value Field */}
                    <Field>
                        <FieldLabel>Value</FieldLabel>
                        <FieldContent>
                            <Input
                                type="number"
                                placeholder="0"
                                value={value}
                                onChange={(e) => setValue(e.target.value)}
                                disabled={isPending}
                            />
                            <FieldDescription>
                                Set the initial or updated value for this counter
                            </FieldDescription>
                        </FieldContent>
                    </Field>

                    <div className='flex justify-end gap-2'>
                        {/* Save Button */}
                        <LoadingButton
                            className='flex-1'
                            type="submit"
                            isLoading={isPending}
                            disabled={!!scopeError && !isEditMode}
                        >
                            Save
                        </LoadingButton>

                        {/* Cancel Button */}
                        <Button
                            className='flex-1'
                            type="button"
                            variant="outline"
                            onClick={() => {
                                setOpen(false)
                                setValue(defaultValue.toString())
                                if (!isEditMode) {
                                    setNewScope('')
                                }
                                setScopeError('')
                            }}
                            disabled={isPending}
                        >
                            Cancel
                        </Button>
                    </div>
                </form>
            </PopoverContent>
        </Popover>
    )
}

export default StudyCounterEditor
