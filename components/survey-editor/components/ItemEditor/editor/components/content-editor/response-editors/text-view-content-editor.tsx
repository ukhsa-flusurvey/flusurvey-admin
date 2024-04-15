import { SurveyContext } from '@/components/survey-editor/surveyContext';
import { localisedObjectToMap } from '@/components/survey-editor/utils/localeUtils';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { generateLocStrings } from 'case-editor-tools/surveys/utils/simple-generators';
import React, { useContext } from 'react';
import { ItemComponent, ItemGroupComponent } from 'survey-engine/data_types';

interface TextViewContentEditorProps {
    component: ItemComponent;
    onChange: (newComp: ItemComponent) => void;
    hideToggle?: boolean;
    useAdvancedMode?: boolean;
}

const determineAdvancedMode = (component: ItemComponent) => {
    return (component as ItemGroupComponent).items !== undefined && (component as ItemGroupComponent).content === undefined;
}

const SimpleModeEditor: React.FC<{
    component: ItemComponent;
    onChange: (newComp: ItemComponent) => void;
}> = (props) => {
    const { selectedLanguage } = useContext(SurveyContext);


    const classNameIndex = props.component.style?.findIndex(style => style.key === 'className');
    const className = (props.component.style !== undefined && classNameIndex !== undefined && classNameIndex > -1) ? props.component.style[classNameIndex].value : '';

    const contentMap = localisedObjectToMap(props.component.content);

    return <div>
        <div className='space-y-1.5'>
            <Label
                htmlFor={props.component.key}
            >
                Title
            </Label>
            <Input
                id={props.component.key}
                value={contentMap.get(selectedLanguage) || ''}
                onChange={(e) => {
                    contentMap.set(selectedLanguage, e.target.value);
                    props.onChange({
                        ...props.component,
                        content: generateLocStrings(contentMap),
                    })
                }}
                placeholder='Enter content here for the selected language...'
            />
        </div>
        <div className='space-y-1.5 mt-4'>
            <Label
                htmlFor={props.component.key + 'className'}
            >
                CSS classes
            </Label>
            <Input
                id={props.component.key + 'className'}
                value={className}
                onChange={(e) => {
                    const newStyle = [...props.component.style || []];
                    const index = newStyle.findIndex(s => s.key === 'className');
                    if (index > -1) {
                        newStyle[index] = { key: 'className', value: e.target.value };
                    } else {
                        newStyle.push({ key: 'className', value: e.target.value });
                    }

                    props.onChange({
                        ...props.component,
                        style: newStyle,
                    })
                }}
                placeholder='Enter optional CSS classes...'
            />
        </div>

    </div>
}

const AdvancedMode: React.FC<{
    component: ItemComponent;
    onChange: (newComp: ItemComponent) => void;
}> = (props) => {
    return <div>
        Advanced Mode: sortable list of formatted text and dates
    </div>
}


const TextViewContentEditor: React.FC<TextViewContentEditorProps> = (props) => {
    const isAdvancedMode = determineAdvancedMode(props.component);


    const onToggleAdvanceMode = (checked: boolean) => {
        if (!confirm('Are you sure you want to switch the editor mode? You will loose the current content.')) {
            return
        }

        const newComp: ItemComponent = {
            ...props.component,
            content: undefined,
            items: undefined,
        };
        if (checked) {
            (newComp as ItemGroupComponent).items = [];
        } else {
            (newComp as ItemGroupComponent).content = [];
        }
        props.onChange(newComp);
    }

    return (
        <div className='space-y-4'>
            {!props.hideToggle && (
                <div className='flex justify-end'>
                    <Label
                        htmlFor={props.component.key + "advanced-mode-switch"}
                        className='flex items-center gap-2'
                    >
                        <Switch
                            id={props.component.key + "advanced-mode-switch"}
                            checked={isAdvancedMode}
                            onCheckedChange={onToggleAdvanceMode}
                        />
                        <span>
                            Use advanced mode
                        </span>
                    </Label>
                </div>)}

            {isAdvancedMode ? (
                <AdvancedMode
                    component={props.component}
                    onChange={props.onChange}
                />
            ) : (
                <SimpleModeEditor
                    component={props.component}
                    onChange={props.onChange}
                />
            )}
        </div>
    );
};

export default TextViewContentEditor;
