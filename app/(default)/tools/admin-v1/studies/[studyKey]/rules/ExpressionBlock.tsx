'use client';

import { ChevronDownIcon, ChevronRightIcon } from "@heroicons/react/24/outline"
import clsx from "clsx";
import React from "react";

interface ExpressionBlockProps {
    type: 'action' | 'condition' | 'dynamicValue' | 'globalConstant' | 'localConstant'
    title: string;
    label?: string;
    slots?: {
        slotName: string;
        content: React.ReactNode;
    }[];
}

const ExpressionBlock: React.FC<ExpressionBlockProps> = (props: ExpressionBlockProps) => {
    const hasPopulatedSlots = props.slots && props.slots.length > 0;

    const [openDetails, setOpenDetails] = React.useState(false);

    return (
        <div
            className={clsx(
                "border-s-4 border py-1 rounded-r",
                {
                    'border-blue-500': props.type === 'condition',
                    'border-green-500': props.type === 'dynamicValue',
                    'border-orange-500': props.type === 'action',
                    'border-gray-600': props.type === 'globalConstant',
                    'border-gray-400': props.type === 'localConstant',
                }
            )}
        >
            <div className="flex gap-3 items-center cursor-pointer px-2 group"
                onClick={() => setOpenDetails(prev => !prev)}
            >
                <span className={clsx(
                    "inline-flex items-center text-sm w-10",
                    {
                        'text-blue-500/50': props.type === 'condition',
                        'text-green-500/50': props.type === 'dynamicValue',
                        'text-orange-500/50': props.type === 'action',
                        'text-gray-600/50': props.type === 'globalConstant',
                        'text-gray-400/50': props.type === 'localConstant',
                    }
                )}>
                    {props.type === "action" && 'func'}
                    {props.type === "condition" && 'func'}
                    {props.type === "dynamicValue" && 'func'}
                    {props.type === "globalConstant" && 'global'}
                    {props.type === "localConstant" && 'const'}

                </span>
                <span className="font-mono font-bold grow group-hover:underline">
                    {props.title}{props.label && <span className="text-gray-400 ps-2">
                        {'=> '}{props.label}
                    </span>}
                </span>

                {hasPopulatedSlots && <span
                    className="text-gray-400"
                >
                    {openDetails ?
                        <ChevronDownIcon className="w-4 h-4 " /> :
                        <ChevronRightIcon className="w-4 h-4 " />
                    }
                </span>}

            </div>
            {(hasPopulatedSlots && openDetails) && <div className="flex flex-col gap-3 py-1">
                {props.slots?.map((slot, index) => {
                    return <div className="ps-10 pe-2" key={index}>
                        <div className="text-sm mb-1">{index + 1}. {slot.slotName}:</div>
                        <div className="ps-0">{slot.content}</div>

                    </div>
                })}
            </div>}

        </div>
    )
}

export default ExpressionBlock;
