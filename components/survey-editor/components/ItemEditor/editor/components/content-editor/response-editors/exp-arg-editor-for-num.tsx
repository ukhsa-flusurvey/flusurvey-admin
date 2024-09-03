import ExpArgEditor from '@/components/expression-editor/exp-arg-editor';
import { supportedBuiltInSlotTypes, surveyEngineCategories, surveyEngineRegistry } from '@/components/expression-editor/registries/surveyEngineRegistry';
import { ExpressionArg } from '@/components/expression-editor/utils';
import React, { useEffect } from 'react';

interface ExpArgEditorForNumProps {
    label: string;
    expArg?: ExpressionArg;
    onChange: (newArgs: ExpressionArg | undefined) => void;
}

const ExpArgEditorForNum: React.FC<ExpArgEditorForNumProps> = (props) => {
    const [currentExpArgSlot, setCurrentExpArgSlot] = React.useState<string | undefined>(undefined)

    useEffect(() => {
        if (props.expArg) {
            if (props.expArg.exp !== undefined) {
                setCurrentExpArgSlot(props.expArg.exp.name);
            } else if (props.expArg.num !== undefined) {
                setCurrentExpArgSlot('number-input');
            }
        }
    }, [props.expArg])


    return (
        <ExpArgEditor
            availableExpData={[
                props.expArg
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
                label: props.label,
                required: false,
                allowedTypes: [
                    {
                        id: 'numeric-input',
                        type: 'num',
                    },
                    {
                        id: 'exp-slot',
                        type: 'expression',
                        allowedExpressionTypes: ['num']
                    }
                ],

            }}
            onChange={(newArgs, slotTypes) => {
                if (!newArgs || newArgs.length < 1) {
                    props.onChange(undefined);
                    return;
                }
                setCurrentExpArgSlot(slotTypes[0])
                props.onChange(newArgs[0]);
            }}
        />
    );
};

export default ExpArgEditorForNum;
