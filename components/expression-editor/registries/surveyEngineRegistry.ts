import { SlotInputDef } from "../utils";
import { miscExpressions } from "./common";


export const supportedBuiltInSlotTypes: SlotInputDef[] = [
    {
        id: 'text-input',
        type: 'str',
        icon: 'form-input',
        label: 'Text input',
        categories: ['variables'],
    },
    {
        id: 'number-input',
        type: 'num',
        icon: 'form-input',
        label: 'Number input',
        categories: ['variables'],
    },
    {
        id: 'date-picker',
        type: 'date',
        icon: 'calendar',
        label: 'Date picker',
        color: 'lime',
        categories: ['variables'],
    },
    {
        id: 'time-delta-picker',
        type: 'time-delta',
        icon: "circle-slash",
        label: 'Time delta picker',
        color: 'lime',
        categories: ['variables'],
    },
    {
        id: 'participant-flag-selector',
        type: 'key-value',
        contextObjectKey: 'participantFlags',
        // filterForObjectType: 'test1',
        label: 'Available participant flags',
        icon: 'tag',
        color: 'green',
        categories: ['variables'],
    }
]

export const surveyEngineRegistry = [
    ...miscExpressions,
]

export const surveyEngineCategories = [
    {
        id: 'variables',
        label: 'Variables'
    },
    // TODO: category survey (access survey items)
    {
        id: 'misc',
        label: 'Misc'
    }
];
