import ExpArgEditor from '@/components/expression-editor/exp-arg-editor';
import { supportedBuiltInSlotTypes, surveyEngineCategories, surveyEngineRegistry } from '@/components/expression-editor/registries/surveyEngineRegistry';
import { ExpressionArg } from '@/components/expression-editor/utils';
import React, { useEffect } from 'react';

interface ExpArgEditorForDateProps {
    label: string;
    expArg?: ExpressionArg;
    onChange: (newArgs: ExpressionArg | undefined) => void;
}

const ExpArgEditorForDate: React.FC<ExpArgEditorForDateProps> = (props) => {
    const [currentExpArgSlot, setCurrentExpArgSlot] = React.useState<string | undefined>(undefined)

    useEffect(() => {
        if (props.expArg) {
            if (props.expArg.exp !== undefined) {
                setCurrentExpArgSlot(props.expArg.exp.name);
            } else if (props.expArg.num !== undefined) {
                setCurrentExpArgSlot('date-picker');
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
                        id: 'date-picker',
                        type: 'date',
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

export default ExpArgEditorForDate;
