'use client';

import LoadingButton from '@/components/buttons/LoadingButton';
import InputForm from '@/components/inputs/Input';
import Select from '@/components/inputs/Select';
import { SurveyInfos } from '@/utils/server/types/studyInfos';
import { RadioGroup, Switch } from '@headlessui/react';
import { addMonths, format } from 'date-fns';
import React from 'react';
import { BsFiletypeCsv, BsFiletypeJson } from 'react-icons/bs';

interface ResponseDownloaderProps {
    studyKey: string;
    surveyInfos?: SurveyInfos
}

const dateToInputStr = (date: Date) => {
    return format(date, 'yyyy-MM-dd\'T\'HH:mm')
}

const ResponseDownloader: React.FC<ResponseDownloaderProps> = (props) => {
    const [selectedSurveyKey, setSelectedSurveyKey] = React.useState<string | undefined>(undefined);
    const [exportFormat, setExportFormat] = React.useState<'long' | 'wide' | 'json'>('wide');
    const [keySeparator, setKeySeparator] = React.useState<string>('-');
    const [queryStartDate, setQueryStartDate] = React.useState<Date>(addMonths(new Date(), -1));
    const [queryEndDate, setQueryEndDate] = React.useState<Date>(new Date());
    const [useShortKeys, setUseShortKeys] = React.useState<boolean>(false);
    const [isPending, startTransition] = React.useTransition();
    const [errorMsg, setErrorMsg] = React.useState<string | undefined>(undefined);


    const surveyKeySelector = <Select
        id="survey-key-select"
        options={props.surveyInfos ? props.surveyInfos.infos.map((surveyInfo) => ({ value: surveyInfo.surveyKey, label: surveyInfo.surveyKey })) : []}
        value={selectedSurveyKey ? selectedSurveyKey : ''}
        onChange={(value) => setSelectedSurveyKey(value)}
        label="Survey key"
        placeholder="Select survey key"
    />

    const exportFormatSelector = <RadioGroup value={exportFormat} onChange={setExportFormat}
        id='export-format-select'

    >
        <RadioGroup.Label
            id='export-format-select-label'
            className='text-sm font-medium text-gray-700 mb-1'
        >Export format</RadioGroup.Label>
        <div
            className='grid grid-cols-3'
        >
            <RadioGroup.Option
                id='export-format-select-wide'
                className='flex items-center gap-3 px-3 py-2 rounded-s border border-gray-300 ui-checked:bg-cyan-700 ui-checked:text-white cursor-default select-none '
                value="wide">
                <div>
                    <BsFiletypeCsv className='text-2xl' />
                </div>
                <div>
                    <div>Wide</div>
                    <div className='text-sm text-gray-600 ui-checked:text-white'>
                        Responses are rows and each question is a column
                    </div>
                </div>


            </RadioGroup.Option>
            <RadioGroup.Option value="long"
                id='export-format-select-long'
                className='flex items-center gap-3 px-3 py-2 border border-gray-300 ui-checked:bg-cyan-700 ui-checked:text-white cursor-default select-none '
            >
                <div>
                    <BsFiletypeCsv className='text-2xl' />
                </div>
                <div>
                    <div>Long</div>
                    <div className='text-sm text-gray-600 ui-checked:text-white'>
                        Each question is a row
                    </div>
                </div>
            </RadioGroup.Option>
            <RadioGroup.Option value="json"
                id='export-format-select-json'
                className='flex items-center gap-3 px-3 py-2 rounded-e border border-gray-300 ui-checked:bg-cyan-700 ui-checked:text-white cursor-default select-none '
            >
                <div>
                    <BsFiletypeJson className='text-2xl' />
                </div>
                <div>
                    <div>JSON</div>
                    <div className='text-sm text-gray-600 ui-checked:text-white'>Export the responses in a flat JSON array</div>
                </div>
            </RadioGroup.Option>
        </div>

    </RadioGroup>

    return (
        <div className='flex flex-col gap-3'>
            {surveyKeySelector}
            {exportFormatSelector}
            <div>
                <label
                    htmlFor="key-separator"
                    className='block text-sm font-medium text-gray-700 mb-1'
                >
                    Key separator
                </label>
                <input
                    type='text'
                    id="key-separator"
                    className='rounded border border-gray-300 px-3 py-2 w-full'
                    value={keySeparator}
                    maxLength={2}
                    onChange={(e) => setKeySeparator(e.target.value)}
                />
            </div>

            <div className='flex gap-6'>
                <InputForm
                    id='query-start-date'
                    label='From'
                    type='datetime-local'
                    value={dateToInputStr(queryStartDate)}
                    onChange={(event) => {
                        setQueryStartDate(new Date(event.target.value));
                    }}
                />

                <InputForm
                    id='query-end-date'
                    label='Until'
                    type='datetime-local'
                    value={dateToInputStr(queryEndDate)}
                    onChange={(event) => {
                        console.log(event.target.value)
                        setQueryEndDate(new Date(event.target.value));
                    }}
                />
            </div>
            <div className='flex gap-2 items-center'>
                <Switch
                    id='use-short-keys'
                    checked={useShortKeys}
                    onChange={setUseShortKeys}
                    className={`bg-gray-300 ui-checked:bg-cyan-700  relative inline-flex h-[28px] w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
                >
                    <span
                        className={`${useShortKeys ? 'translate-x-5' : 'translate-x-0'
                            } pointer-events-none inline-block h-[24px] w-[24px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
                    />

                </Switch>
                <span>
                    Using {useShortKeys ? 'short' : 'full'} keys
                </span>
            </div>


            <div
                role='alert'
                className='text-red-600'
            >
                {errorMsg}
            </div>

            <LoadingButton
                isLoading={isPending}
                disabled={!selectedSurveyKey}

                onClick={() => {
                    setErrorMsg(undefined);
                    startTransition(async () => {
                        try {
                            const resp = await fetch(`/api/data/responses?studyKey=${props.studyKey}&surveyKey=${selectedSurveyKey}&from=${Math.round(queryStartDate.getTime() / 1000)}&until=${Math.round(queryEndDate.getTime() / 1000)}&format=${exportFormat}&keySeparator=${keySeparator}&useShortKeys=${useShortKeys}`)
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
                            link.download = (fileName || 'responses.csv').replaceAll('"', '');
                            link.click();

                        } catch (e: any) {
                            console.log(e)
                            setErrorMsg(e.message);
                        }
                    })

                }}>
                Download
            </LoadingButton>



        </div>
    );
};

export default ResponseDownloader;
