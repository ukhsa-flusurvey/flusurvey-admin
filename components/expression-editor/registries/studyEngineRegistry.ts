import { ExpressionDef, SlotInputDef } from "../utils";
import { comparisonOperators, logicalOperators, miscExpressions } from "./common";

export const studyEngineCategories = [
    {
        id: 'control-flow',
        label: 'Control flow'
    },
    {
        id: 'logical',
        label: 'Logical operators'
    },
    {
        id: 'comparison',
        label: 'Comparisons'
    },
    {
        id: 'mathematical-operators',
        label: 'Mathematical operators'
    },
    {
        id: 'survey-submission-checkers',
        label: 'Survey submission methods',
    },
    {
        id: 'event-checkers',
        label: 'Event properties'
    },
    {
        id: 'general-study-actions',
        label: 'General study actions'
    },
    {
        id: 'participant-state-actions',
        label: 'Change participant state'
    },
    {
        id: 'variables',
        label: 'Variables'
    },
    {
        id: 'misc',
        label: 'Misc'
    },
    {
        id: 'advanced',
        label: 'Advanced'
    },
]

export const supportedBuiltInSlotTypes: SlotInputDef[] = [
    {
        id: 'text-input',
        type: 'str',
        icon: 'form-input',
        label: 'Text constant',
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
        id: 'study-status-picker',
        type: 'list-selector',
        contextArrayKey: 'studyStatusValues',
        label: 'Available study status values',
        icon: 'tag',
        color: 'green',
        categories: ['variables'],
    },
    {
        id: 'message-type-picker',
        type: 'list-selector',
        contextArrayKey: 'messageTypes',
        label: 'Available message types',
        icon: 'diamond',
        color: 'green',
        categories: ['variables'],
    },
    {
        id: 'participant-flag-selector',
        type: 'key-value',
        contextObjectKey: 'participantFlags',
        categories: ['variables'],
        label: 'Available participant flags',
        icon: 'tag',
        color: 'dark',
        allowExpressionsForValue: true,
    },
    {
        id: 'participant-flag-key-selector',
        type: 'list-selector',
        contextArrayKey: 'participantFlagKeys',
        label: 'Available participant flag keys',
        icon: 'tag',
        color: 'dark',
        categories: ['variables'],
    },
    {
        id: 'survey-key-selector',
        type: 'list-selector',
        contextArrayKey: 'surveyKeys',
        label: 'Available survey keys',
        icon: 'tag',
        color: 'dark',
        categories: ['variables'],
    },
    {
        id: 'custom-event-key-selector',
        type: 'list-selector',
        contextArrayKey: 'customEventKeys',
        label: 'Available custom event keys',
        icon: 'tag',
        color: 'dark',
        categories: ['variables'],
    },
    {
        id: 'linking-code-key-selector',
        type: 'list-selector',
        contextArrayKey: 'linkingCodeKeys',
        label: 'Available linking code or study code list keys',
        icon: 'tag',
        color: 'dark',
        categories: ['variables'],
    },
    {
        id: 'external-event-handler-selector',
        type: 'key-value',
        contextObjectKey: 'externalEventHandlers',
        label: 'Service name and route',
        icon: 'tag',
        color: 'dark',
        categories: ['variables'],
    },
    {
        id: 'report-key-selector',
        type: 'list-selector',
        contextArrayKey: 'reportKeys',
        label: 'Available report keys',
        icon: 'tag',
        color: 'dark',
        categories: ['variables'],
    },
    {
        id: 'report-key-attribute-selector',
        type: 'key-value',
        contextObjectKey: 'reportKeysWithAttributes',
        label: 'Report key with attribute',
        icon: 'tag',
        color: 'dark',
        categories: ['variables'],
    }
]

const controlFlowOperators: ExpressionDef[] = [
    {
        id: 'IF',
        categories: ['control-flow'],
        label: 'If - else',
        returnType: 'action',
        icon: 'split',
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
                    }
                ]
            },
            {
                label: 'True branch',
                required: true,
                allowedTypes: [
                    {
                        id: 'exp-slot',
                        type: 'expression',
                        allowedExpressionTypes: ['action']
                    }
                ]
            },
            {
                label: 'False branch',
                required: false,
                allowedTypes: [
                    {
                        id: 'exp-slot',
                        type: 'expression',
                        allowedExpressionTypes: ['action']
                    }
                ]
            }
        ],
        defaultValue: {
            dtype: 'exp',
            exp: {
                name: 'IF',
                data: []
            }
        }
    },
    {
        id: 'IFTHEN',
        categories: ['control-flow'],
        label: 'Conditional action set (IF-THEN)',
        returnType: 'action',
        icon: "signpost",
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
                    }
                ]
            },
            {
                label: 'Actions',
                required: true,
                isListSlot: true,
                allowedTypes: [
                    {
                        id: 'exp-slot',
                        type: 'expression',
                        allowedExpressionTypes: ['action']
                    }
                ]
            }
        ],
        defaultValue: {
            dtype: 'exp',
            exp: {
                name: 'IFTHEN',
                data: []
            }
        }
    },
    {
        id: 'DO',
        categories: ['control-flow'],
        label: 'Group of actions (DO)',
        returnType: 'action',
        icon: 'layout-list',
        color: 'blue',
        slots: [
            {
                label: 'Actions',
                required: true,
                isListSlot: true,
                allowedTypes: [
                    {
                        id: 'exp-slot',
                        type: 'expression',
                        allowedExpressionTypes: ['action']
                    }
                ]
            }
        ],
        defaultValue: {
            dtype: 'exp',
            exp: {
                name: 'DO',
                data: []
            }
        }
    },

]

