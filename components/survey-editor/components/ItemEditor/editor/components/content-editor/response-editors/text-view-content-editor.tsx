import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { generateLocStrings } from 'case-editor-tools/surveys/utils/simple-generators';
import React from 'react';
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
    return <div>
        Simple Mode: edit content and CSS classes
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
