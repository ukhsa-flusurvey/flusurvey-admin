import { cn } from '@/lib/utils';
import React from 'react';
import { ColorVariant, IconVariant } from '../utils';
import { Blocks, Box, Braces, Brackets, Calendar, CircleSlash2, Code, Database, Diamond, FormInput, FunctionSquare, LayoutList, Parentheses, Pyramid, Regex, Signpost, Split, Square, SquareCode, Tag, Terminal, TextCursor, Triangle, Variable } from 'lucide-react';

interface ExpressionIconProps {
    icon?: IconVariant;
    color?: ColorVariant;
}


const getIconNode = (icon?: IconVariant) => {
    switch (icon) {
        case 'braces':
            return <Braces />;
        case 'function':
            return <FunctionSquare />;
        case 'code':
            return <Code />;
        case 'variable':
            return <Variable />;
        case 'brackets':
            return <Brackets />;
        case 'regex':
            return <Regex />;
        case 'square-code':
            return <SquareCode />;
        case 'terminal':
            return <Terminal />;
        case 'signpost':
            return <Signpost />;
        case 'layout-list':
            return <LayoutList />;
        case 'tag':
            return <Tag />;
        case 'text-cursor':
            return <TextCursor />;
        case 'calendar':
            return <Calendar />;
        case 'form-input':
            return <FormInput />;
        case 'parentheses':
            return <Parentheses />;
        case 'pyramid':
            return <Pyramid />;
        case 'triangle':
            return <Triangle />;
        case 'square':
            return <Square />;
        case 'diamond':
            return <Diamond />;
        case 'database':
            return <Database />;
        case 'split':
            return <Split />;
        case 'circle-slash':
            return <CircleSlash2 />;
        case 'blocks':
            return <Blocks />;
        case 'box':
        default:
            return <Box />;
    }
}


const ExpressionIcon: React.FC<ExpressionIconProps> = (props) => {
    return (
        <span className={cn(
            {
                'text-orange-600': props.color === 'orange',
                'text-blue-600': props.color === 'blue',
                'text-green-700': props.color === 'green',
                'text-yellow-700': props.color === 'yellow',
                'text-purple-700': props.color === 'purple',
                'text-teal-700': props.color === 'teal',
                'text-cyan-800': props.color === 'cyan',
                'text-lime-700': props.color === 'lime',
            })}>
            <span className='flex items-center justify-center w-4 h-4'>
                {getIconNode(props.icon)}
            </span>
        </span>
    );
};

export default ExpressionIcon;