const generalStudyActions: ExpressionDef[] = [
    {
        id: 'UPDATE_STUDY_STATUS',
        categories: ['general-study-actions'],
        label: 'Update study status',
        returnType: 'action',
        icon: "tag",
        color: 'blue',
        slots: [
            {
                label: 'New status',
                required: true,
                allowedTypes: [
                    {
                        id: 'study-status-picker',
                        type: 'list-selector',
                    },
                    {
                        id: 'text-input',
                        type: 'str',
                    },
                ]
            }
        ],
        defaultValue: {
            dtype: 'exp',
            exp: {
                name: 'UPDATE_STUDY_STATUS',
                data: [
                    {
                        dtype: 'str',
                        str: 'active'
                    }
                ],
                metadata: {
                    slotTypes: ['study-status-picker']
                }
            },
        }
    },
    {
        id: 'stopParticipation',
        categories: ['general-study-actions'],
        isTemplateFor: 'UPDATE_STUDY_STATUS',
        label: 'Stop participation',
        returnType: 'action',
        icon: "square",
        color: 'blue',
        slots: [],
        defaultValue: {
            dtype: 'exp',
            exp: {
                name: 'UPDATE_STUDY_STATUS',
                data: [
                    {
                        dtype: 'str',
                        str: 'inactive'
                    }
                ],
                metadata: {
                    slotTypes: ['study-status-picker']
                }
            },
        }
    },
    {
        id: 'finishParticipation',
        categories: ['general-study-actions'],
        isTemplateFor: 'UPDATE_STUDY_STATUS',
        label: 'Finish participation',
        returnType: 'action',
        icon: "pyramid",
        color: 'blue',
        slots: [],
        defaultValue: {
            dtype: 'exp',
            exp: {
                name: 'UPDATE_STUDY_STATUS',
                data: [
                    {
                        dtype: 'str',
                        str: 'finished'
                    }
                ],
                metadata: {
                    slotTypes: ['study-status-picker']
                }
            },
        }
    },
    {
        id: 'START_NEW_STUDY_SESSION',
        label: 'Start New Study Session',
        categories: ['general-study-actions'],
        returnType: 'action',
        icon: "code",
        color: 'blue',
        slots: [],
        defaultValue: {
            dtype: 'exp',
            exp: {
                name: 'START_NEW_STUDY_SESSION',
                data: [],
            },
        }
    },
    {
        id: 'REMOVE_STUDY_CODE',
        label: 'Remove Entry from Study Wide Code List',
        categories: ['general-study-actions'],
        returnType: 'action',
        icon: "circle-slash",
        color: 'blue',
        slots: [
            {
                label: 'List key',
                required: true,
                allowedTypes: [
                    {
                        id: 'linking-code-key-selector',
                        type: 'list-selector',
                    },
                    {
                        id: 'text-input',
                        type: 'str',
                    },
                    {
                        id: 'exp-slot',
                        type: 'expression',
                        allowedExpressionTypes: ['str']
                    }
                ],
            },
            {
                label: 'Code to remove',
                required: true,
                allowedTypes: [
                    {
                        id: 'text-input',
                        type: 'str',
                    },
                    {
                        id: 'exp-slot',
                        type: 'expression',
                        allowedExpressionTypes: ['str']
                    }
                ]
            }
        ],
        defaultValue: {
            dtype: 'exp',
            exp: {
                name: 'REMOVE_STUDY_CODE',
                data: [],
            },
        }
    },
    {
        id: 'NOTIFY_RESEARCHER',
        label: 'Notify Researchers (Email)',
        categories: ['general-study-actions'],
        returnType: 'action',
        icon: "diamond",
        color: 'blue',
        slots: [
            {
                label: 'Message type',
                required: true,
                allowedTypes: [
                    {
                        id: 'message-type-picker',
                        type: 'list-selector',
                    },
                    {
                        id: 'text-input',
                        type: 'str',
                    },
                ],
            },
            {
                label: 'Payload - as key value pairs',
                required: false,
                isListSlot: true,
                allowedTypes: [
                    {
                        id: 'text-input',
                        type: 'str',
                    },
                    {
                        id: 'exp-slot',
                        type: 'expression',
                        allowedExpressionTypes: ['str']
                    }
                ]
            }
        ],
        defaultValue: {
            dtype: 'exp',
            exp: {
                name: 'NOTIFY_RESEARCHER',
                data: [
                ],
                metadata: {
                    slotTypes: ['message-type-picker']
                }
            },
        }
    }

]

