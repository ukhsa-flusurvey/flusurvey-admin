import { Switch } from '@nextui-org/react';
import { GenericQuestionProps } from 'case-editor-tools/surveys/types';
import React from 'react';

interface ItemValidationEditorProps {
    genericProps: GenericQuestionProps;
    onChange: (genericProps: GenericQuestionProps) => void;
}

const ItemValidationEditor: React.FC<ItemValidationEditorProps> = (props) => {
    return (
        <div>
            <Switch
                isSelected={props.genericProps.isRequired}
                onValueChange={(value) => {
                    props.onChange({
                        ...props.genericProps,
                        isRequired: value,
                    });
                }}
            >
                {'Use simple "has response" validation'}
            </Switch>

        </div>
    );
};

export default ItemValidationEditor;
