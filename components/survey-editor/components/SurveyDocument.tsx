import React, { useContext } from 'react';
import { SurveyContext } from '../surveyContext';
import { Button } from '@/components/ui/button';

interface SurveyDocumentProps {
}

const SurveyDocument: React.FC<SurveyDocumentProps> = (props) => {
    const { survey, setSurvey } = useContext(SurveyContext);

    if (!survey) {
        return <p>No survey loaded</p>;
    }



    return (
        <div>
            {survey.surveyDefinition.items.map((item) => {
                return (
                    <div key={item.key}>
                        {item.key}
                    </div>
                );

            })}
            <Button
                onClick={() => {
                    setSurvey({
                        ...survey, surveyDefinition: { ...survey.surveyDefinition, key: 'newId' }
                    })
                }}
            >
                change
            </Button>
            <p>SurveyDocument</p>
        </div>

    );
};

export default SurveyDocument;
