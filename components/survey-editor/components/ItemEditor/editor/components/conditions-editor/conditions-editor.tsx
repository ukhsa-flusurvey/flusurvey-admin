import ExpArgEditor from '@/components/expression-editor/exp-arg-editor';
import { ContextArrayItem, ExpArg, Expression, ExpressionDef, SlotInputDef } from '@/components/expression-editor/utils';
import { useSurveyEditorCtx } from '@/components/survey-editor/surveyEditorContext';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { InfoIcon } from 'lucide-react';
import React from 'react';
import { ItemComponent, ItemGroupComponent, Survey, SurveyItem, SurveySingleItem, isItemGroupComponent, isSurveyGroupItem } from 'survey-engine/data_types';
import { Expression as CaseExpression } from 'survey-engine/data_types';

interface ConditionsEditorProps {
    surveyItem: SurveyItem;
    onUpdateSurveyItem: (item: SurveyItem) => void;
}

export const surveyExpressionCategories = [
    {
        id: 'variables',
        label: 'Variables'
    },
    {
        id: 'logical',
        label: 'Logical operators'
    },
    {
        id: 'participant-flags',
        label: 'Participant flags'
    },
    {
        id: 'misc',
        label: 'Misc'
    }
]

const builtInSlotTypes: SlotInputDef[] = [
    {
        id: 'item-key-slot-key-options-single-choice',
        type: 'key-value-list',
        label: 'Single choice options',
        contextArrayKey: 'singleChoiceOptions',
        // filterForItemType: 'with-value',
        withFixedValue: 'rg.scg',
        icon: 'diamond',
        color: 'green',
        categories: ['variables'],
    },
    {
        id: 'item-key-slot-key-options-multiple-choice',
        type: 'key-value-list',
        label: 'Multiple choice options',
        contextArrayKey: 'multipleChoiceOptions',
        withFixedValue: 'rg.mcg',
        icon: 'square',
        color: 'green',
        categories: ['variables'],
    },
    {
        id: 'item-key-slot-key-options-generic',
        type: 'key-value-list',
        label: 'Generic item, slot and option keys',
        contextArrayKey: 'allItemKeys',
        icon: 'triangle',
        color: 'green',
        categories: ['variables'],
    },
]

const logicalOperators: ExpressionDef[] = [
    {
        categories: ['logical'],
        id: 'and',
        label: 'and',
        returnType: 'boolean',
        icon: 'brackets',
        slots: [
            {
                label: 'if all true:',
                required: true,
                isListSlot: true,
                allowedTypes: [
                    {
                        id: 'exp-slot',
                        type: 'expression',
                        allowedExpressionTypes: ['boolean']
                    }
                ]
            }
        ]
    },
    {
        categories: ['logical'],
        id: 'or',
        label: 'or',
        returnType: 'boolean',
        icon: 'braces',
        slots: [
            {
                label: 'if any true:',
                required: true,
                isListSlot: true,
                allowedTypes: [
                    {
                        id: 'exp-slot',
                        type: 'expression',
                        allowedExpressionTypes: ['boolean']
                    }
                ]
            }
        ]
    },
    {
        categories: ['logical'],
        id: 'not',
        label: 'not',
        returnType: 'boolean',
        icon: 'circle-slash',
        slots: [
            {
                label: 'if not true:',
                required: true,
                allowedTypes: [
                    {
                        id: 'exp-slot',
                        type: 'expression',
                        allowedExpressionTypes: ['boolean']
                    }
                ]
            }
        ]
    }

    // OR
    // NOT
]

const miscExpressions: ExpressionDef[] = [
    {
        categories: ['misc'],
        id: 'timestampWithOffset',
        label: 'GET TIMESTAMP',
        returnType: 'num',
        icon: 'calendar',
        slots: [
            {
                label: 'Offset',
                required: true,
                allowedTypes: [
                    {
                        id: 'time-delta-picker',
                        type: 'time-delta',
                    },
                    {
                        id: 'exp-slot',
                        type: 'expression',
                        allowedExpressionTypes: ['num'],
                        excludedExpressions: ['timestampWithOffset']
                    }
                ]
            },
            {
                label: 'Reference date',
                required: false,
                allowedTypes: [
                    {
                        id: 'date-picker',
                        type: 'date',
                    },
                    {
                        id: 'exp-slot',
                        type: 'expression',
                        allowedExpressionTypes: ['num']
                    }
                ]
            }
        ]
    }
]

const surveyEngineRegistry: ExpressionDef[] = [
    ...logicalOperators,
    ...miscExpressions,
    {
        categories: ['misc'],
        id: 'responseHasKeysAny',
        label: 'Response contains any of these keys:',
        returnType: 'boolean',
        icon: 'layout-list',
        slots: [
            {
                label: 'Item and option references:',
                required: true,
                allowedTypes: [
                    {
                        id: 'item-key-slot-key-options-generic',
                        type: 'key-value-list',
                    },
                    {
                        id: 'item-key-options-multiple-choice',
                        type: 'key-value-list',
                    },
                    {
                        id: 'item-key-options-single-choice',
                        type: 'key-value-list',
                    }
                ]
            },

        ]
    },
    {
        categories: ['participant-flags'],
        id: 'hasParticipantFlag',
        label: 'HAS FLAG WITH KEY AND VALUE',
        returnType: 'boolean',
        icon: 'tag',
        slots: [
            {
                label: 'Check for flag',
                required: true,
                allowedTypes: [
                    {
                        id: 'participant-flag-selector',
                        type: 'key-value',
                    },
                    {
                        id: 'key-value-manual',
                        type: 'key-value',
                    }
                ]
            },

        ]
    }
]

