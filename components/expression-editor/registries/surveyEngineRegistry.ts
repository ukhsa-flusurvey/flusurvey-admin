import { ExpressionDef, SlotInputDef } from "../utils";
import { logicalOperators, miscExpressions } from "./common";

export const surveyExpressionCategories = [
    {
        id: 'variables',
        label: 'Variables'
    },
    {
        id: 'logical',
        label: 'Logical operators'
    },
    {
        id: 'participant-flags',
        label: 'Participant flags'
    },
    {
        id: 'response-dependencies',
        label: 'Response dependencies'
    },
    {
        id: 'misc',
        label: 'Misc'
    }
]

const slotKeyValueListSlotEditors: SlotInputDef[] = [
    {
        id: 'item-key-slot-key-options-single-choice',
        type: 'key-value-list',
        label: 'Single choice options',
        contextArrayKey: 'singleChoiceOptions',
        // filterForItemType: 'with-value',
        withFixedValue: 'rg.scg',
        icon: 'diamond',
        color: 'green',
        categories: ['variables'],
    },
    {
        id: 'item-key-slot-key-options-multiple-choice',
        type: 'key-value-list',
        label: 'Multiple choice options',
        contextArrayKey: 'multipleChoiceOptions',
        withFixedValue: 'rg.mcg',
        icon: 'square',
        color: 'green',
        categories: ['variables'],
    },
    {
        id: 'item-key-slot-key-options-generic',
        type: 'key-value-list',
        label: 'Generic item, slot and option keys',
        contextArrayKey: 'allItemKeys',
        icon: 'triangle',
        color: 'green',
        categories: ['variables'],
    },
]

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
    },
    ...slotKeyValueListSlotEditors
]




export const surveyEngineRegistry: ExpressionDef[] = [
    ...logicalOperators,
    ...miscExpressions,
    {
        categories: ['response-dependencies'],
        id: 'responseHasKeysAny',
        label: 'Response contains any of these keys:',
        returnType: 'boolean',
        icon: 'layout-list',
        slots: [
            {
                label: 'Item and option references:',
                required: true,
                allowedTypes: [
                    {
                        id: 'item-key-slot-key-options-generic',
                        type: 'key-value-list',
                    },
                    {
                        id: 'item-key-options-multiple-choice',
                        type: 'key-value-list',
                    },
                    {
                        id: 'item-key-options-single-choice',
                        type: 'key-value-list',
                    }
                ]
            },

        ]
    },
    {
        categories: ['participant-flags'],
        id: 'hasParticipantFlag',
        label: 'HAS FLAG WITH KEY AND VALUE',
        returnType: 'boolean',
        icon: 'tag',
        slots: [
            {
                label: 'Check for flag',
                required: true,
                allowedTypes: [
                    {
                        id: 'participant-flag-selector',
                        type: 'key-value',
                    },
                    {
                        id: 'key-value-manual',
                        type: 'key-value',
                    }
                ]
            },

        ]
    }
]
