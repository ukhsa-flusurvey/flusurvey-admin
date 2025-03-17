import { ExpressionDef } from "../utils";

export const miscExpressions: ExpressionDef[] = [
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
    }
]
