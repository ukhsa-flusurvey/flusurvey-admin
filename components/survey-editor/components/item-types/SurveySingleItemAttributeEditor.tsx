import React from 'react';
import { ItemGroupComponent, SurveySingleItem } from 'survey-engine/data_types';
import NotImplemented from '@/components/NotImplemented';
import SingleChoiceAttributeEditor from './specific-editors/SingleChoiceAttributeEditor';


interface SurveySingleItemAttributeEditorProps {
    surveyItem?: SurveySingleItem;
    onItemChange: (item: SurveySingleItem) => void;
}

const determineItemType = (item: SurveySingleItem): string => {
    if (!item.components?.items || item.components.items.length === 0) {
        console.warn('No components found for item: ', item.key);
        return 'unknown';
    }

    const responseGroup = item.components.items.find(i => i.role === 'responseGroup');
    if (!responseGroup) {
        return 'display';
    }

    const mainResponseItems = (responseGroup as ItemGroupComponent).items;
    if (!mainResponseItems || mainResponseItems.length === 0) {
        console.warn('No response items found for item: ', item);
        return 'unknown';
    }
    if (mainResponseItems.length > 1) {
        console.warn('More than one response item found for item: ', item);
        return 'unknown';
    }

    const mainResponseItem = mainResponseItems[0];

    switch (mainResponseItem.role) {
        case 'input':
            return 'textInput';
        case 'singleChoiceGroup':
            return 'singleChoice';
        case 'multipleChoiceGroup':
            return 'multipleChoice';
        default:
            console.warn('Unknown response item role: ', mainResponseItem.role);
            return mainResponseItem.role;
    }

}

const SurveySingleItemAttributeEditor: React.FC<SurveySingleItemAttributeEditorProps> = (props) => {
    if (!props.surveyItem) {
        return <p>
            No survey item provided
        </p>
    }

    const itemType = determineItemType(props.surveyItem);

    switch (itemType) {
        case 'textInput':
            return (<NotImplemented>
                Editor for {itemType}
            </NotImplemented>)
        case 'singleChoice':
            return (<SingleChoiceAttributeEditor

            />)
        case 'multipleChoice':
            return (<NotImplemented>
                Editor for {itemType}
            </NotImplemented>)
        case 'display':
            return (<NotImplemented>
                Editor for {itemType}
            </NotImplemented>)
        default:
            return <p className='p-unit-md text-danger'>
                Unknown item type: {itemType}
            </p>
    }
};

export default SurveySingleItemAttributeEditor;
