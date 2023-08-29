'use client';

import React from 'react';
import { editorModes } from './utils';
import SurveyEditorSidebar from './SurveyEditorSidebar';
import PublishMode from './views/PublishMode';
import PreviewMode from './views/PreviewMode';
import SurveyItemsMode from './views/SurveyItemsMode';
import SurveyPropsMode from './views/SurveyPropsMode';
import FileMode from './views/FileMode';


interface SurveyEditorProps {
}


const SurveyEditor: React.FC<SurveyEditorProps> = (props) => {
    const [mode, setMode] = React.useState(editorModes[0]);


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
            mainContent = <SurveyItemsMode />;
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
