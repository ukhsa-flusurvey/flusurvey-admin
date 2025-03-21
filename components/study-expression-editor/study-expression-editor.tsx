import React from 'react';

interface StudyExpressionEditorProps {
}

const StudyExpressionEditor: React.FC<StudyExpressionEditorProps> = (props) => {

    let mainContent: React.ReactNode;
    mainContent = <p>todo</p>

    return (
        <div className='h-screen absolute top-0 left-0 w-screen z-40 flex flex-col'>
            {/*<SurveyEditorMenu
                currentEditorMode={mode}
                onChangeMode={setMode}
                noSurveyOpen={!survey}
                embedded={props.embedded}
                onSave={() => setOpenSaveDialog(true)}
                onOpen={() => setOpenLoadDialog(true)}
                onNew={() => setOpenNewDialog(true)}
                onExit={() => { props.onExit?.() }}
                onUploadNewVersion={() => { props.onUploadNewVersion?.(survey) }}
                notLatestVersion={props.notLatestVersion}
            />*/}

            <div className='overflow-hidden flex flex-col grow'>
                {mainContent}
            </div >
        </div>

    );
};

export default StudyExpressionEditor;
