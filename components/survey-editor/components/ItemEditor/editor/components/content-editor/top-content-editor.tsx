import React from 'react';
import EditorWrapper from './editor-wrapper';
import { SurveySingleItem } from 'survey-engine/data_types';

interface TopContentEditorProps {
    surveyItem: SurveySingleItem;
    onUpdateSurveyItem: (item: SurveySingleItem) => void;
}

const TopContentEditor: React.FC<TopContentEditorProps> = (props) => {
    return (
        <EditorWrapper>
            <p>language switcher (only if some content is added)</p>
            <p>sortable list of components: each item - edit key, edit content (depending on role), edit display condition, remove</p>
            <p>add new component: types: text / markdown / error / warning</p>
        </EditorWrapper>
    );
};

export default TopContentEditor;
