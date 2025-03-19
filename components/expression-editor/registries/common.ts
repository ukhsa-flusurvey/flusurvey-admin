import { ExpressionDef } from "../utils";

export const miscExpressions: ExpressionDef[] = [
    {
        categories: ['misc'],
        id: 'timestampWithOffset',
        label: 'GET TIMESTAMP',
        returnType: 'num',
        icon: 'calendar',
        color: 'lime',
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
        ],
        defaultValue: {
            dtype: 'exp',
            exp: {
                name: 'timestampWithOffset',
                data: [
                    {
                        dtype: 'num',
                        num: 0
                    }
                ],
                metadata: {
                    slotTypes: ['time-delta-picker']
                }
            }
        }
    },

    {
        id: 'parseValueAsNum',
        categories: ['misc'],
        label: 'Parse value as number',
        returnType: 'num',
        icon: 'function',
        color: 'lime',
        slots: [
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
                name: 'parseValueAsNum',
                data: [],
                returnType: 'float'
            }
        }
    },
]



export const logicalOperators: ExpressionDef[] = [
    {
        categories: ['logical'],
        id: 'and',
        label: 'and',
        returnType: 'boolean',
        icon: 'brackets',
        color: 'blue',
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
        ],
        defaultValue: {
            dtype: 'exp',
            exp: {
                name: 'and',
                data: []
            }
        }
    },
    {
        categories: ['logical'],
        id: 'or',
        label: 'or',
        returnType: 'boolean',
        icon: 'braces',
        color: 'blue',
        slots: [
            {
                label: 'if any true:',
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
        ],
        defaultValue: {
            dtype: 'exp',
            exp: {
                name: 'or',
                data: []
            }
        }
    },
    {
        categories: ['logical'],
        id: 'not',
        label: 'not',
        returnType: 'boolean',
        icon: 'circle-slash',
        color: 'orange',
        slots: [
            {
                label: 'if not true:',
                required: true,
                allowedTypes: [
                    {
                        id: 'exp-slot',
                        type: 'expression',
                        allowedExpressionTypes: ['boolean']
                    }
                ]
            }
        ],
        defaultValue: {
            dtype: 'exp',
            exp: {
                name: 'not',
                data: []
            }
        }
    }
]
