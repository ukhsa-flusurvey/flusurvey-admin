'use client';

import ExpressionEditor from '@/components/expression-editor/ExpressionEditor';
import { supportedBuiltInSlotTypes, testExpressionCategories, testServerExpressionRegistry } from '@/components/expression-editor/exampleRegistry';
import { ExpEditorContext, Expression } from '@/components/expression-editor/utils';
import React from 'react';
import { Toaster } from 'sonner';



const Page: React.FC = () => {
    const [expression, setExpression] = React.useState<
        Expression
    >({
        name: 'IF',
        data: [],
        // todo: test metadata
    });

    const testContext: ExpEditorContext = {
        participantFlags: {
            testFlagKey1: {
                values: ['testFlagValue1', 'testFlagValue2'],
                type: 'test1'
            },
            testFlagKey2: {
                values: ['yes', 'no'],
                type: 'test2'
            }
        },
        surveyKeys: [
            {
                key: 'testSurveyKey 1',
                label: 'Test survey 1',
                type: 'test1'
            },
            {
                key: 'testSurveyKey 2',
                label: 'Test survey 2',
                type: 'test2'
            }
        ]
    }

    return (
        <div>
            <main className="px-6">

                <div className="flex justify-start items-center p-6 h-full w-full overflow-x-scroll">
                    <Toaster />

                    <ExpressionEditor
                        expressionValue={expression}
                        context={testContext}
                        expRegistry={{
                            expressionDefs: testServerExpressionRegistry,
                            categories: testExpressionCategories,
                            builtInSlotTypes: supportedBuiltInSlotTypes,
                        }}
                        onChange={(newExpression) => {
                            console.log(newExpression)
                            setExpression({ ...newExpression })
                        }}
                    />
                </div>
            </main>
        </div>
    );
};

export default Page;
