'use client';

import ExpressionEditor from '@/components/expression-editor/ExpressionEditor';
import { supportedBuiltInSlotTypes, testExpressionCategories, testServerExpressionRegistry } from '@/components/expression-editor/exampleRegistry';
import { ExpEditorContext } from '@/components/expression-editor/utils';
import React from 'react';


interface PageProps {
}

const Page: React.FC<PageProps> = (props) => {
    const [expression, setExpression] = React.useState<any>({
        name: 'IF',
        data: [],
        // todo: test metadata
    });

    const testContext: ExpEditorContext = {
        participantFlag: {
            testFlagKey1: {
                value: 'testFlagValue1',
                type: 'test1'
            },
            testFlagKey2: {
                value: 'testFlagValue2',
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
            <main className="px-unit-lg">

                <div className="flex justify-start items-center p-unit-lg h-full w-full">

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
