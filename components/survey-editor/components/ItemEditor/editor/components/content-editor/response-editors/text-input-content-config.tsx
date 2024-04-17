import { SurveyContext } from '@/components/survey-editor/surveyContext';
import { localisedObjectToMap } from '@/components/survey-editor/utils/localeUtils';
import { getInputMaxWidth, getStyleValueByKey } from '@/components/survey-viewer/survey-renderer/SurveySingleItemView/utils';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { generateLocStrings } from 'case-editor-tools/surveys/utils/simple-generators';
import React, { useContext } from 'react';
import { ItemComponent } from 'survey-engine/data_types';

interface TextInputContentConfigProps {
    component: ItemComponent;
    onChange: (newComp: ItemComponent) => void;
}

const TextInputContentConfig: React.FC<TextInputContentConfigProps> = (props) => {
    const { selectedLanguage } = useContext(SurveyContext);

    const currentLabel = localisedObjectToMap(props.component.content).get(selectedLanguage) || '';
    const currentPlaceholder = localisedObjectToMap(props.component.description).get(selectedLanguage) || '';
    const inputMaxWidth = getInputMaxWidth(props.component.style);
    const maxLengthValue = getStyleValueByKey(props.component.style, 'maxLength');
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

            <div className='space-y-1.5'>
                <Label
                    htmlFor={props.component.key + 'placeholder'}
                >
                    Placeholder text
                </Label>
                <Input
                    id={props.component.key + 'laplaceholderbel'}
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
                    htmlFor={props.component.key + 'maxLen'}
                >
                    Max length (characters)
                </Label>
                <Input
                    id={props.component.key + 'maxLen'}
                    value={maxLengthValue || '4000'}
                    type='number'
                    onChange={(e) => {
                        const updatedComponent = { ...props.component };
                        const updatedStyle = [...updatedComponent.style || []];
                        const index = updatedStyle.findIndex(s => s.key === 'maxLength');
                        if (index > -1) {
                            updatedStyle[index] = { key: 'maxLength', value: e.target.value };
                        } else {
                            updatedStyle.push({ key: 'maxLength', value: e.target.value });
                        }
                        updatedComponent.style = updatedStyle;
                        props.onChange(updatedComponent);
                    }}
                    placeholder='Define the max length...'
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
                            'text-muted-foreground': inputMaxWidth !== undefined
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
        </div>
    );
};

export default TextInputContentConfig;
