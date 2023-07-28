'use client';

import LoadingButton from '@/components/buttons/LoadingButton';
import InputForm from '@/components/inputs/Input';
import Select from '@/components/inputs/Select';
import { SurveyInfos } from '@/utils/server/types/studyInfos';
import { Switch } from '@headlessui/react';
import React from 'react';

interface SurveyInfoDownloaderProps {
    studyKey: string;
    surveyInfos?: SurveyInfos;
}

const SurveyInfoDownloader: React.FC<SurveyInfoDownloaderProps> = (props) => {
    const [selectedSurveyKey, setSelectedSurveyKey] = React.useState<string | undefined>(undefined);
    const [exportFormat, setExportFormat] = React.useState<string>('json');
    const [language, setLanguage] = React.useState<string>(process.env.NEXT_PUBLIC_DEFAULT_LANGUAGE || 'en');
    const [useShortKeys, setUseShortKeys] = React.useState<boolean>(false);
    const [isPending, startTransition] = React.useTransition();
    const [errorMsg, setErrorMsg] = React.useState<string | undefined>(undefined);

    return (
        <div className='flex flex-col gap-3'>
            <h2 className='text-xl'>
                Survey info downloader
            </h2>
            <p className='text-sm text-black p-3 bg-cyan-700/40 rounded '>
                Download the history of the survey structure in a CSV or JSON format. This can be helpful when interpreting the response data.
            </p>
            <Select
                id="survey-key-select-for-survey-info"
                options={props.surveyInfos ? props.surveyInfos.infos.map((surveyInfo) => ({ value: surveyInfo.surveyKey, label: surveyInfo.surveyKey })) : []}
                value={selectedSurveyKey ? selectedSurveyKey : ''}
                onChange={(value) => setSelectedSurveyKey(value)}
                label="Survey key"
                placeholder="Select survey key"
            />
            <Select
                id="format-select-for-survey-info"
                options={[
                    { value: 'csv', label: 'CSV' },
                    { value: 'json', label: 'JSON' },
                ]}
                value={exportFormat ? exportFormat : ''}
                onChange={(value) => setExportFormat(value)}
                label="Format"
                placeholder="Select a format"
            />
            <InputForm id='language-for-survey-info' label='Language' value={language} onChange={(event) => setLanguage(event.target.value)

            } />
            <div className='flex gap-2 items-center'>
                <Switch
                    id='use-short-keys-for-survey-info'
                    checked={useShortKeys}
                    onChange={setUseShortKeys}
                    className={`bg-gray-300 ui-checked:bg-cyan-700  relative inline-flex h-[28px] w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
                >
                    <span
                        className={`${useShortKeys ? 'translate-x-5' : 'translate-x-0'
                            } pointer-events-none inline-block h-[24px] w-[24px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
                    />

                </Switch>
                <label
                    htmlFor='use-short-keys-for-survey-info'
                    className='cursor-pointer select-none'
                >
                    Using {useShortKeys ? 'short' : 'full'} keys
                </label>
            </div>
            {errorMsg && (
                <p className='text-red-600'>
                    {errorMsg}
                </p>
            )}

            <LoadingButton
                isLoading={isPending}
                disabled={!selectedSurveyKey}
                onClick={async () => {
                    setErrorMsg(undefined);
                    if (!selectedSurveyKey) {
                        setErrorMsg('Please select a survey key.');
                        return;
                    }
                    startTransition(async () => {
                        const resp = await fetch(`/api/case-management-api/v1/data/${props.studyKey}/survey/${selectedSurveyKey}/survey-info${exportFormat === 'csv' ? '/csv' : ''}?lang=${language}&shortKeys=${useShortKeys}`)
                        if (resp.status !== 200) {
                            const err = await resp.json();
                            setErrorMsg(err.error);
                            //setErrorMsg(await resp.text());
                            return;
                        }
                        const blob = await resp.blob();
                        const fileName = resp.headers.get('Content-Disposition')?.split('filename=')[1];
                        const link = document.createElement('a');
                        link.href = window.URL.createObjectURL(blob);
                        link.download = (fileName || `${selectedSurveyKey}_info.${exportFormat}`).replaceAll('"', '');
                        link.click();
                    });
                }}
            >
                Download survey infos
            </LoadingButton>

        </div>
    );
};

export default SurveyInfoDownloader;
