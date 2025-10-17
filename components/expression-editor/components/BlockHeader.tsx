import { cn } from '@/lib/utils';
import React from 'react';
import { ColorVariant, IconVariant } from '../utils';
import ExpressionIcon from './ExpressionIcon';

interface BlockHeaderProps {
    label: string;
    icon?: IconVariant;
    color?: ColorVariant;
    returnType?: string;
}

const BlockHeader: React.FC<BlockHeaderProps> = (props) => {
    return (
        <div className={cn(
            'font-bold text-[12px] text-slate-700 font-mono tracking-wide flex gap-2 items-center px-2 py-1 bg-slate-200 z-20',
            {
                'bg-blue-100': props.color === 'blue',
                'bg-orange-200': props.color === 'orange',
                'bg-green-300': props.color === 'green',
                'bg-yellow-200': props.color === 'yellow',
                'bg-purple-200': props.color === 'purple',
                'bg-teal-200': props.color === 'teal',
                'bg-cyan-300': props.color === 'cyan',
                'bg-lime-200': props.color === 'lime',
                'bg-neutral-600 text-white': props.color === 'dark',
            })}>
            <ExpressionIcon icon={props.icon} color={props.color} />

            <span>
                {props.label}
            </span>
            {props.returnType && <span className='ms-auto font-normal ps-1'>
                {props.returnType}
            </span>}
        </div>
    );
};

export default BlockHeader;
