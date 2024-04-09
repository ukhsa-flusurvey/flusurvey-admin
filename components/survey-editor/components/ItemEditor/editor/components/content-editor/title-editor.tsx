import React from 'react';
import EditorWrapper from './editor-wrapper';
import { SurveySingleItem } from 'survey-engine/data_types';

interface TitleEditorProps {
    surveyItem: SurveySingleItem;
    onUpdateSurveyItem: (item: SurveySingleItem) => void;
}

const TitleEditor: React.FC<TitleEditorProps> = (props) => {
    return (
        <EditorWrapper>
            <p>
                simple / advanced editor
            </p>
            <p>simple: sticky header, simple text</p>
            <p>advanced: global header class name input, sortable styled content items for expression, date, or formatted text (edit + remove), add new item</p>
        </EditorWrapper>
    );
};

export default TitleEditor;
