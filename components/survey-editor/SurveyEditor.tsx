'use client';

import React from 'react';
import { editorModes } from './utils';
import SurveyEditorSidebar from './SurveyEditorSidebar';
import PublishMode from './views/PublishMode';
import PreviewMode from './views/PreviewMode';
import SurveyItemsMode from './views/SurveyItemsMode';
import SurveyPropsMode from './views/SurveyPropsMode';
import FileMode from './views/FileMode';
import { SurveyEditor as EditorInstance } from 'case-editor-tools/surveys/survey-editor/survey-editor';


interface SurveyEditorProps {
}


const SurveyEditor: React.FC<SurveyEditorProps> = (props) => {
    const [mode, setMode] = React.useState(editorModes[2]);

    const [editorInstance, setEditorInstance] = React.useState<EditorInstance>(new EditorInstance({
        versionId: '',
        surveyDefinition: {
            key: 'surveyKey',
            items: [
                {
                    key: 'surveyKey.group1',
                    items: [
                        {
                            key: 'surveyKey.group1.item1',
                        },
                        {
                            key: 'surveyKey.group1.group2',
                            items: []
                        }
                    ],
                },
                {
                    key: 'surveyKey.item4',

                },
                {
                    key: 'surveyKey.item2',
                    type: 'pageBreak',
                },
                {
                    key: 'surveyKey.item3',
                    type: 'surveyEnd'
                },



            ],
        }
    }));


    const onExit = () => {
        if (confirm('Unsaved, unexported or unpublished content will be lost. Are you sure you want to exit the survey editor?')) {
            console.log('todo: call onExit callback')
        }
    }

    let mainContent: React.ReactNode = null;
    switch (mode) {
        case editorModes[0]:
            mainContent = <FileMode />;
            break;
        case editorModes[1]:
            mainContent = <SurveyPropsMode />;
            break;
        case editorModes[2]:
            mainContent = <SurveyItemsMode
                editorInstance={editorInstance}
            />;
            break;
        case editorModes[3]:
            mainContent = <PreviewMode />;
            break;
        case editorModes[4]:
            mainContent = <PublishMode />;
            break;
        default:
            break;
    }


    return (
        <div className='relative'>
            <SurveyEditorSidebar
                currentMode={mode}
                onModeChange={setMode}
                onExit={onExit}
            />
            <div className='pl-14'>
                {mainContent}
            </div>

        </div>
    );
};

export default SurveyEditor;
