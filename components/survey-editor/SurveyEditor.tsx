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
import SurveySimulator from './components/SurveySimulator';
import WelcomeScreen from './components/welcome-screen';
import InitNewSurveyDialog from './components/init-new-survey-dialog';
import { useDebounceCallback, useLocalStorage } from 'usehooks-ts';
import { StoredSurvey, SurveyStorage } from './utils/SurveyStorage';
import { getSurveyIdentifier } from './utils/utils';

interface SurveyEditorProps {
    initialSurvey?: Survey;
    notLatestVersion?: boolean;
    embedded?: boolean;
    onUploadNewVersion?: (survey?: Survey) => void;
    onExit?: () => void;
}


const SurveyEditor: React.FC<SurveyEditorProps> = (props) => {
    const [mode, setMode] = React.useState<EditorMode>('itemEditor');
    const [openSaveDialog, setOpenSaveDialog] = React.useState<boolean>(false);
    const [openLoadDialog, setOpenLoadDialog] = React.useState<boolean>(false);
    const [openNewDialog, setOpenNewDialog] = React.useState<boolean>(false);
    const [storedSurvey, setStoredSurvey] = React.useState<StoredSurvey | undefined>(props.initialSurvey ? new StoredSurvey(getSurveyIdentifier(props.initialSurvey), props.initialSurvey, new Date()) : undefined);
    const [selectedLanguage, setSelectedLanguage] = React.useState<string>(process.env.NEXT_PUBLIC_DEFAULT_LANGUAGE || 'en');

    const runDebounced = useDebounceCallback((f) => f(), 1000);
    //const debouncedSetSurveyStorage = useDebounceCallback((s) => { updateSurveyInStorage(s) }, 1000);
    const [recentlyEditedStoredSurvey, setRecentlyEditedStoredSurvey] = React.useState<StoredSurvey | undefined>(undefined);
    const [storage, setStorage, removeStorage] = useLocalStorage('SurveyStorage', SurveyStorage.asObject());

    //  Updates survey in local storage
    function updateSurveyInStorage(s: StoredSurvey) {
        SurveyStorage.readFromLocalStorage();
        SurveyStorage.updateSurvey(new StoredSurvey(s.id, s.survey, new Date()));
        SurveyStorage.saveToLocalStorage();
    }

    //  Run every time storage changes (e.g. when another tab changes the storage)
    useEffect(() => {
        console.log('Storage changed');
        if (storage) {
            SurveyStorage.readFromLocalStorage();
            let updatedStoredSurvey = SurveyStorage.storedSurveys.find(s => s.id === storedSurvey?.id);
            if (JSON.stringify(updatedStoredSurvey?.survey) !== JSON.stringify(storedSurvey?.survey)) {
                setStoredSurvey(updatedStoredSurvey);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [storage, storedSurvey?.id]);

    //  Supposed to run only once, when page first loads / reloads
    useEffect(() => {
        if (recentlyEditedStoredSurvey === undefined) {
            SurveyStorage.readFromLocalStorage();
            const mostRecentSurvey = SurveyStorage.getMostRecentlyEditedSurvey();
            if (mostRecentSurvey) {
                setRecentlyEditedStoredSurvey(mostRecentSurvey);
            }
        }
    }, [recentlyEditedStoredSurvey]);

    //  Run every time survey changes, but debounced
    useEffect(() => {
        console.log('debouncedSetSurveyStorage or storedSurvey changed');
        if (storedSurvey) {
            runDebounced(() => {
                updateSurveyInStorage(storedSurvey);
            });
        }
        return () => {
            runDebounced.cancel();
        }
    }, [storedSurvey]);

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
                        if (!storedSurvey) {
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
    }, [storedSurvey]);


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
            mainContent = <SurveySimulator />
            break;
    }

    if (!storedSurvey) {
        mainContent = (<WelcomeScreen
            onCreateSurvey={() => {
                setOpenNewDialog(true);
            }}
            onOpenSurvey={() => {
                setOpenLoadDialog(true);
            }}
            recentlyEditedStoredSurvey={recentlyEditedStoredSurvey}
            onOpenRecentlyEditedSurvey={() => {
                console.log('Setting survey');
                setStoredSurvey(recentlyEditedStoredSurvey);
            }}
        />
        );
    }

    let survey = storedSurvey?.survey;
    let setSurvey = (s: Survey) => {
        console.log('Setting survey');
        if (storedSurvey) {
            setStoredSurvey(new StoredSurvey(storedSurvey.id, s, new Date()));
        } else {
            //  If there is no stored survey, create a new one, the survey is probably being loaded from a file.
            setStoredSurvey(new StoredSurvey(getSurveyIdentifier(s), s, new Date()));
        }
    };

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

                <div className='grow overflow-hidden flex flex-col'>
                    {mainContent}
                </div >
                <LoadSurveyFromDisk
                    isOpen={openLoadDialog}
                    onClose={() => setOpenLoadDialog(false)}
                    storedSurveys={SurveyStorage.storedSurveys}
                    onDeleteSurvey={(ss) => {
                        SurveyStorage.removeSurvey(ss);
                        SurveyStorage.saveToLocalStorage();
                        if (ss.id === recentlyEditedStoredSurvey?.id) { //  If the deleted survey is the most recent one
                            setRecentlyEditedStoredSurvey(undefined);
                        }
                        if (storedSurvey && ss.id === storedSurvey.id) { //  If the deleted survey is the one currently being edited
                            setStoredSurvey(undefined);
                        }
                    }
                    } onLoadStored={(ss: StoredSurvey) => {
                        setStoredSurvey(ss);
                    }
                    } />
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
