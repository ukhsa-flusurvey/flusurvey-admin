import { cn } from '@/lib/utils';
import React from 'react';
import { ColorVariant, IconVariant } from '../utils';
import ExpressionIcon from './ExpressionIcon';

interface BlockHeaderProps {
    label: string;
    icon?: IconVariant;
    color?: ColorVariant;
}

const BlockHeader: React.FC<BlockHeaderProps> = (props) => {
    return (
        <div className={cn(
            'font-bold text-[12px] text-slate-700 font-mono tracking-wide flex gap-2 items-center px-2 py-1 bg-slate-200',
            {
                'bg-orange-100': props.color === 'orange',
                'bg-blue-100': props.color === 'blue',
            })}>
            <ExpressionIcon icon={props.icon} color={props.color} />

            <span>
                {props.label}
            </span>

        </div>
    );
};

export default BlockHeader;
