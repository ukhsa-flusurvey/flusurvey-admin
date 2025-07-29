import React from 'react';
import { useStudyExpressionEditor } from '../../study-expression-editor-context';
import { ContextObjectItem, ExpArg, ExpressionArg } from '@/components/expression-editor/utils';
import ExpArgEditor from '@/components/expression-editor/exp-arg-editor';
import { categoryForMergeStateCheckers, mergeParticipantStateCheckers, studyEngineCategories, studyEngineRegistry, supportedBuiltInSlotTypes } from '@/components/expression-editor/registries/studyEngineRegistry';

interface ExpEditorWrapperProps {
    label: string;
    value: Array<ExpressionArg | undefined>;
    isListSlot: boolean;
    useMergeStateCheckers: boolean;
    onChange: (newValue: Array<ExpressionArg | undefined>) => void;
}

const ExpEditorWrapper: React.FC<ExpEditorWrapperProps> = (props) => {
    const {
        currentStudyContext
    } = useStudyExpressionEditor();

    const pFlagsFromCtx: ContextObjectItem = {}
    currentStudyContext?.participantFlags?.forEach(f => {
        pFlagsFromCtx[f.key] = {
            values: f.possibleValues,
            type: 'string'
        }
    })
    const pFlagKeys = Object.keys(pFlagsFromCtx).map(k => {
        return {
            key: k,
            label: k,
            type: 'string'
        }
    })

    const surveyKeys = currentStudyContext?.surveyKeys?.map(k => {
        return {
            key: k,
            label: k,
            type: 'string'
        }
    })

    const linkingCodeKeys = currentStudyContext?.linkingCodeKeys?.map(k => {
        return {
            key: k,
            label: k,
            type: 'string'
        }
    })

    const externalEventHandlers: ContextObjectItem = {}
    currentStudyContext?.externalEventHandlers?.forEach(h => {
        externalEventHandlers[h.key] = {
            values: h.possibleValues,
            type: 'string'
        }
    })

    const reportKeysWithAttributes: ContextObjectItem = {}
    currentStudyContext?.reportKeys?.forEach(h => {
        reportKeysWithAttributes[h.key] = {
            values: h.possibleValues,
            type: 'string'
        }
    })

    const reportKeys = Object.keys(reportKeysWithAttributes).map(k => {
        return {
            key: k,
            label: k,
            type: 'string'
        }
    })

    const customEventKeys = currentStudyContext?.customEventKeys?.map(k => {
        return {
            key: k,
            label: k,
            type: 'string'
        }
    });

    const monthValues = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(m => {
        return {
            key: m,
            label: m
        }
    });


    return (
        <div className='bg-slate-100 rounded-md p-4'>
            <ExpArgEditor
                availableExpData={props.value}
                availableMetadata={{
                    slotTypes: props.value ? props.value.map(e => {
                        const exp = (e as ExpArg).exp;
                        return exp.name
                    }) : []
                }}
                expRegistry={{
                    builtInSlotTypes: supportedBuiltInSlotTypes,
                    categories: props.useMergeStateCheckers ? [...studyEngineCategories, categoryForMergeStateCheckers] : studyEngineCategories,
                    expressionDefs: props.useMergeStateCheckers ? [...studyEngineRegistry, ...mergeParticipantStateCheckers] : studyEngineRegistry,
                }}
                context={{
                    studyStatusValues: [
                        {
                            key: 'active',
                            label: 'active'
                        },
                        {
                            key: 'inactive',
                            label: 'inactive'
                        },
                        {
                            key: 'finished',
                            label: 'finished'
                        },
                        {
                            key: 'exited',
                            label: 'exited'
                        },
                    ],
                    messageTypes: currentStudyContext?.messageKeys?.map(k => {
                        return {
                            key: k,
                            label: k
                        }
                    }) ?? [],
                    participantFlags: pFlagsFromCtx,
                    participantFlagKeys: pFlagKeys,
                    surveyKeys: surveyKeys ?? [],
                    linkingCodeKeys: linkingCodeKeys ?? [],
                    externalEventHandlers: externalEventHandlers,
                    reportKeys: reportKeys ?? [],
                    reportKeysWithAttributes: reportKeysWithAttributes,
                    customEventKeys: customEventKeys ?? [],
                    monthValues: monthValues ?? [],
                }}
                currentIndex={0}
                slotDef={{
                    label: props.label,
                    required: false,
                    isListSlot: props.isListSlot,
                    allowedTypes: [
                        {
                            id: 'exp-slot',
                            type: 'expression',
                            allowedExpressionTypes: ['action']
                        }
                    ],
                }}
                onChange={(newArgs,) => {
                    props.onChange(newArgs);
                }}
            />

        </div>
    );
};

export default ExpEditorWrapper;