const participantStateActions: ExpressionDef[] = [
    {
        id: 'UPDATE_FLAG',
        categories: ['participant-state-actions'],
        label: 'Update participant flag',
        returnType: 'action',
        icon: "tag",
        color: 'blue',
        slots: [
            {
                label: '',
                required: true,
                allowedTypes: [
                    {
                        id: 'participant-flag-selector',
                        type: 'key-value',
                    }
                ]
            }
        ],
        defaultValue: {
            dtype: 'exp',
            exp: {
                name: 'UPDATE_FLAG',
                data: [
                    {
                        dtype: 'str',
                        str: ''
                    },
                    {
                        dtype: 'str',
                        str: ''
                    }
                ],
                metadata: {
                    slotTypes: ['participant-flag-selector']
                }
            },
        }
    },
    {
        id: 'REMOVE_FLAG',
        categories: ['participant-state-actions'],
        label: 'Remove participant flag',
        returnType: 'action',
        icon: "tag",
        color: 'blue',
        slots: [
            {
                label: '',
                required: true,
                allowedTypes: [
                    {
                        id: 'participant-flag-key-selector',
                        type: 'list-selector',
                    }
                ]
            }
        ],
        defaultValue: {
            dtype: 'exp',
            exp: {
                name: 'REMOVE_FLAG',
                data: [
                    {
                        dtype: 'str',
                        str: ''
                    }
                ],
                metadata: {
                    slotTypes: ['participant-flag-key-selector']
                }
            },
        }
    },
    {
        id: 'ADD_NEW_SURVEY',
        categories: ['participant-state-actions'],
        label: 'Add new survey',
        returnType: 'action',
        icon: "calendar",
        color: 'blue',
        slots: [
            {
                label: 'Survey key',
                required: true,
                allowedTypes: [
                    {
                        id: 'survey-key-selector',
                        type: 'list-selector',
                    },
                    {
                        id: 'text-input',
                        type: 'str',
                    }
                ]
            },
            {
                label: 'Available from',
                required: false,
                allowedTypes: [
                    {
                        id: 'date-picker',
                        type: 'date',
                    },
                    {
                        id: 'exp-slot',
                        type: 'expression',
                        allowedExpressionTypes: ['num'],
                        excludedExpressions: []
                    }
                ]
            },
            {
                label: 'Available until',
                required: false,
                allowedTypes: [
                    {
                        id: 'date-picker',
                        type: 'date',
                    },
                    {
                        id: 'exp-slot',
                        type: 'expression',
                        allowedExpressionTypes: ['num'],
                        excludedExpressions: []
                    }
                ]
            },
            {
                label: 'Category',
                required: true,
                allowedTypes: [
                    {
                        type: 'select',
                        options: [
                            {
                                key: 'immediate',
                                label: 'immediate'
                            },
                            {
                                key: 'prio',
                                label: 'priority'
                            },
                            {
                                key: 'normal',
                                label: 'normal'
                            },
                            {
                                key: 'optional',
                                label: 'optional'
                            }
                        ],
                        id: 'select-input',

                    }
                ]
            }
        ],
        defaultValue: {
            dtype: 'exp',
            exp: {
                name: 'ADD_NEW_SURVEY',
                data: [
                    {
                        dtype: 'str',
                        str: ''
                    },
                    undefined,
                    undefined,
                    {
                        dtype: 'str',
                        str: 'normal'
                    }
                ],
                metadata: {
                    slotTypes: ['survey-key-selector']
                }
            },
        }
    },
    {
        id: 'REMOVE_ALL_SURVEYS',
        label: 'Remove all assigned surveys',
        categories: ['participant-state-actions'],
        returnType: 'action',
        icon: "circle-slash",
        color: 'blue',
        slots: [],
        defaultValue: {
            dtype: 'exp',
            exp: {
                name: 'REMOVE_ALL_SURVEYS',
                data: [],
            },
        }
    },
    {
        id: 'REMOVE_SURVEY_BY_KEY',
        label: 'Remove one assigned survey',
        categories: ['participant-state-actions'],
        returnType: 'action',
        icon: "circle-slash",
        color: 'blue',
        slots: [
            {
                label: 'Survey key',
                required: true,
                allowedTypes: [
                    {
                        id: 'survey-key-selector',
                        type: 'list-selector',
                    },
                    {
                        id: 'text-input',
                        type: 'str',
                    }
                ]
            },
            {
                label: 'Which survey to remove',
                required: true,
                allowedTypes: [
                    {
                        type: 'select',
                        options: [
                            {
                                key: 'first',
                                label: 'first'
                            },
                            {
                                key: 'last',
                                label: 'last'
                            }
                        ],
                        id: 'select-input',

                    }
                ]
            }
        ],
        defaultValue: {
            dtype: 'exp',
            exp: {
                name: 'REMOVE_SURVEY_BY_KEY',
                data: [
                    {
                        dtype: 'str',
                        str: ''
                    },
                    {
                        dtype: 'str',
                        str: 'first'
                    }
                ],
                metadata: {
                    slotTypes: ['survey-key-selector']
                }
            },
        }
    },
    {
        id: 'REMOVE_SURVEYS_BY_KEY',
        label: 'Remove all surveys of a specific key',
        categories: ['participant-state-actions'],
        returnType: 'action',
        icon: "circle-slash",
        color: 'blue',
        slots: [
            {
                label: 'Survey key',
                required: true,
                allowedTypes: [
                    {
                        id: 'survey-key-selector',
                        type: 'list-selector',
                    },
                    {
                        id: 'text-input',
                        type: 'str',
                    }
                ]
            }
        ],
        defaultValue: {
            dtype: 'exp',
            exp: {
                name: 'REMOVE_SURVEYS_BY_KEY',
                data: [
                    {
                        dtype: 'str',
                        str: ''
                    },
                ],
                metadata: {
                    slotTypes: ['survey-key-selector']
                }
            },
        }
    },
    {
        id: 'ADD_MESSAGE',
        label: 'Schedule a message',
        categories: ['participant-state-actions'],
        returnType: 'action',
        icon: "calendar",
        color: 'blue',
        slots: [
            {
                label: 'Message type',
                required: true,
                allowedTypes: [
                    {
                        id: 'message-type-picker',
                        type: 'list-selector',
                    },
                    {
                        id: 'text-input',
                        type: 'str',
                    }
                ]
            },
            {
                label: 'Scheduled for',
                required: true,
                allowedTypes: [
                    {
                        id: 'exp-slot',
                        type: 'expression',
                        allowedExpressionTypes: ['num']
                    },
                    {
                        id: 'date-picker',
                        type: 'date',
                    }
                ]
            }
        ],
        defaultValue: {
            dtype: 'exp',
            exp: {
                name: 'ADD_MESSAGE',
                data: [
                    {
                        dtype: 'str',
                        str: ''
                    },
                    {
                        dtype: 'exp',
                        exp: {
                            name: 'timestampWithOffset',
                            data: [
                                {
                                    dtype: 'num',
                                    num: 0
                                }
                            ],
                        }
                    }
                ],
                metadata: {
                    slotTypes: ['message-type-picker']
                }
            },
        }
    },
    {
        id: 'REMOVE_ALL_MESSAGES',
        label: 'Remove all scheduled messages',
        categories: ['participant-state-actions'],
        returnType: 'action',
        icon: "circle-slash",
        color: 'blue',
        slots: [],
        defaultValue: {
            dtype: 'exp',
            exp: {
                name: 'REMOVE_ALL_MESSAGES',
                data: [],
            },
        }
    },
    {
        id: 'REMOVE_MESSAGES_BY_TYPE',
        label: 'Remove scheduled messages of a specific type',
        categories: ['participant-state-actions'],
        returnType: 'action',
        icon: "circle-slash",
        color: 'blue',
        slots: [
            {
                label: 'Message type',
                required: true,
                allowedTypes: [
                    {
                        id: 'message-type-picker',
                        type: 'list-selector',
                    },
                    {
                        id: 'text-input',
                        type: 'str',
                    }
                ]
            }
        ],
        defaultValue: {
            dtype: 'exp',
            exp: {
                name: 'REMOVE_MESSAGES_BY_TYPE',
                data: [
                    {
                        dtype: 'str',
                        str: ''
                    },
                ],
                metadata: {
                    slotTypes: ['message-type-picker']
                }
            },
        }
    },
    {
        id: 'SET_LINKING_CODE',
        label: 'Set linking code',
        returnType: 'action',
        icon: "tag",
        color: 'blue',
        categories: ['participant-state-actions'],
        slots: [
            {
                label: 'Key',
                required: true,
                allowedTypes: [
                    {
                        id: 'linking-code-key-selector',
                        type: 'list-selector',
                    },
                    {
                        id: 'text-input',
                        type: 'str',
                    },
                    {
                        id: 'exp-slot',
                        type: 'expression',
                        allowedExpressionTypes: ['str']
                    }
                ],
            },
            {
                label: 'Value',
                required: true,
                allowedTypes: [
                    {
                        id: 'text-input',
                        type: 'str',
                    },
                    {
                        id: 'exp-slot',
                        type: 'expression',
                        allowedExpressionTypes: ['str']
                    }
                ]
            }
        ],
        defaultValue: {
            dtype: 'exp',
            exp: {
                name: 'SET_LINKING_CODE',
                data: [
                    {
                        dtype: 'str',
                        str: ''
                    },
                ],
                metadata: {
                    slotTypes: ['linking-code-key-selector']
                }
            },
        }
    },
    {
        id: 'DELETE_LINKING_CODE',
        label: 'Delete linking code',
        returnType: 'action',
        icon: "tag",
        color: 'blue',
        categories: ['participant-state-actions'],
        slots: [
            {
                label: 'Delete only for key (delete all if empty)',
                required: false,
                allowedTypes: [
                    {
                        id: 'linking-code-key-selector',
                        type: 'list-selector',
                    },
                    {
                        id: 'text-input',
                        type: 'str',
                    },
                    {
                        id: 'exp-slot',
                        type: 'expression',
                        allowedExpressionTypes: ['str']
                    }
                ],
            }
        ],
        defaultValue: {
            dtype: 'exp',
            exp: {
                name: 'DELETE_LINKING_CODE',
                data: []
            }
        }
    },
    {
        id: 'DRAW_STUDY_CODE_AS_LINKING_CODE',
        label: 'Draw study code as linking code',
        returnType: 'action',
        icon: "tag",
        color: 'blue',
        categories: ['participant-state-actions'],
        slots: [
            {
                label: 'Draw from code list',
                required: true,
                allowedTypes: [
                    {
                        id: 'linking-code-key-selector',
                        type: 'list-selector',
                    },
                    {
                        id: 'text-input',
                        type: 'str',
                    },
                    {
                        id: 'exp-slot',
                        type: 'expression',
                        allowedExpressionTypes: ['str']
                    }
                ],
            },
            {
                label: 'Store as key (optional)',
                required: false,
                allowedTypes: [
                    {
                        id: 'text-input',
                        type: 'str',
                    },
                    {
                        id: 'linking-code-key-selector',
                        type: 'list-selector',
                    },
                ]
            },
        ],
        defaultValue: {
            dtype: 'exp',
            exp: {
                name: 'DRAW_STUDY_CODE_AS_LINKING_CODE',
                data: [
                    {
                        dtype: 'str',
                        str: ''
                    },
                ],
                metadata: {
                    slotTypes: ['linking-code-key-selector']
                }
            },
        }
    },
    {
        id: 'REMOVE_CONFIDENTIAL_RESPONSE_BY_KEY',
        label: 'Remove confidential response by key',
        returnType: 'action',
        icon: "triangle",
        color: 'blue',
        categories: ['participant-state-actions'],
        slots: [
            {
                label: 'Key',
                required: true,
                allowedTypes: [
                    {
                        id: 'text-input',
                        type: 'str',
                    },
                ]
            }
        ],
        defaultValue: {
            dtype: 'exp',
            exp: {
                name: 'REMOVE_CONFIDENTIAL_RESPONSE_BY_KEY',
                data: [
                    {
                        dtype: 'str',
                        str: ''
                    },
                ],
                metadata: {
                    slotTypes: ['text-input']
                }
            },
        }
    },
    {
        id: 'REMOVE_ALL_CONFIDENTIAL_RESPONSES',
        label: 'Remove all confidential responses',
        returnType: 'action',
        icon: "triangle",
        color: 'blue',
        categories: ['participant-state-actions'],
        slots: [],
        defaultValue: {
            dtype: 'exp',
            exp: {
                name: 'REMOVE_ALL_CONFIDENTIAL_RESPONSES',
                data: [],
            },
        }
    },
    {
        id: 'EXTERNAL_EVENT_HANDLER',
        label: 'External event handler',
        returnType: 'action',
        icon: "code",
        color: 'blue',
        categories: ['participant-state-actions'],
        slots: [
            {
                label: '',
                required: true,
                allowedTypes: [
                    {
                        id: 'external-event-handler-selector',
                        type: 'key-value',
                    }
                ]
            }
        ],
        defaultValue: {
            dtype: 'exp',
            exp: {
                name: 'EXTERNAL_EVENT_HANDLER',
                data: [],
                metadata: {
                    slotTypes: ['external-event-handler-selector']
                }
            },
        }
    },
    {
        id: 'INIT_REPORT',
        categories: ['participant-state-actions'],
        label: 'Initialize report',
        returnType: 'action',
        icon: "calendar",
        color: 'blue',
        slots: [
            {
                label: 'Report key',
                required: true,
                allowedTypes: [
                    {
                        id: 'report-key-selector',
                        type: 'list-selector',
                    },
                    {
                        id: 'text-input',
                        type: 'str',
                    }
                ]
            }
        ],
        defaultValue: {
            dtype: 'exp',
            exp: {
                name: 'INIT_REPORT',
                data: [
                ],
                metadata: {
                    slotTypes: ['report-key-selector']
                }
            },

        }
    },
    {
        id: 'CANCEL_REPORT',
        categories: ['participant-state-actions'],
        label: 'Cancel report',
        returnType: 'action',
        icon: "circle-slash",
        color: 'blue',
        slots: [
            {
                label: 'Report key',
                required: true,
                allowedTypes: [
                    {
                        id: 'report-key-selector',
                        type: 'list-selector',
                    },
                    {
                        id: 'text-input',
                        type: 'str',
                    }
                ]
            }
        ],
        defaultValue: {
            dtype: 'exp',
            exp: {
                name: 'CANCEL_REPORT',
                data: [
                ],
                metadata: {
                    slotTypes: ['report-key-selector']
                }
            },

        }
    },
    {
        id: 'UPDATE_REPORT_DATA',
        categories: ['participant-state-actions'],
        label: 'Update report data',
        returnType: 'action',
        icon: "tag",
        color: 'blue',
        slots: [
            {
                label: 'Report key and attribute',
                argIndexes: [0, 1],
                required: true,
                allowedTypes: [
                    {
                        id: 'report-key-attribute-selector',
                        type: 'key-value',
                    },
                ]
            },
            {
                argIndexes: [2],
                label: 'Value',
                required: true,
                allowedTypes: [
                    {
                        id: 'text-input',
                        type: 'str',
                    },
                    {
                        id: 'number-input',
                        type: 'num',
                    },
                    {
                        id: 'date-input',
                        type: 'date',
                    },
                    {
                        id: 'exp-slot',
                        type: 'expression',
                        allowedExpressionTypes: ['str', 'num']
                    }
                ]
            },
            {
                label: 'Interpret data as (optional)',
                required: false,
                argIndexes: [3],
                allowedTypes: [
                    {
                        id: 'dtype-selector',
                        type: 'select',
                        options: [
                            //{ key: '', label: 'Translation key' },
                            { key: 'date', label: 'Date' },
                            { key: 'float', label: 'Float' },
                            { key: 'int', label: 'Integer' },
                            { key: 'rawMessage', label: 'Raw message' },
                            { key: 'keyList', label: 'List of keys' },
                        ]
                    }
                ]
            }
        ],
        defaultValue: {
            dtype: 'exp',
            exp: {
                name: 'UPDATE_REPORT_DATA',
                data: [],
                metadata: {
                    slotTypes: ['report-key-attribute-selector']
                }
            }
        }
    },
    {
        id: 'REMOVE_REPORT_DATA',
        label: 'Remove report data by attribute key',
        returnType: 'action',
        icon: "circle-slash",
        color: 'blue',
        categories: ['participant-state-actions'],
        slots: [
            {
                label: '',
                required: true,
                allowedTypes: [
                    {
                        id: 'report-key-attribute-selector',
                        type: 'key-value',
                    }
                ]
            }
        ],
        defaultValue: {
            dtype: 'exp',
            exp: {
                name: 'REMOVE_REPORT_DATA',
                data: [],
                metadata: {
                    slotTypes: ['report-key-attribute-selector']
                }
            }
        },
    },
]

