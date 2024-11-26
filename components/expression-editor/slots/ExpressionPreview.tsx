import React from 'react';
import { Expression, ExpressionCategory, ExpressionDef, lookupExpressionDef } from '../utils';
import BlockHeader from '../components/BlockHeader';
import Block from '../components/Block';

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
        <Block depth={props.depth}>
            <BlockHeader
                color={expressionDef.color}
                icon={expressionDef.icon}
                label={expressionDef.label}
            />
        </Block>
    );
};

export default ExpressionPreview;
