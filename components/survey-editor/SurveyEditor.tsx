'use client';

import React, { useEffect } from 'react';
import SurveyEditorMenu from './components/SurveyEditorMenu';
import ItemEditor from './components/ItemEditor/ItemEditor';
import { Survey } from 'survey-engine/data_types';
import { EditorMode } from './components/types';
import { Toaster } from 'sonner';
import { SurveyContext } from './surveyContext';
import SurveyProperties from './components/SurveyProperties';
import SaveSurveyToDiskDialog from './components/SaveSurveyToDiskDialog';
import LoadSurveyFromDisk from './components/LoadSurveyFromDisk';
import SurveySimulator from './components/SurveySimulator';
import WelcomeScreen from './components/welcome-screen';
import InitNewSurveyDialog from './components/init-new-survey-dialog';

interface SurveyEditorProps {
    initialSurvey?: Survey;
    notLatestVersion?: boolean;
    embedded?: boolean;
    onUploadNewVersion?: (survey?: Survey) => void;
    onExit?: () => void;
}



const SurveyEditor: React.FC<SurveyEditorProps> = (props) => {
    const [mode, setMode] = React.useState<EditorMode>(EditorMode.ItemEditor);

    const [openSaveDialog, setOpenSaveDialog] = React.useState<boolean>(false);
    const [openLoadDialog, setOpenLoadDialog] = React.useState<boolean>(false);
    const [openNewDialog, setOpenNewDialog] = React.useState<boolean>(false);
    const [survey, setSurvey] = React.useState<Survey | undefined>(props.initialSurvey);
    const [selectedLanguage, setSelectedLanguage] = React.useState<string>(process.env.NEXT_PUBLIC_DEFAULT_LANGUAGE || 'en');


    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            // Check if Cmd (metaKey) or Ctrl is pressed along with 'S'
            if ((event.metaKey || event.ctrlKey)) {
                switch (event.key) {
                    case '1':
                        event.preventDefault();
                        setMode('properties');
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
                        if (!survey) {
                            break;
                        }
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
    }, [survey]);


    let mainContent: React.ReactNode = null;
    switch (mode) {
        case 'properties':
            mainContent = <SurveyProperties />;
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
            mainContent = <SurveySimulator />
            break;
    }

    if (!survey) {
        mainContent = (<WelcomeScreen
            onCreateSurvey={() => {
                setOpenNewDialog(true);
            }}
            onOpenSurvey={() => {
                setOpenLoadDialog(true);
            }}
        />
        );
    }

    return (
        <SurveyContext.Provider value={{ survey, setSurvey, selectedLanguage, setSelectedLanguage }}>
            <div className='bg-center bg-cover bg-[url(/images/sailing-ship.png)] h-screen absolute top-0 left-0 w-screen z-40 flex flex-col'>
                <SurveyEditorMenu
                    currentEditorMode={mode}
                    onChangeMode={setMode}
                    noSurveyOpen={!survey}
                    embedded={props.embedded}
                    onSave={() => setOpenSaveDialog(true)}
                    onOpen={() => setOpenLoadDialog(true)}
                    onNew={() => setOpenNewDialog(true)}
                    onExit={() => { props.onExit && props.onExit() }}
                    onUploadNewVersion={() => { props.onUploadNewVersion && props.onUploadNewVersion(survey) }}
                    notLatestVersion={props.notLatestVersion}
                />

                <div className='overflow-hidden flex flex-col grow'>
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
                <InitNewSurveyDialog
                    isOpen={openNewDialog}
                    onClose={() => setOpenNewDialog(false)}
                />
                <Toaster />
            </div >
        </SurveyContext.Provider>
    );
};

export default SurveyEditor;