const advancedExpressions: ExpressionDef[] = [
    {
        id: 'externalEventEval',
        categories: ['advanced'],
        label: 'Use external serivce to evaluate event data',
        returnType: 'str',
        icon: 'code',
        color: 'lime',
        slots: [
            {
                label: '',
                required: true,
                allowedTypes: [
                    {
                        id: 'external-event-handler-selector',
                        type: 'key-value',
                    }
                ]
            },
        ],
        defaultValue: {
            dtype: 'exp',
            exp: {
                name: 'externalEventEval',
                data: [],
                metadata: {
                    slotTypes: ['external-event-handler-selector']
                }
            },
        }
    },
    {
        id: 'externalEventEvalFloat',
        categories: ['advanced'],
        label: 'Use external serivce to evaluate event data (return float)',
        returnType: 'num',
        icon: 'code',
        color: 'lime',
        isTemplateFor: 'externalEventEval',
        slots: [],
        defaultValue: {
            dtype: 'exp',
            exp: {
                name: 'externalEventEval',
                returnType: 'float',
                data: [],
                metadata: {
                    slotTypes: ['external-event-handler-selector']
                }
            },
        }
    },
    {
        id: 'generateRandomNumber',
        categories: ['advanced'],
        label: 'Generate random number',
        returnType: 'num',
        icon: 'function',
        color: 'lime',
        slots: [
            {
                label: 'Min',
                required: true,
                allowedTypes: [
                    {
                        id: 'number-input',
                        type: 'num',
                    },
                    {
                        id: 'exp-slot',
                        type: 'expression',
                        allowedExpressionTypes: ['num']
                    }
                ]
            },
            {
                label: 'Max',
                required: true,
                allowedTypes: [
                    {
                        id: 'number-input',
                        type: 'num',
                    },
                    {
                        id: 'exp-slot',
                        type: 'expression',
                        allowedExpressionTypes: ['num']
                    }
                ]
            }
        ],
        defaultValue: {
            dtype: 'exp',
            exp: {
                name: 'generateRandomNumber',
                data: [
                    {
                        dtype: 'num',
                        num: 0
                    },
                    {
                        dtype: 'num',
                        num: 100
                    }
                ],
                returnType: 'float',
            },
        }
    }
]



