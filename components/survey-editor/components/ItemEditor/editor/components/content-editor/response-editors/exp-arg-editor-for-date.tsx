import ExpArgEditor from '@/components/expression-editor/exp-arg-editor';
import { supportedBuiltInSlotTypes, surveyExpressionCategories, surveyEngineRegistry } from '@/components/expression-editor/registries/surveyEngineRegistry';
import { ExpressionArg } from '@/components/expression-editor/utils';
import React, { useEffect } from 'react';
import { useSurveyEditorCtx } from '@/components/survey-editor/surveyEditorContext';
import { extractSurveyKeys } from '../../survey-expression-editor';

interface ExpArgEditorForDateProps {
    label: string;
    expArg?: ExpressionArg;
    onChange: (newArgs: ExpressionArg | undefined) => void;
}

const ExpArgEditorForDate: React.FC<ExpArgEditorForDateProps> = (props) => {
    const [currentExpArgSlot, setCurrentExpArgSlot] = React.useState<string | undefined>(undefined)
    const { survey } = useSurveyEditorCtx();
    const { singleChoiceKeys, multipleChoiceKeys, allItemKeys } = extractSurveyKeys(survey);

    useEffect(() => {
        if (props.expArg) {

            if (props.expArg.dtype === 'exp') {
                setCurrentExpArgSlot(props.expArg.exp.name);
            } else if (props.expArg.dtype === 'num') {
                setCurrentExpArgSlot('date-picker');
            }
        }
    }, [props.expArg])


    return (
        <ExpArgEditor
            availableExpData={[
                props.expArg
            ]}
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
                if (!slotTypes || slotTypes.length < 1) {
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
