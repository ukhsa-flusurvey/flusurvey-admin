import SurveyLanguageToggle from '@/components/survey-editor/components/general/SurveyLanguageToggle';
import React from 'react';
import { SurveySingleItem } from 'survey-engine/data_types';
import EditorWrapper from '../editor-wrapper';
import { getItemTypeInfos } from '@/components/survey-editor/utils/utils';
import SingleChoice from './single-choice';
import MultipleChoice from './multiple-choice';
import Matrix from './matrix';
import ValidatedRandomQuestion from './validated-random-question';

interface ResponseGroupEditorProps {
    surveyItem: SurveySingleItem;
    onUpdateSurveyItem: (item: SurveySingleItem) => void;
}

const ResponseGroupEditor: React.FC<ResponseGroupEditorProps> = (props) => {

    let content: React.ReactNode = null;

    const typeInfos = getItemTypeInfos(props.surveyItem);

    switch (typeInfos.key) {
        case 'singleChoice':
            content = <SingleChoice surveyItem={props.surveyItem} onUpdateSurveyItem={props.onUpdateSurveyItem} />;
            break;
        case 'multipleChoice':
            content = <MultipleChoice surveyItem={props.surveyItem} onUpdateSurveyItem={props.onUpdateSurveyItem} />;
            break;
        case 'dateInput':
            break;
        case 'timeInput':
            break;
        case 'textInput':
            break;
        case 'multilineTextInput':
            break;
        case 'numericInput':
            break;
        case 'sliderNumeric':
            break;
        case 'responsiveSingleChoiceArray':
            break;
        case 'responsiveBipolarLikertScaleArray':
            break;
        case 'responsiveMatrix':
            break;
        case 'matrix':
            content = <Matrix surveyItem={props.surveyItem} onUpdateSurveyItem={props.onUpdateSurveyItem} />;
            break;
        case 'matrix':
            break;
        case 'clozeQuestion':
            break;
        case 'consent':
            break;
        case 'dropdown':
            break;
        case 'validatedRandomQuestion':
            content = <ValidatedRandomQuestion surveyItem={props.surveyItem} onUpdateSurveyItem={props.onUpdateSurveyItem} />;
            break;
        default:
            content = (
                <div>
                    <p>Unknown response group type: {typeInfos.key}</p>
                </div>
            );
            break;
    }

    /* case 'input':
            return 'textInput';
        case 'multilineTextInput':
            return 'multilineTextInput';
        case 'numberInput':
            return 'numericInput';
        case 'dropDownGroup':
            return 'dropdown';
        case 'singleChoiceGroup':
            return 'singleChoice';
        case 'multipleChoiceGroup':
            return 'multipleChoice';
        case 'responsiveSingleChoiceArray':
            return 'responsiveSingleChoiceArray';
        case 'responsiveSingleChoiceArray':
            return 'responsiveSingleChoiceArray';
        case 'responsiveBipolarLikertScaleArray':
            return 'responsiveBipolarLikertScaleArray';
        case 'responsiveMatrix':
            return 'responsiveMatrix';
        case 'matrix':
            return 'matrix';
        case 'sliderNumeric':
            return 'sliderNumeric';
        case 'dateInput':
            return 'dateInput';
        case 'timeInput':
            return 'timeInput';
        case 'cloze':
            return 'clozeQuestion';
        case 'consent':
            return 'consent';
            */

    return (
        <EditorWrapper>
            <div className='flex justify-end'>
                <SurveyLanguageToggle />
            </div>

            {content}

        </EditorWrapper>
    );
};

export default ResponseGroupEditor;
