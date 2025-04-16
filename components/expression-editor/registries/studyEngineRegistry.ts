import { ExpressionDef, SlotInputDef } from "../utils";
import { logicalOperators, miscExpressions } from "./common";

export const studyEngineCategories = [
    {
        id: 'control-flow',
        label: 'Control flow'
    },
    {
        id: 'survey-submission-checkers',
        label: 'Survey submission methods',
    },
    {
        id: 'custom-event-checkers',
        label: 'Custom event methodes'
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
    }
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
]

/*

*/


/*
    // TODO: submission event
    checkSurveyResponseKey,


    TODO: custom event
    checkEventKey,
      eventPayload: {
        hasEventPayload,
        hasEventPayloadKey,
        hasEventPayloadKeyWithValue,
        getEventPayloadValueAsStr,
        getEventPayloadValueAsNum,
  },


  TODO: general
  checkEventType,
*/


export const studyEngineRegistry: ExpressionDef[] = [
    ...controlFlowOperators,
    ...logicalOperators,
    ...miscExpressions,
    ...generalStudyActions,
    ...participantStateActions,
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
  // logical and comparision
  eq,
  lt,
  lte,
  gt,
  gte,
  or,
  and,
  not,
  sum,
  neg,
  // Other
  timestampWithOffset,
  getISOWeekForTs,
  getTsForNextStartOfMonth,
  getTsForNextISOWeek,
  parseValueAsNum,
  generateRandomNumber: (min: number, max: number) => generateExpression('generateRandomNumber', undefined, min, max),
  externalEventEval,
}

export const StudyEngineActions = {
  participantActions: {
    reports: {
      init: INIT_REPORT,
      cancel: CANCEL_REPORT,
      updateData: UPDATE_REPORT_DATA,
      removeData: REMOVE_REPORT_DATA,
      // Extra methods:
      setReportIcon,
      setReportMessage,
      setReportSummary,
    },
    linkingCodes: {
      set: SET_LINKING_CODE,
      delete: DELETE_LINKING_CODE,
      drawFromStudyCodeList: DRAW_STUDY_CODE_AS_LINKING_CODE,
    },

    confidentialResponses: {
      removeByKey: REMOVE_CONFIDENTIAL_RESPONSE_BY_KEY,
      removeAll: REMOVE_ALL_CONFIDENTIAL_RESPONSES,
    },
    externalEventHandler: EXTERNAL_EVENT_HANDLER,
  },

}

export const StudyEngine = {
  ...NativeStudyEngineExpressions,
  ...StudyEngineActions,
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
