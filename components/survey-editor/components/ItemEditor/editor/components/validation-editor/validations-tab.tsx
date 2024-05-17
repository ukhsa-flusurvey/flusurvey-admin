import AddDropdown from '@/components/survey-editor/components/general/add-dropdown';
import { getItemTypeInfos } from '@/components/survey-editor/utils/utils';
import { CheckCircle } from 'lucide-react';
import React from 'react';
import { SurveyItem, SurveySingleItem, Validation } from 'survey-engine/data_types';
import ValidationEditorItem from './validation-editor-item';

interface ValidationsTabProps {
    surveyItem: SurveyItem;
    onUpdateSurveyItem: (item: SurveyItem) => void;
}

const ValidationsTab: React.FC<ValidationsTabProps> = (props) => {

    const currentValidations = (props.surveyItem as SurveySingleItem).validations;

    const onAddValidation = (newValidationType: string) => {

        if (newValidationType === 'simpleRequired') {
            const typeInfos = getItemTypeInfos(props.surveyItem);

            // handle special question types where we need to generate validation per row / columns etc.
            if (typeInfos.key === 'responsiveSingleChoiceArray') {
                // TODO: handle this
                return;
            }
            // add simple has response validation
            const newValidation: Validation = {
                key: Math.random().toString(36).substring(9),
                type: 'hard',
                rule: {
                    name: 'hasResponse',
                    data: [
                        { str: props.surveyItem.key },
                        { str: 'rg' }
                    ]
                }
            }
            props.onUpdateSurveyItem({
                ...props.surveyItem,
                validations: [
                    ...(currentValidations || []),
                    newValidation
                ]
            });

        } else {
            console.log('Unknown validation type: ', newValidationType);
        }
    }

    return (
        <div className='px-4 py-2'>
            <h3 className='font-semibold text-base'>Edit validations</h3>
            <p className='text-sm text-neutral-600'>Manage the list of validations for this item.</p>

            <ul className='my-4 space-y-4'>
                {(!currentValidations || currentValidations.length === 0) && <p>
                    No validations defined.
                </p>}
                {currentValidations?.map(v => {
                    return <li key={v.key}>
                        <ValidationEditorItem
                            validation={v}
                            existingKeys={(currentValidations || []).map(listItem => listItem.key)}
                            onChange={(newValidation) => {
                                props.onUpdateSurveyItem({
                                    ...props.surveyItem,
                                    validations: (currentValidations || []).map(listItem => {
                                        if (v.key === listItem.key) {
                                            return newValidation;
                                        }
                                        return listItem;
                                    })
                                });
                            }}
                            onDelete={() => {
                                props.onUpdateSurveyItem({
                                    ...props.surveyItem,
                                    validations: currentValidations?.filter(v => v.key !== v.key)
                                });
                            }}
                        />
                    </li>
                })}
            </ul>
            <AddDropdown
                options={[
                    { key: 'simpleRequired', label: 'Simple has response validation', icon: <CheckCircle className='size-4 me-2' /> },
                ]}
                onAddItem={onAddValidation}
            />
        </div>
    );
};

export default ValidationsTab;
