'use client';

import React, { useEffect } from 'react';
import SurveyEditorMenu from './components/SurveyEditorMenu';
import ItemEditor from './components/ItemEditor/ItemEditor';
import { Survey } from 'survey-engine/data_types';
import { EditorMode } from './components/types';
import { Toaster } from 'sonner';
import { SurveyContext } from './surveyContext';
import SurveyDocument from './components/SurveyDocument';
import SaveSurveyToDiskDialog from './components/SaveSurveyToDiskDialog';
import LoadSurveyFromDisk from './components/LoadSurveyFromDisk';

interface SurveyEditorProps {
    initialSurvey?: Survey;
}



const SurveyEditor: React.FC<SurveyEditorProps> = (props) => {
    const [mode, setMode] = React.useState<EditorMode>('itemEditor');

    const [openSaveDialog, setOpenSaveDialog] = React.useState<boolean>(false);
    const [openLoadDialog, setOpenLoadDialog] = React.useState<boolean>(false);
    const [survey, setSurvey] = React.useState<Survey | undefined>(props.initialSurvey);


    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            // Check if Cmd (metaKey) or Ctrl is pressed along with 'S'
            if ((event.metaKey || event.ctrlKey)) {
                switch (event.key) {
                    case '1':
                        event.preventDefault();
                        setMode('document');
                        break;
                    case '2':
                        event.preventDefault();
                        setMode('itemEditor');
                        break;
                    case '3':
                        event.preventDefault();
                        setMode('advanced');
                        break;
                    case '4':
                        event.preventDefault();
                        setMode('simulator');
                        break;
                    case 's':
                        event.preventDefault();
                        setOpenSaveDialog(true);
                        break;
                    case 'o':
                        event.preventDefault();
                        setOpenLoadDialog(true);
                        break;
                }

            }
        };

        // Attach the event listener
        document.addEventListener('keydown', handleKeyDown);

        // Cleanup the event listener
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);


    let mainContent: React.ReactNode = null;
    switch (mode) {
        case 'document':
            mainContent = <SurveyDocument />;
            break;
        case 'itemEditor':
            mainContent = <ItemEditor
                className='grow'
            />;
            break;
        case 'advanced':
            mainContent = <div>Advanced</div>;
            break;
        case 'simulator':
            mainContent = <div>Simulator</div>;
            break;
    }

    return (
        <SurveyContext.Provider value={{ survey, setSurvey }}>
            <div className='bg-center bg-cover bg-[url(/images/sailing-ship.png)] h-screen absolute top-0 left-0 w-screen z-40 flex flex-col'>
                <SurveyEditorMenu
                    currentEditorMode={mode}
                    onChangeMode={setMode}
                    onSave={() => setOpenSaveDialog(true)}
                    onOpen={() => setOpenLoadDialog(true)}
                />

                <div className='p-6 grow overflow-hidden flex flex-col'>
                    {mainContent}
                </div >
                <LoadSurveyFromDisk
                    isOpen={openLoadDialog}
                    onClose={() => setOpenLoadDialog(false)}
                />
                <SaveSurveyToDiskDialog
                    isOpen={openSaveDialog}
                    onClose={() => setOpenSaveDialog(false)}
                />
                <Toaster />
            </div >
        </SurveyContext.Provider>
    );
};

export default SurveyEditor;