const eventCheckers: ExpressionDef[] = [
    // event type
    {
        id: 'checkEventType',
        categories: ['event-checkers'],
        label: 'Check event type',
        returnType: 'boolean',
        icon: 'split',
        color: 'blue',
        slots: [
            {
                label: 'Event type',
                required: true,
                allowedTypes: [
                    {
                        id: 'event-type-selector',
                        type: 'select',
                        options: ['ENTER', 'SUBMIT', 'TIMER', 'MERGE', 'CUSTOM', 'LEAVE'].map(t => {
                            return {
                                key: t,
                                label: t
                            }
                        }),
                    },
                ]
            }
        ],
        defaultValue: {
            dtype: 'exp',
            exp: {
                name: 'checkEventType',
                data: [
                    {
                        dtype: 'str',
                        str: ''
                    },
                ]
            },
        }
    },
    // survey submission
    {
        id: 'checkSurveyResponseKey',
        categories: ['event-checkers'],
        label: 'Current event is submission of survey with key',
        returnType: 'boolean',
        icon: 'split',
        color: 'blue',
        slots: [
            {
                label: 'Key',
                required: true,
                allowedTypes: [
                    {
                        id: 'survey-key-selector',
                        type: 'list-selector',
                    },
                    {
                        id: 'text-input',
                        type: 'str',
                    },

                ]
            }
        ],
        defaultValue: {
            dtype: 'exp',
            exp: {
                name: 'checkSurveyResponseKey',
                data: [
                    {
                        dtype: 'str',
                        str: ''
                    },
                ],
                metadata: {
                    slotTypes: ['survey-key-selector']
                }
            },
        }
    },
    // custom events
    {
        id: 'checkEventKey',
        categories: ['event-checkers'],
        label: 'Custom event with key',
        returnType: 'boolean',
        icon: 'split',
        color: 'blue',
        slots: [
            {
                label: 'Key',
                required: true,
                allowedTypes: [
                    {
                        id: 'custom-event-key-selector',
                        type: 'list-selector',
                    },
                    {
                        id: 'text-input',
                        type: 'str',
                    },

                ]
            }
        ],
        defaultValue: {
            dtype: 'exp',
            exp: {
                name: 'checkEventKey',
                data: [
                    {
                        dtype: 'str',
                        str: ''
                    },
                ],
                metadata: {
                    slotTypes: ['custom-event-key-selector']
                }
            },
        }
    },
    {
        id: 'hasEventPayload',
        categories: ['event-checkers'],
        label: 'Has (any) event payload',
        returnType: 'boolean',
        icon: 'split',
        color: 'blue',
        slots: [
        ],
        defaultValue: {
            dtype: 'exp',
            exp: {
                name: 'hasEventPayload',
                data: [
                ],
            },
        }
    },
    {
        id: 'hasEventPayloadKey',
        categories: ['event-checkers'],
        label: 'Has event payload with key',
        returnType: 'boolean',
        icon: 'split',
        color: 'blue',
        slots: [
            {
                label: 'Key',
                required: true,
                allowedTypes: [
                    {
                        id: 'text-input',
                        type: 'str',
                    },
                ]
            }
        ],
        defaultValue: {
            dtype: 'exp',
            exp: {
                name: 'hasEventPayloadKey',
                data: [
                    {
                        dtype: 'str',
                        str: ''
                    },
                ],
            },
        }
    },
    {
        id: 'hasEventPayloadKeyWithValue',
        categories: ['event-checkers'],
        label: 'Has event payload with key and value',
        returnType: 'boolean',
        icon: 'split',
        color: 'blue',
        slots: [
            {
                label: 'Key',
                required: true,
                allowedTypes: [
                    {
                        id: 'text-input',
                        type: 'str',
                    },
                ]
            },
            {
                label: 'Value',
                required: true,
                allowedTypes: [
                    {
                        id: 'text-input',
                        type: 'str',
                    },
                    {
                        id: 'exp-slot',
                        type: 'expression',
                        allowedExpressionTypes: ['str']
                    }
                ]
            }
        ],
        defaultValue: {
            dtype: 'exp',
            exp: {
                name: 'hasEventPayloadKeyWithValue',
                data: [
                    {
                        dtype: 'str',
                        str: ''
                    },
                    {
                        dtype: 'str',
                        str: ''
                    },
                ],
            },
        }
    },
    {
        id: 'getEventPayloadValueAsStr',
        categories: ['event-checkers'],
        label: 'Get event payload value as string',
        returnType: 'str',
        icon: 'split',
        color: 'blue',
        slots: [
            {
                label: 'Key',
                required: true,
                allowedTypes: [
                    {
                        id: 'text-input',
                        type: 'str',
                    },
                ]
            }
        ],
        defaultValue: {
            dtype: 'exp',
            exp: {
                name: 'getEventPayloadValueAsStr',
                data: [
                    {
                        dtype: 'str',
                        str: ''
                    },
                ],
                returnType: 'string',
            },

        }
    },
    {
        id: 'getEventPayloadValueAsNum',
        categories: ['event-checkers'],
        label: 'Get event payload value as number',
        returnType: 'num',
        icon: 'split',
        color: 'blue',
        slots: [
            {
                label: 'Key',
                required: true,
                allowedTypes: [
                    {
                        id: 'text-input',
                        type: 'str',
                    },
                ]
            }
        ],
        defaultValue: {
            dtype: 'exp',
            exp: {
                name: 'getEventPayloadValueAsNum',
                data: [
                    {
                        dtype: 'str',
                        str: ''
                    },
                ],
                returnType: 'float',
            },
        }
    },
]

