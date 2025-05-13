import ExpArgEditor from '@/components/expression-editor/exp-arg-editor';
import { supportedBuiltInSlotTypes, surveyEngineRegistry, surveyExpressionCategories } from '@/components/expression-editor/registries/surveyEngineRegistry';
import { ContextArrayItem, ExpArg, Expression } from '@/components/expression-editor/utils';
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
        processSurveyItem(surveyData.surveyDefinition)
        // surveyData.surveyDefinition.items.forEach(processSurveyItem);
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

    return (
        <div className='p-4 space-y-4 pb-24' >

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
                    builtInSlotTypes: supportedBuiltInSlotTypes,
                    categories: surveyExpressionCategories,
                }}
                context={{
                    singleChoiceOptions: singleChoiceKeys,
                    multipleChoiceOptions: multipleChoiceKeys,
                    allItemKeys: allItemKeys,
                    dateUnitPicker: [
                        { key: 'years', label: 'Years' },
                        { key: 'months', label: 'Months' },
                        { key: 'days', label: 'Days' },
                        { key: 'hours', label: 'Hours' },
                        { key: 'minutes', label: 'Minutes' },
                        { key: 'seconds', label: 'Seconds' },
                    ],
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
                    console.log('newArgs', newArgs)
                    const updatedSurveyItem = {
                        ...props.surveyItem,
                    }
                    if (!newArgs || newArgs.length < 1 || newArgs[0] === undefined) {
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
