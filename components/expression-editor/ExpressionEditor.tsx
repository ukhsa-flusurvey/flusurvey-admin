'use client'
import React, { useState } from 'react';


import { cn } from '@/lib/utils';
import { ExpArg, ExpEditorContext, Expression, ExpressionCategory, ExpressionDef, SlotInputDef, lookupExpressionDef } from './utils';
import BlockHeader from './components/BlockHeader';

import ExpArgEditor from './exp-arg-editor';



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
    className?: string;
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

    const renderedSlots = () => {
        const slotTypes: Array<string | undefined> = [];

        // slot types with fallbacks
        expressionDef.slots.forEach((slotDef, index) => {
            const hasArgIndex = slotDef.argIndexes !== undefined && slotDef.argIndexes.length > 0;
            if (hasArgIndex) {
                const argIndex = slotDef.argIndexes![0];
                const availableMetadata = props.expressionValue.metadata?.slotTypes?.at(argIndex);
                if (availableMetadata !== undefined) {
                    slotTypes.push(availableMetadata);
                    return
                }

                // has data at argIndex
                const dataAtArgIndex = props.expressionValue.data?.at(argIndex);
                if (!dataAtArgIndex) {
                    slotTypes.push(undefined);
                    return
                }

                const fallbackSlotType = slotDef.allowedTypes?.at(0)?.id;
                if (fallbackSlotType === undefined) {
                    slotTypes.push(undefined);
                    return
                }

                if (fallbackSlotType === 'exp-slot' || dataAtArgIndex.dtype === 'exp') {
                    slotTypes.push((dataAtArgIndex as ExpArg).exp?.name);
                    return
                }
                slotTypes.push(fallbackSlotType);

            } else {
                const availableMetadata = props.expressionValue.metadata?.slotTypes?.at(index);
                if (availableMetadata !== undefined && availableMetadata !== null) {
                    slotTypes.push(availableMetadata);
                    return
                }
                // has data at argIndex
                const dataAtArgIndex = props.expressionValue.data?.at(index);
                if (!dataAtArgIndex) {
                    slotTypes.push(undefined);
                    return;
                }

                const fallbackSlotType = slotDef.allowedTypes?.at(0)?.id;
                if (fallbackSlotType === undefined) {
                    slotTypes.push(undefined);
                    return;
                }

                if (fallbackSlotType === 'exp-slot' || dataAtArgIndex.dtype === 'exp') {
                    slotTypes.push((dataAtArgIndex as ExpArg).exp?.name);
                    return
                }
                slotTypes.push(fallbackSlotType);
            }
        })

        return <div className='space-y-4'>
            {expressionDef.slots.map((slotDef, index) => {

                return <ExpArgEditor
                    key={index}
                    depth={props.depth}
                    slotDef={slotDef}
                    currentIndex={index}
                    availableExpData={props.expressionValue.data || []}
                    availableMetadata={{
                        ...props.expressionValue.metadata,
                        slotTypes: slotTypes
                    }}
                    expRegistry={props.expRegistry}
                    context={props.context}
                    isHidden={hideSlotContent.includes(index)}
                    onToggleHide={(hidden) => {
                        if (hidden) {
                            setHideSlotContent([...hideSlotContent, index])
                        } else {
                            setHideSlotContent(hideSlotContent.filter(i => i !== index))
                        }
                    }}
                    onChange={(newArgs, newSlotTypes) => {
                        props.onChange?.({
                            ...props.expressionValue!,
                            metadata: {
                                ...props.expressionValue!.metadata,
                                slotTypes: newSlotTypes
                            },
                            data: newArgs
                        })
                    }}
                />

            })}
        </div>
    }


    return (
        <div className={cn(
            'flex flex-col gap-2 w-full ',
            {
                'bg-slate-50 rounded-md overflow-hidden': (props.depth || 0) === 0,
            },
            props.className,
        )}>
            <BlockHeader
                color={expressionDef.color}
                icon={expressionDef.icon}
                label={expressionDef.label}
            />
            {expressionDef.slots.length > 0 && <div className='pl-7 mt-0 pr-2 pb-2'>
                {renderedSlots()}
            </div>}
        </div>
    )
};

export default ExpressionEditor;