const logicAndComparisionExpressions: ExpressionDef[] = [
    ...comparisonOperators,
    ...logicalOperators,
    {
        id: 'sum',
        categories: ['mathematical-operators'],
        label: 'Sum',
        returnType: 'num',
        icon: 'function',
        color: 'lime',
        slots: [
            {
                label: 'Values',
                required: true,
                isListSlot: true,
                allowedTypes: [
                    {
                        id: 'number-input',
                        type: 'num',
                    },
                    {
                        id: 'exp-slot',
                        type: 'expression',
                        allowedExpressionTypes: ['num']
                    }
                ]

            }
        ],
        defaultValue: {
            dtype: 'exp',
            exp: {
                name: 'sum',
                data: [
                ],
                returnType: 'float',
            }
        }
    },
    {
        id: 'neg',
        categories: ['mathematical-operators'],
        label: 'Negation',
        returnType: 'num',
        icon: 'function',
        color: 'lime',
        slots: [
            {
                label: 'Value',
                required: true,
                allowedTypes: [
                    {
                        id: 'number-input',
                        type: 'num',
                    },
                    {
                        id: 'exp-slot',
                        type: 'expression',
                        allowedExpressionTypes: ['num']
                    }
                ]
            }
        ],
        defaultValue: {
            dtype: 'exp',
            exp: {
                name: 'neg',
                data: [
                ],
                returnType: 'float',

            },
        }
    }
]

