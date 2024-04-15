import React from 'react';
import { SurveySingleItem } from 'survey-engine/data_types';

interface SingleChoiceProps {
    surveyItem: SurveySingleItem;
    onUpdateSurveyItem: (item: SurveySingleItem) => void;
}

const SingleChoice: React.FC<SingleChoiceProps> = (props) => {
    return (
        <div>
            <p>SingleChoice</p>
            <p>sortable item list</p>
            <p>add items: simple label, formatted label, text input, number input, cloze, time input, date input</p>
            <p>each item: delete item, edit key, disabled, display condition</p>
        </div>
    );
};

export default SingleChoice;
