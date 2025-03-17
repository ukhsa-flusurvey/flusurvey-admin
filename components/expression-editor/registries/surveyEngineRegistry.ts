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
        id: 'comparison',
        label: 'Comparison'
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
    },
    {
        id: 'advanced',
        label: 'Advanced'
    },
    {
        id: 'templates',
        label: 'Templates'
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
    {
        id: 'item-keys',
        type: 'list-selector',
        contextArrayKey: 'allItemKeys',
        label: 'Available item keys',
        icon: 'tag',
        color: 'green',
        categories: ['variables'],
    },
    ...slotKeyValueListSlotEditors
]

const advancedExpressions: ExpressionDef[] = [
    {
        id: 'isDefined',
        categories: ['advanced'],
        label: 'Is return value defined',
        returnType: 'boolean',
        icon: 'blocks',
        slots: [
            {
                label: 'Value',
                required: true,
                allowedTypes: [
                    {
                        id: 'exp-slot',
                        type: 'expression',
                        allowedExpressionTypes: ['str', 'num', 'boolean']
                    }
                ]
            }
        ],
        defaultValue: {
            dtype: 'exp',
            exp: {
                name: 'isDefined',
                data: []
            }
        }
    },

    {
        id: 'getAttribute',
        categories: ['advanced'],
        label: 'Get attribute',
        returnType: 'str',
        icon: 'blocks',
        slots: [
            {
                label: 'Value',
                required: true,
                allowedTypes: [
                    {
                        id: 'exp-slot',
                        type: 'expression',
                        allowedExpressionTypes: ['object', 'str']
                    }
                ]
            },
            {
                label: 'Attribute',
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
                name: 'getAttribute',
                data: [
                    undefined,
                    {
                        dtype: 'str',
                        str: ''
                    }
                ]
            }
        }
    },
    {
        id: 'getContext',
        categories: ['advanced'],
        label: 'Get context',
        returnType: 'object',
        icon: 'blocks',
        slots: [],
        defaultValue: {
            dtype: 'exp',
            exp: {
                name: 'getContext',
                data: []
            }
        }
    },

    {
        id: 'isLoggedIn',
        categories: ['advanced'],
        label: 'Is user logged in',
        returnType: 'boolean',
        icon: 'blocks',
        slots: [],
        defaultValue: {
            dtype: 'exp',
            exp: {
                name: 'and',
                data: [
                    {
                        dtype: 'exp',
                        exp: {
                            name: 'isDefined',
                            data: [
                                {
                                    dtype: 'exp',
                                    exp: {
                                        name: 'getAttribute',
                                        data: [
                                            {
                                                dtype: 'exp',
                                                exp: {
                                                    name: 'getContext',
                                                }
                                            },
                                            {
                                                dtype: 'str',
                                                str: 'isLoggedIn'
                                            }
                                        ]
                                    }
                                }
                            ]
                        }
                    },
                    {
                        dtype: 'exp',
                        exp: {
                            name: 'getAttribute',
                            data: [
                                {
                                    dtype: 'exp',
                                    exp: {
                                        name: 'getContext',
                                    }
                                },
                                {
                                    dtype: 'str',
                                    str: 'isLoggedIn'
                                }
                            ]
                        }
                    }
                ]
            }
        },
        isTemplateFor: 'and'
    }
]


const comparisonOperators: ExpressionDef[] = [
    {
        categories: ['comparison'],
        id: 'eq',
        label: 'Equals (L == R)',
        returnType: 'boolean',
        icon: 'code',
        slots: [
            {
                label: 'Left side',
                required: true,
                allowedTypes: [
                    {
                        id: 'number-input',
                        type: 'num',
                    },
                    {
                        id: 'text-input',
                        type: 'str',
                    },
                    {
                        id: 'exp-slot',
                        type: 'expression',
                        allowedExpressionTypes: ['num', 'str']
                    }
                ]
            },
            {
                label: 'Right side',
                required: true,
                allowedTypes: [
                    {
                        id: 'number-input',
                        type: 'num',
                    },
                    {
                        id: 'text-input',
                        type: 'str',
                    },
                    {
                        id: 'exp-slot',
                        type: 'expression',
                        allowedExpressionTypes: ['num', 'str']
                    }
                ]
            }
        ],
        defaultValue: {
            dtype: 'exp',
            exp: {
                name: 'eq',
                data: []
            }
        }
    },
    {
        categories: ['comparison'],
        id: 'lte',
        label: 'Less than or equal (L <= R)',
        returnType: 'boolean',
        icon: 'code',
        slots: [
            {
                label: 'Left side',
                required: true,
                allowedTypes: [
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
                        allowedExpressionTypes: ['num']
                    }
                ]
            },
            {
                label: 'Right side',
                required: true,
                allowedTypes: [
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
                        allowedExpressionTypes: ['num']
                    }
                ]
            }
        ],
        defaultValue: {
            dtype: 'exp',
            exp: {
                name: 'lte',
                data: [
                    {
                        dtype: 'num',
                        num: 0
                    },
                    {
                        dtype: 'num',
                        num: 1
                    }
                ]
            }
        }
    },
    {
        categories: ['comparison'],
        id: 'lt',
        label: 'Less than (L < R)',
        returnType: 'boolean',
        icon: 'code',
        slots: [
            {
                label: 'Left side',
                required: true,
                allowedTypes: [
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
                        allowedExpressionTypes: ['num']
                    }
                ]
            },
            {
                label: 'Right side',
                required: true,
                allowedTypes: [
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
                        allowedExpressionTypes: ['num']
                    }
                ]
            }
        ],
        defaultValue: {
            dtype: 'exp',
            exp: {
                name: 'lt',
                data: [
                    {
                        dtype: 'num',
                        num: 0
                    },
                    {
                        dtype: 'num',
                        num: 1
                    }
                ]
            }
        }
    },
    {
        categories: ['comparison'],
        id: 'gte',
        label: 'Greater than or equal (L >= R)',
        returnType: 'boolean',
        icon: 'code',
        slots: [
            {
                label: 'Left side',
                required: true,
                allowedTypes: [
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
                        allowedExpressionTypes: ['num']
                    }
                ]
            },
            {
                label: 'Right side',
                required: true,
                allowedTypes: [
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
                        allowedExpressionTypes: ['num']
                    }
                ]
            }
        ],
        defaultValue: {
            dtype: 'exp',
            exp: {
                name: 'gte',
                data: [
                    {
                        dtype: 'num',
                        num: 1
                    },
                    {
                        dtype: 'num',
                        num: 0
                    }
                ]
            }
        }
    },
    {
        categories: ['comparison'],
        id: 'gt',
        label: 'Greater than (L > R)',
        returnType: 'boolean',
        icon: 'code',
        slots: [
            {
                label: 'Left side',
                required: true,
                allowedTypes: [
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
                        allowedExpressionTypes: ['num']
                    }
                ]
            },
            {
                label: 'Right side',
                required: true,
                allowedTypes: [
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
                        allowedExpressionTypes: ['num']
                    }
                ]
            }
        ],
        defaultValue: {
            dtype: 'exp',
            exp: {
                name: 'gt',
                data: [
                    {
                        dtype: 'num',
                        num: 1
                    },
                    {
                        dtype: 'num',
                        num: 0
                    }
                ]
            }
        }
    },

]



