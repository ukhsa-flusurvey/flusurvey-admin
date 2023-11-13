import React from 'react';
import { ExpEditorContext, Expression, ExpressionCategory, ExpressionDef, lookupExpressionDef } from './utils';
import { cn } from '@/lib/utils';
import ExpressionIcon from './ExpressionIcon';

interface ExpressionPreviewProps {
    expressionValue: Expression;
    expRegistry: {
        expressionDefs: ExpressionDef[],
        categories: ExpressionCategory[]
    };
    depth?: number;
}

const ExpressionPreview: React.FC<ExpressionPreviewProps> = (props) => {
    const expressionDef = lookupExpressionDef(props.expressionValue.name, props.expRegistry.expressionDefs);


    if (!expressionDef) {
        return (
            <div>
                <p>Expression not found: {props.expressionValue.name}</p>
            </div>
        )
    }

    return (
        <div className={cn('border border-slate-300 bg-slate-100 rounded-md overflow-hidden', {
            'bg-slate-50': (props.depth || 0) % 2 === 0,
        })}>
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
            </div>
        </div>
    );
};

export default ExpressionPreview;
