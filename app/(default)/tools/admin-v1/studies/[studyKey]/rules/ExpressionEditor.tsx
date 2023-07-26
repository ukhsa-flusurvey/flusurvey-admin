import React from 'react';
import ExpressionGraph from './ExpressionGraph';
import NodeBrowser from './NodeBrowser';

interface ExpressionEditorProps {
}

const ExpressionEditor: React.FC<ExpressionEditorProps> = (props) => {
    return (
        <div className="bg-white flex flex-col h-full ">
            <div className='p-2 shadow-sm border-b border-gray-400'>
                Node Editor
            </div>
            <div className='grow flex overflow-y-hidden'>
                <div className="grow h-full">
                    <ExpressionGraph />
                </div>
                <div className='border-s border-gray-400'>
                    <NodeBrowser
                        nodes={[
                            {
                                id: 'numberConst',
                                label: 'number',
                                description: 'Define a numerical constant',
                                groupIds: ['values'],
                                meta: {
                                    expName: '',
                                    description: 'Use a hardcoded number in the expression',
                                },
                                type: 'constantNum'
                            },
                            {
                                id: 'stringConst',
                                label: 'string',
                                description: 'Define a string constant',
                                groupIds: ['values'],
                                meta: {
                                    expName: '',
                                    description: 'Use a hardcoded string in the expression',
                                },
                                type: 'constantStr'
                            },
                            {
                                id: 'timestampWithOffset',
                                label: 'timestamp',
                                description: '```t = reference + offset```\n\nIf no reference is provided, the current time is used',
                                groupIds: ['values'],
                                meta: {
                                    expName: 'timestampWithOffset',
                                    description: 'Unix timestamp, date, time',
                                },
                                type: 'dynamicValue',
                            },
                            {
                                id: 'ADD_NEW_SURVEY',
                                label: 'assign survey',
                                description: 'Add a survey to the assignment queue',
                                groupIds: ['participantAction', 'values'],
                                meta: {
                                    expName: 'ADD_NEW_SURVEY',
                                    description: 'Schedule survey with start, end, category',
                                },
                                type: 'action'
                            },
                            {
                                id: 'and',
                                label: 'and',
                                description: 'Logical AND\n\nReturns true if all arguments are true',
                                groupIds: ['logical'],
                                meta: {
                                    expName: 'and',
                                    description: '',
                                },
                                type: 'logical'
                            },
                            {
                                id: 'or',
                                label: 'or',
                                description: 'Logical OR\n\nReturns true if any argument is true',
                                groupIds: ['logical'],
                                meta: {
                                    expName: 'or',
                                    description: '',
                                },
                                type: 'logical'
                            },
                        ]}
                        groups={[
                            { id: 'values', label: 'Values' },
                            { id: 'logical', label: 'Logical Operators' },
                            { id: 'participantAction', label: 'Change Participant State' },
                        ]}
                    />
                </div>
            </div>
        </div>
    );
};

export default ExpressionEditor;
