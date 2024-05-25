import React from 'react';
import { SurveySingleItem } from 'survey-engine/data_types';

interface RscaProps {
    surveyItem: SurveySingleItem;
    onUpdateSurveyItem: (item: SurveySingleItem) => void;
}

const Rsca: React.FC<RscaProps> = (props) => {
    return (
        <div>
            <p>Rsca</p>
            <p>
                response modes: default, sm, md, lg, xl - vertical, horizontal, table
            </p>
        </div>
    );
};

export default Rsca;
