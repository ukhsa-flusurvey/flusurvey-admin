import React from 'react';
import { SurveyItem } from 'survey-engine/data_types';

interface GroupItemsEditorProps {
    surveyItem: SurveyItem;
    onUpdateSurveyItem: (item: SurveyItem) => void;
}

const GroupItemsEditor: React.FC<GroupItemsEditorProps> = (props) => {
    return (
        <p>GroupItemsEditor</p>
    );
};

export default GroupItemsEditor;
