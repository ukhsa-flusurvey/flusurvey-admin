'use client';

import ExpressionEditor from '@/components/expression-editor/ExpressionEditor';
import { supportedBuiltInSlotTypes, testExpressionCategories, testServerExpressionRegistry } from '@/components/expression-editor/exampleRegistry';
import { ExpEditorContext } from '@/components/expression-editor/utils';
import { Toaster } from '@/components/ui/toaster';
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
            <main className="px-unit-lg">

                <div className="flex justify-start items-center p-unit-lg h-full w-full overflow-x-scroll">
                    <Toaster></Toaster>

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
