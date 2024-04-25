import ExpArgEditor from '@/components/expression-editor/exp-arg-editor';
import { supportedBuiltInSlotTypes, surveyEngineCategories, surveyEngineRegistry } from '@/components/expression-editor/registries/surveyEngineRegistry';
import { SurveyContext } from '@/components/survey-editor/surveyContext';
import { localisedObjectToMap } from '@/components/survey-editor/utils/localeUtils';
import { getInputMaxWidth, getLabelPlacementStyle } from '@/components/survey-viewer/survey-renderer/SurveySingleItemView/utils';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { generateLocStrings } from 'case-editor-tools/surveys/utils/simple-generators';
import React, { useContext, useState } from 'react';
import { ExpressionArg, ItemComponent } from 'survey-engine/data_types';

interface NumberInputContentConfigProps {
    component: ItemComponent;
    onChange: (newComp: ItemComponent) => void;
}

const NumberInputContentConfig: React.FC<NumberInputContentConfigProps> = (props) => {
    const { selectedLanguage } = useContext(SurveyContext);

    const [currentExpArgSlot, setCurrentExpArgSlot] = useState<string | undefined>(undefined)

    const currentLabel = localisedObjectToMap(props.component.content).get(selectedLanguage) || '';
    const currentPlaceholder = localisedObjectToMap(props.component.description).get(selectedLanguage) || '';
    const inputMaxWidth = getInputMaxWidth(props.component.style);
    const placeAfter = getLabelPlacementStyle(props.component.style) === 'after';

    return (
        <div className='space-y-4'
            data-no-dnd={true}
        >
            <div className='space-y-1.5'>
                <Label
                    htmlFor={props.component.key + 'label'}
                >
                    Label
                </Label>
                <Input
                    id={props.component.key + 'label'}
                    value={currentLabel}
                    onChange={(e) => {
                        const updatedComponent = { ...props.component };
                        const updatedContent = localisedObjectToMap(updatedComponent.content);
                        updatedContent.set(selectedLanguage, e.target.value);
                        updatedComponent.content = generateLocStrings(updatedContent);
                        props.onChange(updatedComponent);
                    }}
                    placeholder='Enter label...'
                />
            </div>

            <div className='my-2'>
                <Label

                    htmlFor={props.component.key + 'placeAfter'}
                    className='flex items-center gap-2'
                >
                    <Switch
                        id={props.component.key + 'placeAfter'}
                        checked={placeAfter}
                        onCheckedChange={(checked) => {
                            const updatedComponent = { ...props.component };
                            const updatedStyle = [...updatedComponent.style || []];
                            if (checked) {
                                updatedStyle.push({ key: 'labelPlacement', value: 'after' });
                            } else {
                                const index = updatedStyle.findIndex(s => s.key === 'labelPlacement');
                                if (index > -1) {
                                    updatedStyle.splice(index, 1);
                                }
                            }
                            updatedComponent.style = updatedStyle;
                            props.onChange(updatedComponent);
                        }}
                    />
                    <span className=''>Place label after input</span>
                </Label>
            </div>

            <div className='space-y-1.5'>
                <Label
                    htmlFor={props.component.key + 'placeholder'}
                >
                    Placeholder text
                </Label>
                <Input
                    id={props.component.key + 'placeholder'}
                    value={currentPlaceholder}
                    onChange={(e) => {
                        const updatedComponent = { ...props.component };
                        const updatedContent = localisedObjectToMap(updatedComponent.description);
                        updatedContent.set(selectedLanguage, e.target.value);
                        updatedComponent.description = generateLocStrings(updatedContent);
                        props.onChange(updatedComponent);
                    }}
                    placeholder='Enter placeholder...'
                />
            </div>

            <div className='space-y-1.5'>
                <Label
                    htmlFor={props.component.key + 'inputMaxWidth'}
                >
                    Input width
                </Label>
                <div className='flex items-center gap-2'>
                    <span className={cn(
                        'font-semibold',
                        {
                            'text-neutral-400': inputMaxWidth !== undefined
                        })}>
                        auto
                    </span>

                    <Switch
                        checked={inputMaxWidth !== undefined}
                        onCheckedChange={(checked) => {
                            if (checked) {
                                const updatedComponent = { ...props.component };
                                const updatedStyle = [...updatedComponent.style || []];
                                const index = updatedStyle.findIndex(s => s.key === 'inputMaxWidth');
                                if (index > -1) {
                                    updatedStyle[index] = { key: 'inputMaxWidth', value: '100px' };
                                } else {
                                    updatedStyle.push({ key: 'inputMaxWidth', value: '100px' });
                                }
                                updatedComponent.style = updatedStyle;
                                props.onChange(updatedComponent);


                            } else {
                                const updatedComponent = { ...props.component };
                                const updatedStyle = [...updatedComponent.style || []];
                                const index = updatedStyle.findIndex(s => s.key === 'inputMaxWidth');
                                if (index > -1) {
                                    updatedStyle.splice(index, 1);
                                }
                                updatedComponent.style = updatedStyle;
                                props.onChange(updatedComponent);


                            }
                        }}
                    />
                    <Input
                        id={props.component.key + 'inputMaxWidth'}
                        value={inputMaxWidth || ''}
                        disabled={inputMaxWidth === undefined}
                        onChange={(e) => {
                            const updatedComponent = { ...props.component };
                            const updatedStyle = [...updatedComponent.style || []];
                            const index = updatedStyle.findIndex(s => s.key === 'inputMaxWidth');
                            if (index > -1) {
                                updatedStyle[index] = { key: 'inputMaxWidth', value: e.target.value };
                            } else {
                                updatedStyle.push({ key: 'inputMaxWidth', value: e.target.value });
                            }
                            updatedComponent.style = updatedStyle;

                            props.onChange(updatedComponent);
                        }}
                        placeholder='Define the max length...'
                    />
                </div>
            </div>

            <Separator />



            <ExpArgEditor
                availableExpData={[
                    props.component.properties?.min as ExpressionArg | undefined,
                ]}
                availableMetadata={{
                    slotTypes: currentExpArgSlot ? [currentExpArgSlot] : []
                }}
                expRegistry={{
                    expressionDefs: surveyEngineRegistry,
                    builtInSlotTypes: supportedBuiltInSlotTypes,
                    categories: surveyEngineCategories,
                }}
                currentIndex={0}
                slotDef={{
                    label: 'Min',
                    required: false,
                    allowedTypes: [
                        {
                            id: 'numeric-input',
                            type: 'num'
                        },
                        {
                            id: 'exp-slot',
                            type: 'expression',
                            allowedExpressionTypes: ['num']
                        }
                    ],

                }}
                onChange={(newArgs, slotTypes) => {
                    // console.log('newArgs', newArgs);
                    // console.log('slotTypes', slotTypes);
                    setCurrentExpArgSlot(slotTypes[0])
                    const updatedComponent = { ...props.component };
                    updatedComponent.properties = {
                        ...updatedComponent.properties,
                        min: newArgs[0]
                    }
                    props.onChange(updatedComponent);
                }}


            />
            <ExpArgEditor
                availableExpData={[]}
                expRegistry={{
                    builtInSlotTypes: [],
                    expressionDefs: [],
                    categories: [],
                }}
                currentIndex={0}
                slotDef={{
                    label: 'Max',
                    required: false,
                    allowedTypes: [],

                }}

            />
            <ExpArgEditor
                availableExpData={[]}
                expRegistry={{
                    builtInSlotTypes: [],
                    expressionDefs: [],
                    categories: [],
                }}
                currentIndex={0}
                slotDef={{
                    label: 'Step size',
                    required: false,
                    allowedTypes: [],

                }}

            />

        </div>
    );
};

export default NumberInputContentConfig;
