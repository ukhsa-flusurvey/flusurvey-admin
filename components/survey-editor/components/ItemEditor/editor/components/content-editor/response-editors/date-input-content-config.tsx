import { localisedObjectToMap } from '@/components/survey-editor/utils/localeUtils';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { generateLocStrings } from 'case-editor-tools/surveys/utils/simple-generators';
import React from 'react';
import { ExpressionArg, ItemComponent } from 'survey-engine/data_types';
import ExpArgEditorForDate from './exp-arg-editor-for-date';
import { useSurveyEditorCtx } from '@/components/survey-editor/surveyEditorContext';

interface DateInputContentConfigProps {
    component: ItemComponent;
    onChange: (newComp: ItemComponent) => void;
}

const DateInputContentConfig: React.FC<DateInputContentConfigProps> = (props) => {
    const { selectedLanguage } = useSurveyEditorCtx();

    const currentLabel = localisedObjectToMap(props.component.content).get(selectedLanguage) || '';
    const currentPlaceholder = localisedObjectToMap(props.component.description).get(selectedLanguage) || '';
    const currentMode = props.component.properties?.dateInputMode as ExpressionArg || {
        str: 'YMD',
    };

    const currentMin = props.component.properties?.min as ExpressionArg | undefined;
    const currentMax = props.component.properties?.max as ExpressionArg | undefined;

    return (
        <div className='space-y-4'>
            <div>
                <Label
                    htmlFor={props.component.key + '-date-input-mode'}
                >
                    Date input mode
                </Label>
                <Select
                    value={currentMode.str}
                    onValueChange={(value) => {
                        const currentData = props.component.properties || {};
                        if (currentData.dateInputMode) {
                            (currentData.dateInputMode as ExpressionArg).str = value;
                        } else {
                            currentData.dateInputMode = {
                                str: value,
                            }
                        }
                        props.onChange({
                            ...props.component,
                            properties: {
                                ...currentData,
                            }
                        })
                    }}
                >
                    <SelectTrigger
                        id={props.component.key + '-date-input-mode'}
                        name='date-input-mode'
                    >
                        <SelectValue placeholder="Select a date input mode..." />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="YMD">YMD</SelectItem>
                        <SelectItem value="YM">YM</SelectItem>
                        <SelectItem value="Y">Y</SelectItem>
                    </SelectContent>
                </Select>
            </div>
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

            <div>
                <ExpArgEditorForDate
                    label='Min'
                    expArg={currentMin}
                    onChange={(argValue) => {
                        const currentData = props.component.properties || {};
                        currentData.min = argValue;
                        props.onChange({
                            ...props.component,
                            properties: {
                                ...currentData,
                            }
                        })

                    }}
                />
            </div>

            <div>
                <ExpArgEditorForDate
                    label='Max'
                    expArg={currentMax}
                    onChange={(argValue) => {
                        const currentData = props.component.properties || {};
                        currentData.max = argValue;
                        props.onChange({
                            ...props.component,
                            properties: {
                                ...currentData,
                            }
                        })
                    }}
                />
            </div>
        </div>


    );
};

export default DateInputContentConfig;