/*
  getISOWeekForTs,
  getTsForNextStartOfMonth,
  getTsForNextISOWeek,
  generateRandomNumber: (min: number, max: number) => generateExpression('generateRandomNumber', undefined, min, max),
*/


export const studyEngineRegistry: ExpressionDef[] = [
    ...controlFlowOperators,
    ...miscExpressions,
    ...generalStudyActions,
    ...participantStateActions,
    ...advancedExpressions,
    ...logicAndComparisionExpressions,
    ...eventCheckers,
]


/*
  // Response checkers

  responseHasKeysAny,
  responseHasOnlyKeysOtherThan,
  getResponseValueAsNum,
  getResponseValueAsStr,
  getSelectedKeys,
  hasResponseKey,
  hasResponseKeyWithValue,
  countResponseItems,
  isStudyCodePresent,
  // Old responses
  checkConditionForOldResponses,
  // Event payload methods:

  // Participant state:
  participantState: {
    getStudyEntryTime,
    hasSurveyKeyAssigned,
    getSurveyKeyAssignedFrom,
    getSurveyKeyAssignedUntil,
    hasStudyStatus,
    hasParticipantFlagKeyAndValue,
    hasParticipantFlagKey,
    linkingCode: {
      has: hasLinkingCode,
      get: getLinkingCode,
    },
    getParticipantFlagValue,
    getParticipantFlagValueAsNum,
    getLastSubmissionDate,
    lastSubmissionDateOlderThan,
    hasMessageTypeAssigned,
    getMessageNextTime,
    incomingParticipantState: {
      // for merge event
      getStudyEntryTime: getStudyEntryTimeForIncoming,
      hasSurveyKeyAssigned: hasSurveyKeyAssignedForIncoming,
      getSurveyKeyAssignedFrom: getSurveyKeyAssignedFromForIncoming,
      getSurveyKeyAssignedUntil: getSurveyKeyAssignedUntilForIncoming,
      hasStudyStatus: hasStudyStatusForIncoming,
      hasParticipantFlagKeyAndValue: hasParticipantFlagKeyAndValueForIncoming,
      hasParticipantFlagKey: hasParticipantFlagKeyForIncoming,
      getParticipantFlagValue: getParticipantFlagValueForIncoming,
      getLastSubmissionDate: getLastSubmissionDateForIncoming,
      lastSubmissionDateOlderThan: lastSubmissionDateOlderThanForIncoming,
      hasMessageTypeAssigned: hasMessageTypeAssignedForIncoming,
      getMessageNextTime: getMessageNextTimeForIncoming,
    }
  },


}


export const StudyEngine = {
  ...NativeStudyEngineExpressions,
  singleChoice: {
    any: singleChoiceOptionsSelected,
    none: singleChoiceOnlyOtherOptionSelected
  },
  multipleChoice: {
    any: multipleChoiceOptionsSelected,
    none: multipleChoiceOnlyOtherKeysSelected,
    all: multipleChoiceAllOfTheseSelected,
  },
  consent: {
    accepted: consentAcceptedCondition,
  },
  survey: {
    isActive: hasSurveyKeyActive,
    validFromOlderThan: hasSurveyKeyValidFromOlderThan,
    validUntilSoonerThan: hasSurveyKeyValidUntilSoonerThan,
  },
*/
