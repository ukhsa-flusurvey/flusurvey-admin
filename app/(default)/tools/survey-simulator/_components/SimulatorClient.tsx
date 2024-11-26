'use client';

import { SimulatorConfig } from '@/components/survey-editor/components/SurveySimulator';
import SurveyView from '@/components/survey-viewer/survey-renderer/SurveyView/SurveyView';
import { LoaderIcon } from 'lucide-react';
import React, { useEffect } from 'react';


const SimulatorClient: React.FC = () => {
    const [isMounted, setIsMounted] = React.useState(false);
    const [counter, setCounter] = React.useState(0);

    const [simulatorConfig, setSimulatorConfig] = React.useState<SimulatorConfig | null>(null);

    useEffect(() => {
        setIsMounted(true);
        // console.log('SimulatorClient mounted');

        const handleMessageEvent = (event: MessageEvent) => {
            // console.log('message received', event);
            // Assuming you're sending JSON data
            if (event.data.type === 'simulatorConfig') {
                const newConfig = JSON.parse(event.data.data);
                console.log('newConfig', newConfig);
                setSimulatorConfig(newConfig);
                setCounter(prev => prev + 1);
            }
        }
        window.addEventListener('message', handleMessageEvent);
        window.parent.postMessage({ type: 'status', data: 'ready' }, '*');
        return () => {
            setIsMounted(false);
            window.removeEventListener('message', handleMessageEvent);
        };
    }, []);

    if (!isMounted) {
        return null;
    }


    if (!simulatorConfig) {
        return <div className='w-full h-screen flex items-center justify-center'>
            <LoaderIcon className='animate-spin text-primary me-2' />
            Loading survey...
        </div>
    }

    if (!simulatorConfig.survey) {
        return <div className='w-full h-screen flex items-center justify-center'>No survey loaded</div>
    }



    return (
        <div className='pt-6 pb-12 px-6  h-auto flex justify-center'>
            <div className='max-w-[800px] w-full'>
                <SurveyView
                    key={counter.toString()}
                    instanceKey={counter.toString()}
                    survey={simulatorConfig.survey}
                    languageCode={simulatorConfig.language || 'en'}
                    nextBtnText={simulatorConfig.texts?.nextBtnText || 'Next'}
                    backBtnText={simulatorConfig.texts?.backBtnText || 'Back'}
                    submitBtnText={simulatorConfig.texts?.submitBtnText || 'Submit'}
                    invalidResponseText={simulatorConfig.texts?.invalidResponseText || 'Invalid response'}
                    hideBackButton={false}
                    showKeys={simulatorConfig.showKeys}
                    showEngineDebugMsg={false}
                    context={simulatorConfig.surveyContext || {}}
                    prefills={simulatorConfig.prefills || []}
                    customResponseComponents={[]}
                    dateLocales={[]}
                    loading={false}
                    onResponsesChanged={(responses, version, surveyEngine) => {
                        console.log('responses changed', responses, version, surveyEngine);
                        window.parent.postMessage({ type: 'response', data: JSON.stringify(responses) }, '*');

                    }}
                    onSubmit={(responses, version) => {
                        console.log('submit', responses, version);
                    }}
                />

            </div>
        </div>
    );
};

export default SimulatorClient;
