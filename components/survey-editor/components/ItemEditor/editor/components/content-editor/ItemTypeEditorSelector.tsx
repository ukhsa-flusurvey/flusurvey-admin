import { getItemTypeInfos } from '@/components/survey-editor/utils/utils';
import React from 'react';
import { SurveyItem } from 'survey-engine/data_types';
import SurveyEndEditor from './SurveyEndEditor';

interface ItemTypeEditorSelectorProps {
    surveyItem: SurveyItem;
    onUpdateSurveyItem: (item: SurveyItem) => void;
}

const ItemTypeEditorSelector: React.FC<ItemTypeEditorSelectorProps> = (props) => {
    const typeInfos = getItemTypeInfos(props.surveyItem);


    if (typeInfos.key === 'surveyEnd') {
        return (
            <div className='py-4'>
                <SurveyEndEditor
                    surveyItem={props.surveyItem}
                    onUpdateSurveyItem={props.onUpdateSurveyItem}
                />
            </div>
        );
    } else if (typeInfos.key === 'display') {
        return (
            <div className='flex items-center justify-center grow'>
                <p className='text-gray-600'>
                    TODO: Display content editor
                </p>
            </div>
        );
    }

    return (
        <div>
            <div className='mx-auto'>
                <p>
                    TODO: get header components
                </p>
                <p>
                    top component
                </p>

                <p>
                    response - specific to question type - single choice, multiple choice, etc. - hint for custom
                </p>
                <p>
                    bottom component
                </p>
                <p>
                    footnote
                </p>
            </div>
        </div>
    );
};

export default ItemTypeEditorSelector;
