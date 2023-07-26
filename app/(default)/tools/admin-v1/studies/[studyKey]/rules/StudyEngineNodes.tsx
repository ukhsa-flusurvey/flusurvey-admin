import { TrashIcon } from '@heroicons/react/24/outline';
import { Bars2Icon } from '@heroicons/react/24/solid';
import clsx from 'clsx';
import React from 'react';
import { Handle, NodeToolbar, Position } from 'reactflow';
import { CustomSourceHandle, CustomTargetHandle } from './CustomHandle';

interface CustomNodeProps {
    children?: React.ReactNode;
    id: string;
    selected?: boolean;
    data: {
        toolbarVisible: boolean,
    };
}

const NodeHeader = ({ symbol, title, type, className }: { symbol: React.ReactNode, title: string, type: string, className?: string }) => {
    return (<div className={clsx('p-2 flex items-center  cursor-default',
        className,
        {
            'text-white bg-gray-600': type === 'constantNum',
            'text-gray-600 bg-gray-200': type === 'constantStr',
            'text-white bg-cyan-800': type === 'dynamicValue',
            'text-white bg-green-700': type === 'comparision',
            'text-white bg-blue-600': type === 'logical',
            'text-gray-800 bg-teal-400': type === 'action',
            'text-white bg-fuchsia-800': type === 'flowControl',
            'text-white bg-yellow-800': type === 'other',
        }
    )}>
        <span className='italic text-sm'>
            {symbol}
        </span>
        <span className="ms-2 font-mono font-bold grow">
            {title}
        </span>
        <span className='custom-drag-handle cursor-move z-50'>
            <Bars2Icon className='w-4 h-4 ' />
        </span>
    </div>
    )
}


const CustomNode: React.FC<CustomNodeProps> = (props) => {
    return (
        <>
            <NodeToolbar isVisible={props.data.toolbarVisible} position={Position.Right}
                offset={5}
                align='start'
            >
                <button className='rounded-full bg-red-600 hover:bg-red-900 text-white text-sm flex px-4 py-1 items-center shadow-sm'>
                    <TrashIcon className='w-4 h-4' />

                </button>
            </NodeToolbar>
            <div className={clsx("bg-white rounded shadow-md w-[300px]",
                { "ring-4 ring-red-600/50": props.selected, }
            )}>
                <CustomTargetHandle
                    isConnectable={true}
                    maxConnections={1}
                />
                {props.children}
            </div>
        </>
    );
};


export const IfNode: React.FC<CustomNodeProps> = (props) => {
    return (
        <CustomNode
            {...props}
        >
            <NodeHeader
                symbol={<span className='italic text-sm'>func</span>}
                title='if'
                type='flowControl'
                className='rounded-t'
            />
            <div>
                <CustomSourceHandle
                    handleId='slot-0'
                    name='condition'
                    nodeId={props.id}
                    isConnectable={true}
                    maxConnections={1}
                />
                <CustomSourceHandle
                    handleId='slot-1'
                    name='TRUE'
                    nodeId={props.id}
                    isConnectable={true}
                    maxConnections={1}
                />
                <CustomSourceHandle
                    handleId='slot-2'
                    name='FALSE'
                    nodeId={props.id}
                    isConnectable={true}
                    maxConnections={1}
                />
            </div>
        </CustomNode>
    );
}


export default CustomNode;
