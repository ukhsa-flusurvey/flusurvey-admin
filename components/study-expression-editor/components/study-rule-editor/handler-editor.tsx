import ExpArgEditor from '@/components/expression-editor/exp-arg-editor';
import { studyEngineCategories, studyEngineRegistry } from '@/components/expression-editor/registries/studyEngineRegistry';
import { ExpArg, ExpressionArg } from '@/components/expression-editor/utils';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeftIcon } from 'lucide-react';
import React from 'react';


export interface HandlerSelection {
    type: 'entry' | 'merge' | 'leave' | 'survey-submission' | 'custom-event' | 'timer-event';
    index?: number;
    handlerKey?: string;
    actions?: Array<ExpressionArg | undefined>;
}

interface HandlerEditorProps {
    selection: HandlerSelection;
    onClose: () => void;
    onChange: (selection: HandlerSelection) => void;
}

const HandlerEditor: React.FC<HandlerEditorProps> = (props) => {
    console.log(props.selection)

    const currentActions = props.selection.actions;
    return (
        <div className='px-6 pt-2 pb-12 space-y-2 overflow-y-auto'>
            <Button
                variant={'ghost'}
                onClick={() => {
                    props.onClose();
                }}
            >
                <span><ArrowLeftIcon className='size-4' /></span>
                Exit handler editor
            </Button>

            <Card className='p-4 space-y-4'>
                <h3 className='font-bold text-sm flex justify-between gap-4'>
                    <span>
                        Edit
                        <span
                            className='uppercase font-bold text-sm mx-1 text-primary'
                        >
                            {props.selection.type}
                        </span>
                        handler
                        {props.selection.handlerKey !== undefined && <span className='font-bold text-sm mx-1 text-primary'>
                            {props.selection.handlerKey}
                        </span>}
                        {
                            props.selection.index !== undefined && <span className='font-bold text-sm mx-1 text-muted-foreground'>
                                (list position {props.selection.index + 1})
                            </span>
                        }
                    </span>
                </h3>
                <div className='bg-slate-100 rounded-md p-4'>
                    <ExpArgEditor
                        availableExpData={currentActions || []}
                        availableMetadata={{
                            slotTypes: currentActions ? currentActions.map(e => {
                                const exp = (e as ExpArg).exp;
                                return exp.name
                            }) : []
                        }}
                        expRegistry={{
                            builtInSlotTypes: [],
                            categories: studyEngineCategories,
                            expressionDefs: studyEngineRegistry,
                        }}
                        context={{
                            /*singleChoiceOptions: singleChoiceKeys,
                            multipleChoiceOptions: multipleChoiceKeys,
                            allItemKeys: allItemKeys,
                            dateUnitPicker: [
                                { key: 'years', label: 'Years' },
                                { key: 'months', label: 'Months' },
                                { key: 'days', label: 'Days' },
                                { key: 'hours', label: 'Hours' },
                                { key: 'minutes', label: 'Minutes' },
                                { key: 'seconds', label: 'Seconds' },
                            ],*/
                        }}
                        currentIndex={0}
                        slotDef={{
                            label: props.selection.type !== 'timer-event' ? 'Actions' : 'Action',
                            required: false,
                            isListSlot: props.selection.type !== 'timer-event' ? true : false,
                            allowedTypes: [
                                {
                                    id: 'exp-slot',
                                    type: 'expression',
                                    allowedExpressionTypes: ['action']
                                }
                            ],
                        }}
                        onChange={(newArgs,) => {
                            /* console.log('newArgs', newArgs)
                             const updatedSurveyItem = {
                                 ...props.surveyItem,
                             }
                             if (!newArgs || newArgs.length < 1 || newArgs[0] === undefined) {
                                 updatedSurveyItem.condition = undefined;
                             } else {
                                 updatedSurveyItem.condition = (newArgs[0] as ExpArg).exp as CaseExpression;
                             }
                             props.onUpdateSurveyItem(updatedSurveyItem);
                         */
                        }}
                    />

                </div>
            </Card>


        </div>

    );
};

export default HandlerEditor;
