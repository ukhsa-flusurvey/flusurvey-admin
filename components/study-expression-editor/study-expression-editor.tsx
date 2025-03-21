import React from 'react';
import { StudyExpressionEditorProvider } from './study-expression-editor-context';
import Menu from './components/menu';
import { StudyContext, StudyExpressionEditorMode } from './types';
import MainContent from './components/main-content';
import { Toaster } from 'sonner';

interface StudyExpressionEditorProps {
    studyContext?: StudyContext
    mode?: StudyExpressionEditorMode;
}

const StudyExpressionEditor: React.FC<StudyExpressionEditorProps> = (props) => {
    return (
        <StudyExpressionEditorProvider defaultSession={{
            id: '',
            lastModified: 0,
            mode: props.mode ?? 'study-rules',
            studyContext: props.studyContext,
        }}>
            <div className='h-screen absolute top-0 left-0 w-screen z-40 flex flex-col'>
                <Menu
                    onExit={() => console.log('todo: exit')}
                />

                <div className='overflow-hidden flex flex-col grow'>
                    <MainContent />
                </div >
            </div>
            <Toaster />
        </StudyExpressionEditorProvider>
    );
};

export default StudyExpressionEditor;