const responseDependencies: ExpressionDef[] = [
    {
        id: 'hasResponse',
        label: 'A specific response is present',
        returnType: 'boolean',
        slots: [
            {
                label: 'Item key',
                required: true,
                allowedTypes: [
                    { id: 'item-keys', type: 'list-selector' },
                    { id: 'text-input', type: 'str', },
                    { id: 'exp-slot', type: 'expression', allowedExpressionTypes: ['str'] }
                ],
            },
            {
                label: 'Response slot key',
                required: true,
                allowedTypes: [
                    { id: 'text-input', type: 'str', },
                    { id: 'exp-slot', type: 'expression', allowedExpressionTypes: ['str'] }
                ],
            }
        ],
        categories: ['response-dependencies'],
        defaultValue: {
            dtype: 'exp',
            exp: {
                name: 'hasResponse',
                data: [
                    {
                        dtype: 'str',
                        str: '',
                    },
                    {
                        dtype: 'str',
                        str: 'rg.',
                    },
                ]
            }
        }
    },
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

        ],
        defaultValue: {
            dtype: 'exp',
            exp: {
                name: 'responseHasKeysAny',
                data: []
            }
        }
    },


    // Templates:
    {
        categories: ['templates'],
        id: 'consent-given',
        label: 'Consent question accepted',
        returnType: 'boolean',
        icon: 'signpost',
        slots: [],
        defaultValue: {
            dtype: 'exp',
            exp: {
                name: 'hasResponse',
                data: [
                    {
                        dtype: 'str',
                        str: ''
                    },
                    {
                        dtype: 'str',
                        str: 'rg.con'
                    }
                ]
            }
        },
        isTemplateFor: 'hasResponse'
    }
]


export const surveyEngineRegistry: ExpressionDef[] = [
    ...logicalOperators,
    ...miscExpressions,
    ...responseDependencies,
    ...comparisonOperators,
    ...advancedExpressions,
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

/*
parseValueAsNum,

    getResponseValueAsNum,
    getResponseValueAsStr,
    checkResponseValueWithRegex,

    responseHasKeysAny,
    responseHasKeysAll,
    responseHasOnlyKeysOtherThan,

    getSurveyItemValidation,

    dateResponseDiffFromNow,
getSecondsSince,
    timestampWithOffset,

    countResponseItems,



// Other

    singleChoice: {
    any: singleChoiceOptionsSelected,
        none: singleChoiceOnlyOtherOptionSelected,
            getDateValue: singleChoiceGetNumOptionValue,
                getNumValue: singleChoiceGetNumOptionValue,
                    regexCheck: singleChoiceTextInputRegexCheck,
  },
multipleChoice: {
    any: multipleChoiceOptionsSelected,
        none: multipleChoiceOnlyOtherKeysSelected,
            all: multipleChoiceAllOfTheseSelected,
                selectionCount: multipleChoiceSelectionCount,
                    getDateValue: multipleChoiceGetNumOptionValue,
                        getNumValue: multipleChoiceGetNumOptionValue,
                            regexCheck: mulitpleChoiceTextInputRegexCheck,
  },
consentQuestion: {
    accepted: consentAcceptedCondition,
  },
textInput: {
    regexCheck: textInputRegexCheck,
  },
multilineTextInput: {
    regexCheck: multilineTextInputRegexCheck,
  },
datePicker: {
    get: getDatePickerResponseValue,
  },

  participantFlags: {
    hasKey: hasParticipantFlagKey,
        hasKeyAndValue: hasParticipantFlagKeyAndValue,
            getAsNum: parseParticipantFlagAsNum,
  },


*/
