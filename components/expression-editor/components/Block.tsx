import { cn } from '@/lib/utils';
import React from 'react';

interface BlockProps {
    children: React.ReactNode;
    depth?: number;
    isInvalid?: boolean;
}

const Block: React.FC<BlockProps> = (props) => {
    return (
        <div className={cn(
            'border border-slate-300 bg-slate-100 rounded-md overflow-hidden z-10',
            'relative',
            {
                'bg-slate-50': (props.depth || 0) % 2 === 0,
                'border-red-400 border-dashed': props.isInvalid
            })}>
            {props.children}

        </div>
    );
};

export default Block;
