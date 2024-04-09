import { SurveyContext } from '@/components/survey-editor/surveyContext';
import React, { useContext } from 'react';
import { SurveySingleItem } from 'survey-engine/data_types';
import EditorWrapper from './editor-wrapper';

interface SubtitleEditorProps {
    surveyItem: SurveySingleItem;
    onUpdateSurveyItem: (item: SurveySingleItem) => void;
}

const SubtitleEditor: React.FC<SubtitleEditorProps> = (props) => {
    const { selectedLanguage } = useContext(SurveyContext);


    return (
        <EditorWrapper>
            <p>
                simple / advanced editor
            </p>
            <p>simple: simple text</p>
            <p>advanced: sortable styled content items for expression, date, or formatted text (edit + remove), add new item</p>
        </EditorWrapper>
    );
};

export default SubtitleEditor;
