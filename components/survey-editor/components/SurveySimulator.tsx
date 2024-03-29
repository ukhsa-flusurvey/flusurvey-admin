import SurveyView from '@/components/survey-viewer/survey-renderer/SurveyView/SurveyView';
import React, { useContext } from 'react';
import { SurveyContext } from '../surveyContext';

interface SurveySimulatorProps {
}

const SurveySimulator: React.FC<SurveySimulatorProps> = (props) => {
    const { survey } = useContext(SurveyContext);

    if (!survey) {
        return <div>No survey loaded</div>
    }

    return (
        <div className='bg-white overflow-y-scroll p-6 flex justify-center'>
            <div className='max-w-[600px]'>
                <SurveyView
                    survey={survey}
                    languageCode={'en'}
                    backBtnText='Back'
                    nextBtnText='Next'
                    submitBtnText='Submit'
                    invalidResponseText='Invalid response'
                    hideBackButton={false}
                    showKeys={true}
                    showEngineDebugMsg={false}
                    onSubmit={(responses, version) => {
                        console.log('submit', responses, version);
                    }}
                />
            </div>
        </div>
    );
};

export default SurveySimulator;
