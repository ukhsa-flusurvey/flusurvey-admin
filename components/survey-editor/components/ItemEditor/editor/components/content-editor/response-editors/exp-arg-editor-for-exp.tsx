import ExpArgEditor from '@/components/expression-editor/exp-arg-editor';
import { supportedBuiltInSlotTypes, surveyExpressionCategories, surveyEngineRegistry } from '@/components/expression-editor/registries/surveyEngineRegistry';
import { ExpArg, ExpressionArg } from '@/components/expression-editor/utils';
import React, { useEffect } from 'react';
import { useSurveyEditorCtx } from '@/components/survey-editor/surveyEditorContext';
import { extractSurveyKeys } from '../../survey-expression-editor';

interface ExpArgEditorForExpProps {
    label: string;
    expArg?: ExpressionArg;
    required?: boolean;
    onChange: (newArgs: ExpArg | undefined) => void;
}

const ExpArgEditorForExp: React.FC<ExpArgEditorForExpProps> = (props) => {
    const [currentExpArgSlot, setCurrentExpArgSlot] = React.useState<string | undefined>(undefined)
    const { survey } = useSurveyEditorCtx();
    const { singleChoiceKeys, multipleChoiceKeys, allItemKeys } = extractSurveyKeys(survey);

    useEffect(() => {
        if (props.expArg) {
            if (props.expArg.dtype === 'exp') {
                setCurrentExpArgSlot(props.expArg.exp?.name);
            }
        }
    }, [props.expArg])


    return (
        <ExpArgEditor
            availableExpData={props.expArg ? [
                props.expArg
            ] : []}
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
            availableMetadata={{
                slotTypes: currentExpArgSlot ? [currentExpArgSlot] : []
            }}
            expRegistry={{
                expressionDefs: surveyEngineRegistry,
                builtInSlotTypes: supportedBuiltInSlotTypes,
                categories: surveyExpressionCategories,
            }}
            currentIndex={0}
            slotDef={{
                label: props.label,
                required: props.required ?? false,
                allowedTypes: [
                    {
                        id: 'exp-slot',
                        type: 'expression',
                        allowedExpressionTypes: ['boolean']
                    }
                ],

            }}
            onChange={(newArgs, slotTypes) => {
                if (!newArgs || newArgs.length < 1) {
                    props.onChange(undefined);
                    return;
                }
                setCurrentExpArgSlot(slotTypes?.[0])
                props.onChange(newArgs[0] as ExpArg);
            }}
        />
    );
};

export default ExpArgEditorForExp;
