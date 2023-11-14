import { ExpressionDef, SlotInputDef } from "./utils"

export const testExpressionCategories = [
    {
        id: 'variables',
        label: 'Variables'
    },
    {
        id: 'control-flow',
        label: 'Control flow'
    },
    {
        id: 'logical',
        label: 'Logical operators'
    },
    {
        id: 'assigned-surveys',
        label: 'Assigned surveys'
    },
    {
        id: 'participant-flags',
        label: 'Participant flags'
    },
    {
        id: 'misc',
        label: 'Misc'
    }
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
        id: 'survey-key-selector',
        type: 'list-selector',
        contextArrayKey: 'surveyKeys',
        label: 'Available survey keys',
        icon: 'blocks',
        color: 'orange',
        categories: ['variables'],
    }
]

const serverControlFlowExpressions: ExpressionDef[] = [
    {
        categories: ['control-flow'],
        id: 'IF',
        label: 'IF',
        returnType: 'action',
        icon: 'signpost',
        color: 'blue',
        slots: [
            {

                label: 'Condition',
                required: true,
                allowedTypes: [
                    {
                        id: 'exp-slot',
                        type: 'expression',
                        allowedExpressionTypes: ['boolean']
                    }]
            },
            {
                label: 'Then',
                required: true,
                allowedTypes: [{
                    id: 'exp-slot',
                    type: 'expression',
                    allowedExpressionTypes: ['action']
                }]
            },
            {
                label: 'Else',
                required: false,
                allowedTypes: [{
                    id: 'exp-slot',
                    type: 'expression',
                    allowedExpressionTypes: ['action']
                }]
            }
        ]
    },
    // TODO: DO, IFTHEN
]


const logicalOperators: ExpressionDef[] = [
    {
        categories: ['logical'],
        id: 'and',
        label: 'AND',
        returnType: 'boolean',
        icon: 'brackets',
        slots: [
            {
                label: 'if all true:',
                required: true,
                isListSlot: true,
                allowedTypes: [
                    {
                        id: 'exp-slot',
                        type: 'expression',
                        allowedExpressionTypes: ['boolean']
                    }
                ]
            }
        ]
    }

    // OR
    // NOT
]

const participantStateActions: ExpressionDef[] = [
    {
        categories: ['assigned-surveys'],
        id: 'ADD_NEW_SURVEY',
        label: 'ASSIGN SURVEY',
        returnType: 'action',
        color: 'orange',
        icon: 'layout-list',
        slots: [
            {
                label: 'Survey key',
                required: true,
                allowedTypes: [
                    // survey key selector
                    {
                        id: 'survey-key-selector',
                        type: 'list-selector',
                    },
                    {
                        id: 'text-input',
                        type: 'str'
                    }
                ]
            },
            {
                label: 'Priority',
                required: true,
                allowedTypes: [
                    {
                        id: 'select',
                        type: 'select',
                        options: [
                            {
                                key: 'immediate',
                                label: 'Immediate'
                            },
                            {
                                key: 'prio',
                                label: 'Priority'
                            },
                            {
                                key: 'normal',
                                label: 'Normal'
                            },
                            {
                                key: 'optional',
                                label: 'Optional (hidden)'
                            },
                        ]
                    },
                ]
            },
            {
                label: 'From',
                required: false,
                allowedTypes: [
                    {
                        id: 'date-picker',
                        type: 'date',
                    },
                    {
                        id: 'exp-slot',
                        type: 'expression',
                        allowedExpressionTypes: ['num']
                    }
                ]
            },
            {
                label: 'Until',
                required: false,
                allowedTypes: [
                    {
                        id: 'date-picker',
                        type: 'date',
                    },
                    {
                        id: 'exp-slot',
                        type: 'expression',
                        allowedExpressionTypes: ['num']
                    }
                ]
            },
        ]
    }
]

const participantStateServerExpressions: ExpressionDef[] = [
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

const miscExpressions: ExpressionDef[] = [
    {
        categories: ['misc'],
        id: 'timestampWithOffset',
        label: 'GET TIMESTAMP',
        returnType: 'num',
        icon: 'calendar',
        slots: [
            {
                label: 'Offset',
                required: true,
                allowedTypes: [
                    {
                        id: 'time-delta-picker',
                        type: 'time-delta',
                    },
                    {
                        id: 'exp-slot',
                        type: 'expression',
                        allowedExpressionTypes: ['num'],
                        excludedExpressions: ['timestampWithOffset']
                    }
                ]
            },
            {
                label: 'Reference date',
                required: false,
                allowedTypes: [
                    {
                        id: 'date-picker',
                        type: 'date',
                    },
                    {
                        id: 'exp-slot',
                        type: 'expression',
                        allowedExpressionTypes: ['num']
                    }
                ]
            }
        ]
    }
]


export const testServerExpressionRegistry: ExpressionDef[] = [
    ...serverControlFlowExpressions,
    ...logicalOperators,
    ...participantStateActions,
    ...participantStateServerExpressions,
    ...miscExpressions,
]