export function extractSurveyKeys(surveyData?: Survey): {
    singleChoiceKeys: ContextArrayItem[];
    multipleChoiceKeys: ContextArrayItem[];
    allItemKeys: ContextArrayItem[];
} {
    const singleChoiceKeys: ContextArrayItem[] = [];
    const multipleChoiceKeys: ContextArrayItem[] = [];
    const allItemKeys: ContextArrayItem[] = [];

    if (!surveyData) return {
        singleChoiceKeys,
        multipleChoiceKeys,
        allItemKeys
    };

    /**
     * Helper function to recursively process survey items
     * @param item - A survey item that might contain components or nested items
     */
    function processSurveyItem(item: SurveyItem): void {
        // Skip if no items property
        if (!isSurveyGroupItem(item)) return;

        // Process each item in the array
        item.items.forEach((subItem: SurveyItem) => {
            // Process sub-items if they exist
            if (isSurveyGroupItem(subItem)) {
                processSurveyItem(subItem);
            } else {
                // Add item key to allItemKeys if it exists
                if (subItem.key) {
                    allItemKeys.push({
                        key: subItem.key,
                        label: subItem.key,
                        // TODO: extract question type
                    });
                }
                // Check if this item has a key and contains components
                if (subItem.key && (subItem as SurveySingleItem).components) {
                    const itemKey = subItem.key;
                    processComponents(itemKey, subItem.components);
                }
            }
        });
    }

    /**
     * Helper function to process components
     * @param itemKey - The parent item key
     * @param components - The components object to process
     */
    function processComponents(itemKey: string, components: ItemGroupComponent | undefined): void {

        if (!components || !isItemGroupComponent(components)) return;

        components.items.forEach((component: ItemComponent) => {
            // Check if the component is a responseGroup
            if (component.role === 'responseGroup') {
                (component as ItemGroupComponent).items.forEach((responseItem: ItemComponent) => {
                    // Process single choice groups
                    if (responseItem.role === 'singleChoiceGroup' ||
                        responseItem.role === 'multipleChoiceGroup'
                    ) {
                        (responseItem as ItemGroupComponent).items.forEach((option: ItemComponent) => {
                            let type = 'without-value';
                            if (option.role === 'input' || option.role === 'dateInput' || option.role === 'timeInput' || option.role === 'numberInput') {
                                type = 'with-value';
                            }
                            // Only include options, not other components like dateInput
                            const v = `${itemKey}-${option.key}`;

                            if (responseItem.role === 'singleChoiceGroup') {
                                singleChoiceKeys.push({
                                    key: v,
                                    label: v,
                                    type: type
                                });
                            } else if (responseItem.role === 'multipleChoiceGroup') {
                                multipleChoiceKeys.push({
                                    key: v,
                                    label: v,
                                    type: type
                                });
                            }
                        });
                    }
                });
            }

        });
    }

    // Start processing from the survey definition
    if (surveyData.surveyDefinition && surveyData.surveyDefinition.items) {
        surveyData.surveyDefinition.items.forEach(processSurveyItem);
    }

    return {
        singleChoiceKeys,
        multipleChoiceKeys,
        allItemKeys: Array.from(allItemKeys)
    };
}

const ConditionsEditor: React.FC<ConditionsEditorProps> = (props) => {
    const { survey } = useSurveyEditorCtx(); // needed to extract survey items and their options


    const currentCondition = props.surveyItem.condition;
    const currentExpArgSlot = props.surveyItem.condition?.name;

    const { singleChoiceKeys, multipleChoiceKeys, allItemKeys } = extractSurveyKeys(survey);

    console.log('currentCondition', currentCondition)


    return (
        <div className='p-4 space-y-4' >

            <h3 className='font-semibold text-base flex items-center gap-2'>
                <span
                    className='grow'
                >
                    Condition to display this item
                </span>
            </h3>
            <Alert>
                <AlertDescription className='flex gap-2 items-center'>
                    <span>
                        <InfoIcon className='size-4 text-muted-foreground' />
                    </span>
                    <span>
                        {"If a condition is defined below, this item (and all of it's children for groups) will only be displayed (inlcuded in the questionnaire) if it evaluates to true."}
                    </span>
                </AlertDescription>
            </Alert>
            <ExpArgEditor
                availableExpData={currentCondition ?
                    [
                        { dtype: 'exp', exp: currentCondition as Expression }
                    ] : []}
                availableMetadata={{
                    slotTypes: currentExpArgSlot ? [currentExpArgSlot] : []
                }}
                expRegistry={{
                    expressionDefs: surveyEngineRegistry,
                    builtInSlotTypes: builtInSlotTypes,
                    categories: surveyExpressionCategories,
                }}
                context={{
                    singleChoiceOptions: singleChoiceKeys,
                    multipleChoiceOptions: multipleChoiceKeys,
                    allItemKeys: allItemKeys
                }}
                currentIndex={0}
                slotDef={{
                    label: 'Condition',
                    required: false,
                    allowedTypes: [
                        {
                            id: 'exp-slot',
                            type: 'expression',
                            allowedExpressionTypes: ['boolean']
                        }
                    ],

                }}
                onChange={(newArgs,) => {
                    //console.log('newArgs', newArgs)
                    //console.log('slotTypes', slotTypes)
                    const updatedSurveyItem = {
                        ...props.surveyItem,
                    }
                    if (!newArgs || newArgs.length < 1) {
                        updatedSurveyItem.condition = undefined;
                    } else {
                        updatedSurveyItem.condition = (newArgs[0] as ExpArg).exp as CaseExpression;
                    }
                    props.onUpdateSurveyItem(updatedSurveyItem);
                }}
            />

        </div>
    );
};

export default ConditionsEditor;
