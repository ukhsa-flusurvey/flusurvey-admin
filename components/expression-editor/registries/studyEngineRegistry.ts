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
    updateStudyStatus: UPDATE_STUDY_STATUS,
    startNewStudySession: START_NEW_STUDY_SESSION,
    updateFlag: UPDATE_FLAG,
    removeFlag: REMOVE_FLAG,
    assignedSurveys: {
      add: ADD_NEW_SURVEY,
      removeAll: REMOVE_ALL_SURVEYS,
      remove: REMOVE_SURVEY_BY_KEY,
    },
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
    messages: {
      add: ADD_MESSAGE,
      removeAll: REMOVE_ALL_MESSAGES,
      remove: REMOVE_MESSAGES_BY_TYPE,
    },
    confidentialResponses: {
      removeByKey: REMOVE_CONFIDENTIAL_RESPONSE_BY_KEY,
      removeAll: REMOVE_ALL_CONFIDENTIAL_RESPONSES,
    },
    externalEventHandler: EXTERNAL_EVENT_HANDLER,
    // Extra methods:
    stopParticipation,
    finishParticipation,
  },
  removeStudyCode: REMOVE_STUDY_CODE,
  notifyResearcher: NOTIFY_RESEARCHER,
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
