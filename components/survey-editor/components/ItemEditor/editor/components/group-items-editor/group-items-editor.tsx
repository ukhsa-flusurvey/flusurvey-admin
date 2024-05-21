import React from 'react';
import { SurveyItem } from 'survey-engine/data_types';
import ItemSelectionMethodEditor from './item-selection-method-editor';

interface GroupItemsEditorProps {
    surveyItem: SurveyItem;
    onUpdateSurveyItem: (item: SurveyItem) => void;
}

const GroupItemsEditor: React.FC<GroupItemsEditorProps> = (props) => {
    return (
        <div className='px-4 py-2'>
            <div className='flex gap-4'>
                <div className='flex-1'>
                    <h3 className='font-semibold text-base'>Items</h3>
                    <p className='text-sm text-neutral-600'>Double click on item to open it, drag and drop to reorder.</p>
                </div>

                <ItemSelectionMethodEditor
                    surveyItem={props.surveyItem}
                    onUpdateSurveyItem={props.onUpdateSurveyItem}
                />
            </div>
        </div>
    );
};

export default GroupItemsEditor;
