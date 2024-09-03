import Filepicker from '@/components/inputs/Filepicker';
import React from 'react';
import { BsExclamationTriangle, BsPencil, BsXLg } from 'react-icons/bs';
import { Survey } from 'survey-engine/data_types';
import { findAllLocales, removeLocales, renameLocales } from '../utils/localeUtils';
import { Button } from '@/components/ui/button';
import { SurveyContext } from '../surveyContext';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface LoadSurveyFromDiskProps {
    isOpen: boolean;
    onClose: () => void;
}


const LocaleEditor: React.FC<{
    locale: string,
    onRename: (oldLocale: string, newLocale: string) => void,
    onDelete: (locale: string) => void,
}> = ({ locale, onRename, onDelete }) => {
    return (
        <div className='flex items-center gap-4'>
            <span className='font-mono grow'>{locale}</span>
            <Button
                variant='ghost'
                size='icon'
                onClick={() => {
                    const newLocale = prompt('Enter new locale code:');
                    if (newLocale) {
                        onRename(locale, newLocale);
                    }
                }}
            >
                <BsPencil />
            </Button>
            <Button
                variant='ghost'
                size='icon'
                onClick={() => {
                    if (confirm(`Are you sure you want to delete locale ${locale}?`)) {
                        onDelete(locale);
                    }
                }}
            >
                <BsXLg />
            </Button>
        </div>
    )
}


const LoadSurveyFromDisk: React.FC<LoadSurveyFromDiskProps> = ({
    isOpen,
    onClose,
}) => {
    const { survey, setSurvey } = React.useContext(SurveyContext);
    const [surveyFileContent, setSurveyFileContent] = React.useState<Survey | undefined>(undefined);
    const [errorMsg, setErrorMsg] = React.useState<string | undefined>(undefined);


    React.useEffect(() => {
        setSurveyFileContent(undefined);
    }, [isOpen]);

    const onLoad = () => {
        if (!surveyFileContent) return;
        setSurvey(surveyFileContent);
        toast.success('Survey loaded');
        onClose();
    }


    let localesFromSurvey: string[] = [];
    if (surveyFileContent) {
        localesFromSurvey = findAllLocales(surveyFileContent);
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}
        >
            <DialogContent>


                <DialogHeader>
                    <DialogTitle>
                        Load from disk
                    </DialogTitle>
                </DialogHeader>
                <div>
                    <div className='py-3'>
                        <div className='flex items-center gap-3 p-4 bg-yellow-100 rounded-lg mb-3'>
                            <span className='text-yellow-800 text-xl'>
                                <BsExclamationTriangle />
                            </span>
                            <p className='text-yellow-800'>
                                This will overwrite the current survey. Are you sure you want to continue?
                            </p>
                        </div>

                        <Filepicker
                            label='Select a survey file'
                            id='survey upload'
                            accept={{
                                'application/json': ['.json'],
                            }}
                            onChange={(files) => {
                                setSurveyFileContent(undefined);
                                setErrorMsg(undefined);
                                if (files.length > 0) {
                                    // read file as a json
                                    const reader = new FileReader();
                                    reader.onload = (e) => {
                                        const text = e.target?.result;
                                        if (typeof text === 'string') {
                                            const data = JSON.parse(text);

                                            let surveyKeyFromData = '';
                                            if (data && data.surveyDefinition && data.surveyDefinition.key) {
                                                surveyKeyFromData = data.surveyDefinition.key;
                                            }

                                            if (!surveyKeyFromData) {
                                                setErrorMsg('Survey key not found in the selected file.');
                                                return;
                                            }

                                            setSurveyFileContent(data as Survey);
                                        } else {
                                            setSurveyFileContent(undefined);
                                            console.log('error');
                                        }

                                    }
                                    reader.readAsText(files[0]);
                                }
                            }}
                        />

                        {errorMsg && (
                            <p className='text-red-700 mt-3'>{errorMsg}</p>
                        )}
                    </div>
                    {localesFromSurvey.length > 0 && (
                        <div>
                            <h3 className='text-sm font-bold mb-2'>Locales used:</h3>
                            <ul>
                                {localesFromSurvey.map((loc, i) => (
                                    <li key={i} className=' bg-neutral-50 border rounded-lg px-3 py-3 mr-3 mb-3'>
                                        <LocaleEditor
                                            locale={loc}
                                            onRename={(oldLocale, newLocale) => {
                                                if (!surveyFileContent) return;
                                                console.log('rename', oldLocale, newLocale);
                                                setSurveyFileContent({ ...renameLocales(surveyFileContent, oldLocale, newLocale) });
                                            }}
                                            onDelete={(locale) => {
                                                if (!surveyFileContent) return;
                                                setSurveyFileContent(removeLocales(surveyFileContent, [locale]));
                                            }}
                                        />
                                    </li>
                                ))}
                            </ul>

                        </div>
                    )}

                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>

                    <Button color="primary" onClick={onLoad}
                        disabled={!surveyFileContent}
                    >
                        Import
                    </Button>
                </DialogFooter>

            </DialogContent>
        </Dialog>
    );
};

export default LoadSurveyFromDisk;
