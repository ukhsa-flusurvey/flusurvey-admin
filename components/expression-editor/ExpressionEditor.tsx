'use client'
import React, { useState } from 'react';


import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { ExpEditorContext, Expression, ExpressionArg, ExpressionCategory, ExpressionDef, SelectSlotType, SlotInputDef, lookupExpressionDef } from './utils';
import ExpressionIcon from './ExpressionIcon';
import EmptySlot from './EmptySlot';
import SlotLabel from './SlotLabel';
import { Expression as CaseExpression } from 'survey-engine/data_types';
import ExpressionPreview from './ExpressionPreview';



interface ExpressionEditorProps {
    expressionValue: Expression;
    context?: ExpEditorContext;
    expRegistry: {
        expressionDefs: ExpressionDef[],
        categories: ExpressionCategory[],
        builtInSlotTypes: SlotInputDef[],
    };
    onChange?: (expression: Expression) => void;
    depth?: number;
}


const ExpressionEditor: React.FC<ExpressionEditorProps> = (props) => {
    const [hideSlotContent, setHideSlotContent] = useState<Array<number>>([]);

    const expressionDef = lookupExpressionDef(props.expressionValue.name, props.expRegistry.expressionDefs);


    if (!expressionDef) {
        return (
            <div>
                <p>Expression not found: {props.expressionValue.name}</p>
            </div>
        )
    }


    const renderedSlots = <div className='space-y-4'>
        {expressionDef.slots.map((slotDef, index) => {

            const isListSlot = slotDef.isListSlot || false;
            if (isListSlot) {
                const currentArgValues: Array<ExpressionArg | undefined> = []
                if (props.expressionValue.data && props.expressionValue.data.length > 0) {
                    currentArgValues.push(...props.expressionValue.data.slice(index))
                }
                return <div key={index}>
                    todo: list item
                </div>
            }

            const currentSlotTypes = props.expressionValue.metadata?.slotTypes || []

            const isSimpleSelect = slotDef.allowedTypes?.length === 1 && slotDef.allowedTypes[0].type === 'select';

            const isDefined = currentSlotTypes.at(index) !== undefined;

            if (!isDefined && !isSimpleSelect) {
                return <EmptySlot
                    key={index}
                    slotDef={slotDef}
                    expRegistry={props.expRegistry}
                    onSelect={(slotTypeId) => {
                        const currentSlotTypes = props.expressionValue.metadata?.slotTypes || []
                        if (currentSlotTypes.length < index) {
                            currentSlotTypes.fill(undefined, currentSlotTypes.length, index)
                        }

                        currentSlotTypes[index] = slotTypeId;
                        props.onChange?.({
                            ...props.expressionValue,
                            metadata: {
                                ...props.expressionValue.metadata,
                                slotTypes: currentSlotTypes
                            }
                        })
                    }}
                />
            } else {
                // TODO: extract values for current slot type
                // slotDef.argIndexes !== undefined; otherwise use simply list index where we are



                if (isSimpleSelect) {
                    let currentIndex = index;
                    if (slotDef.argIndexes !== undefined && slotDef.argIndexes.length > 0) {
                        currentIndex = slotDef.argIndexes[0];
                    }

                    const currentArgValue = props.expressionValue.data?.at(currentIndex);
                    const options = (slotDef.allowedTypes?.at(0) as SelectSlotType).options || [];
                    return <div key={index}>
                        <SlotLabel label={slotDef.label} required={slotDef.required} />
                        <Select
                            value={currentArgValue?.str || ''}
                            onValueChange={(value) => {
                                // TODO:
                                console.log(value)
                                const currentData = props.expressionValue.data || [];
                                if (currentData.length < index) {
                                    currentData.fill(undefined, currentData.length, index)
                                }
                                currentData[index] = {
                                    str: value,
                                    dtype: 'str'
                                }
                                props.onChange?.({
                                    ...props.expressionValue,
                                    data: currentData
                                })
                            }}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select a value" />
                            </SelectTrigger>
                            <SelectContent>
                                {options?.map((option) => {
                                    return <SelectItem key={option.key} value={option.key}>{option.label}</SelectItem>
                                })}
                            </SelectContent>
                        </Select>
                    </div>
                }
                // TODO: extract values for current slot type
                const currentSlotType = currentSlotTypes.at(index) || '';
                const expressionDef = props.expRegistry.expressionDefs.find((expDef) => expDef.id === currentSlotType)
                const isExpression = expressionDef !== undefined;

                if (!isExpression) {
                    return <div key={index}>
                        <SlotLabel label={slotDef.label} required={slotDef.required} />
                        <div className={cn('border border-slate-200 rounded-md py-2 px-4')}>
                            <p>todo: use current built-in type template for {currentSlotType}</p>
                        </div>
                    </div>
                }


                let currentIndex = index;
                if (slotDef.argIndexes !== undefined && slotDef.argIndexes.length > 0) {
                    currentIndex = slotDef.argIndexes[0];
                }

                const currentArgValue = props.expressionValue.data?.at(currentIndex);
                let currentExpression: CaseExpression;
                if (currentArgValue?.dtype === 'exp' && currentArgValue.exp !== undefined) {
                    currentExpression = currentArgValue.exp;
                } else {
                    // TODO: create empty expression
                    currentExpression = { name: expressionDef.id }
                }

                console.log(hideSlotContent)
                const isHidden = hideSlotContent.includes(index);
                console.log(isHidden)

                return <div key={index}>
                    <SlotLabel label={slotDef.label} required={slotDef.required}
                        isHidden={isHidden}
                        toggleHide={() => {
                            console.log('toggle hide')
                            if (isHidden) {
                                setHideSlotContent(prev => prev.filter((i) => i !== index))
                            } else {
                                setHideSlotContent(prev => { return [...prev, index] })
                            }
                        }}
                    />

                    {isHidden ? <ExpressionPreview
                        expressionValue={currentExpression}
                        expRegistry={props.expRegistry}
                        depth={(props.depth || 0) + 1}
                    />
                        : <div className={cn('border border-slate-300 bg-slate-100 rounded-md overflow-hidden', {
                            'bg-slate-50': (props.depth || 0) % 2 === 0,
                        })}>
                            <ExpressionEditor
                                expRegistry={props.expRegistry}
                                expressionValue={currentExpression}
                                depth={(props.depth || 0) + 1}
                                context={props.context}
                                onChange={(newExpression) => {
                                    const currentData = props.expressionValue.data || [];
                                    if (currentData.length < index) {
                                        currentData.fill(undefined, currentData.length, index)
                                    }
                                    currentData[index] = {
                                        exp: newExpression as CaseExpression,
                                        dtype: 'exp'
                                    }
                                    props.onChange?.({
                                        ...props.expressionValue,
                                        data: currentData
                                    })
                                }}
                            />
                        </div>
                    }
                </div>
            }
        })}
    </div>


    return (
        <div className={cn('flex flex-col gap-2 w-full ',
            {
                'bg-slate-50 rounded-md overflow-hidden': (props.depth || 0) === 0,
            }
        )}>
            <p className={cn(
                'font-bold text-[12px] text-slate-700 font-mono tracking-wide flex gap-2 items-center px-2 py-1 bg-slate-200',
                {
                    'bg-orange-100': expressionDef.color === 'orange',
                    'bg-blue-100': expressionDef.color === 'blue',
                })}>
                <ExpressionIcon icon={expressionDef.icon} color={expressionDef.color} />

                <span>
                    {expressionDef.label}
                </span>

            </p>
            <div className='pl-7 mt-0 pr-2 pb-2'>
                {renderedSlots}
            </div>
        </div>
    )

    /*

        if (listType) {
            if (props.slotValues.length === 0) {
                return (
                    <p>empty list type argument list</p>
                )
            }
            return (
                <div className='pl-[15px]'>
                    <ol className="relative border-l-2 border-default-300 space-y-[42px]">

                        <li className="ml-[36px] relative">
                            {isLast &&
                                <span className="absolute flex items-center justify-center w-6 h-full bg-white  -left-[40px] ring-white">
                                </span>
                            }

                            <span className="absolute flex items-center justify-center w-[20px] h-[20px] bg-default-300 rounded-full -left-[47px] top-[2px] ring-2 ring-white">

                            </span>

                            <div className='flex gap-20  relative border border-gray-100 p-2 rounded-md'>
                                test
                            </div>
                        </li>
                        <li className="ml-[36px] relative">

                            <span className="absolute flex items-center justify-center w-[20px] h-[20px] bg-default-300 rounded-full -left-[47px] top-[2px] ring-2 ring-white">

                            </span>

                            <div className='flex gap-20  relative border border-gray-100 p-2 rounded-md'>
                                <SlotTypeSelector
                                    groups={[
                                        {
                                            id: 'recents',
                                            label: 'Recent',
                                            slotTypes: [

                                            ]
                                        },
                                        {
                                            id: 'all',
                                            label: 'All',
                                            slotTypes: [
                                                {
                                                    id: 'test',
                                                    label: 'Test'
                                                },
                                                {
                                                    id: expressionDefs[0].name,
                                                    label: expressionDefs[0].label
                                                },
                                            ]
                                        }
                                    ]}
                                />
                            </div>
                        </li>
                        <li className="ml-[36px] relative">


                            <span className="absolute flex items-center justify-center w-[20px] h-[20px] bg-default-300 rounded-full -left-[47px] top-[2px] ring-2 ring-white">

                            </span>

                            <div className='flex gap-20  relative border border-gray-100 p-2 rounded-md'>
                                test
                            </div>
                        </li>
                        {props.test && <li className="ml-[36px] relative">

                            <span className="absolute flex items-center justify-center w-6 h-full bg-white  -left-[40px] ring-white">
                            </span>

                            <span className="absolute flex items-center justify-center w-[20px] h-[20px] bg-default-300 rounded-full -left-[47px] top-[2px] ring-2 ring-white">

                            </span>

                            <div className='flex gap-20  relative border border-gray-100 p-2 rounded-md'>
                                <ExpressionEditor slotValues={[]} />
                            </div>
                        </li>}
                    </ol>
                </div>

            )
        }*/


};

export default ExpressionEditor;
