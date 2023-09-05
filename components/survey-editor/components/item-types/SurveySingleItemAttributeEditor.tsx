import React from 'react';
import { SurveySingleItem } from 'survey-engine/data_types';

interface SurveySingleItemAttributeEditorProps {
    surveyItem?: SurveySingleItem;
}

const determineItemType = (item: SurveySingleItem): string => {
    return 'unknown';
}

const SurveySingleItemAttributeEditor: React.FC<SurveySingleItemAttributeEditorProps> = (props) => {
    if (!props.surveyItem) {
        return <p>
            No survey item provided
        </p>
    }

    const itemType = determineItemType(props.surveyItem);

    return (
        <p>
            Unknown item type: {itemType}
        </p>
    );
};

export default SurveySingleItemAttributeEditor;
