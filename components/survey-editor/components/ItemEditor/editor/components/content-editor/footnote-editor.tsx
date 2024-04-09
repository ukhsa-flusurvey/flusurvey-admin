import React, { useContext } from 'react';
import EditorWrapper from './editor-wrapper';
import SurveyLanguageToggle from '@/components/survey-editor/components/general/SurveyLanguageToggle';
import { SurveyContext } from '@/components/survey-editor/surveyContext';
import { SurveySingleItem } from 'survey-engine/data_types';

interface FootnoteEditorProps {
    surveyItem: SurveySingleItem;
    onUpdateSurveyItem: (item: SurveySingleItem) => void;
}

const FootnoteEditor: React.FC<FootnoteEditorProps> = (props) => {
    const { selectedLanguage } = useContext(SurveyContext);

    return (
        <EditorWrapper>


            <SurveyLanguageToggle />
        </EditorWrapper>
    );
};

export default FootnoteEditor;
