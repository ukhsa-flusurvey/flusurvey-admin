'use client'
import React, { useCallback, useRef, useState } from 'react';
import ReactFlow, { Background, BackgroundVariant, BaseEdge, Connection, Controls, EdgeLabelRenderer, EdgeProps, Handle, NodeToolbar, Panel, Position, ReactFlowProvider, SelectionMode, addEdge, getBezierPath, useEdgesState, useNodesState, useReactFlow } from 'reactflow';
import 'reactflow/dist/style.css';
import studyRules from './testStudyRules.json';
import { Expression, ExpressionArg } from 'survey-engine/data_types';
import clsx from 'clsx';
import { TrashIcon } from '@heroicons/react/24/outline';
import { CustomSourceHandle, CustomTargetHandle } from './CustomHandle';
import { IfNode } from './StudyEngineNodes';
import { BsBoundingBoxCircles, BsArrowsMove } from 'react-icons/bs';
import { RadioGroup } from '@headlessui/react';



interface ExpressionGraphProps {
}

interface ExpressionArgNodeProps {
    id: string;
    data: {
        name: string,
        type: string,
        toolbarVisible: boolean,
        slots: {
            slotName: string,
            id: string,
        }[]
    };
}


const ExpressionArgNode: React.FC<ExpressionArgNodeProps> = (props) => {
    // console.log(props.id)

    let symbol: React.ReactNode = '';
    switch (props.data.type) {
        case 'constantNum':
            symbol = <span className='italic text-sm'>const</span>;
            break;
        case 'constantStr':
            symbol = <span className='italic text-sm'>const</span>;
            break;
        case 'dynamicValue':
            symbol = <span className='italic text-sm'>func</span>;
            break;
        case 'comparision':
            symbol = <span className='italic text-sm'>func</span>;
            break;
        case 'logical':
            symbol = <span className='italic text-sm'>func</span>;
            break;
        case 'action':
            symbol = <span className='italic text-sm'>func</span>;
            break;
        case 'flowControl':
            symbol = <span className='italic text-sm'>func</span>;
            break;
        case 'other':
            symbol = <span className='italic text-sm'>func</span>;
            break;
        default:
            break;
    }

    return (
        <>


            <div className="bg-white rounded shadow-md  w-[300px]">
                <CustomTargetHandle
                    isConnectable={true}
                    maxConnections={1}
                />

                <div className={clsx('p-2 bg-blue-600 text-white rounded-t',
                    {
                        'rounded-b': props.data.slots && props.data.slots.length < 1,

                        'text-white bg-gray-600': props.data.type === 'constantNum',
                        'text-gray-600 bg-gray-200': props.data.type === 'constantStr',
                        'text-white bg-cyan-800': props.data.type === 'dynamicValue',
                        'text-white bg-green-700': props.data.type === 'comparision',
                        'text-white bg-blue-600': props.data.type === 'logical',
                        'text-gray-800 bg-teal-400': props.data.type === 'action',
                        'text-white bg-fuchsia-800': props.data.type === 'flowControl',
                        'text-white bg-yellow-800': props.data.type === 'other',
                    }

                )}>
                    <span className='italic text-sm'>
                        {symbol}
                    </span>
                    <span className="ms-2 font-mono font-bold">
                        {props.data.name}
                    </span>
                </div>
                {props.data.slots && props.data.slots.length > 0 &&
                    <div className='flex flex-col  py-2'>
                        {props.data.slots.map((slot, index) => {
                            return (
                                <CustomSourceHandle key={index}
                                    nodeId={props.id}
                                    handleId={`slot-${index}`}
                                    name={slot.id}
                                    isConnectable={true}
                                    maxConnections={1}
                                />
                            )
                        })}

                    </div>
                }

            </div>
        </>
    );
}

const nodePaddingX = 150;
const nodePaddingY = 20;


const initialEdges = [
    // { id: 'e1-2', source: '1', target: '2' }
];


const extractExpNodes = (data: ExpressionArg, parentId: string, index: number, x: number, y: number) => {
    const currentId = `${parentId}.${index.toFixed(0)}`;
    const nodeType = data.exp?.name === 'IF' ? 'studyEngineIf' : 'expressionArg';
    const currentNode = {
        id: currentId, position: { x: x, y: y }, type: nodeType,
        dragHandle: '.custom-drag-handle',
        data: {
            name: data.exp?.name,
            type: data.dtype,

            height: 40 + (data.exp?.data?.length || 0) * 40 + (data.exp?.data?.length ? 18 : 0),
            width: 300,
            slots: data.exp?.data?.map((slot, index) => {
                return {
                    slotName: `slot ${index + 1}`,
                    id: `slot-${index}`
                }
            }
            )
        }
    };

    // The initial y - coordinate for the first child is aligned with the parent's top
    let currentY = y;



    if (data.dtype !== 'exp' || !data.exp || !data.exp.data || data.exp.data.length === 0) {
        return [currentNode];
    }

    const childrenX = x + currentNode.data.width + nodePaddingX;
    const children: any[] = [];
    for (let i = 0; i < data.exp.data.length; i++) {
        const childNodes = extractExpNodes(data.exp.data[i], currentId, i, childrenX, currentY);
        children.push(...childNodes);

        // Update the current y - coordinate for the next child
        // find max height of children
        const subtreeHeight = childNodes.reduce((acc, node) => {
            return Math.max(node.data.height + node.position.y, acc);
        }, currentY);
        // console.log('subtreeHeight', subtreeHeight);

        currentY = subtreeHeight + nodePaddingY;

        // add edges:
        initialEdges.push(
            {
                id: currentId + i,
                type: 'SelectableEdge',
                source: currentId, sourceHandle: `slot-${i.toFixed()}`, target: `${currentId}.${i.toFixed(0)}`
            },
        )

    }
    currentNode.position.y = children[0].position.y;

    return [currentNode, ...children];
}

let currentY = 0;
const studyRulesGraph = extractExpNodes({
    dtype: 'exp', exp: {
        name: 'root',
        data: studyRules,
    } as Expression
}, `root`, 0, 0, currentY);

const initialNodes = studyRulesGraph;

/*[
    // { id: '1', type: 'expressionArg', position: { x: 0, y: 0 }, sourcePosition: Position.Right, data: { label: '1' } },
    // { id: '2', position: { x: 200, y: 0 }, targetPosition: Position.Left, data: { label: '2' } },
    // { id: '3', position: { x: -300, y: 0 }, targetPosition: Position.Left, data: { label: '2' } },
];*/



const StudyEngineNodes = {
    expressionArg: ExpressionArgNode,
    studyEngineIf: IfNode,
}

const defaultEdgeOptions = {
    style: { stroke: '#343434', strokeWidth: 3 },
}

const EdgeTypes = {
    SelectableEdge: (props: EdgeProps) => {
        const [edgePath, labelX, labelY] = getBezierPath({ ...props });
        // const [] = useReactFlow();

        const { getEdges, setEdges } = useReactFlow();

        return <><BaseEdge
            path={edgePath}
            {...props}
            style={{
                // strokeDasharray: '5,5',
                stroke: props.selected ? 'red' : '#343434',
                strokeWidth: props.selected ? '5px' : '3px',
                opacity: props.selected ? 0.6 : 1,
            }}

        />
            {props.selected &&
                <EdgeLabelRenderer>
                    <div
                        style={{
                            position: 'absolute',
                            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
                            fontSize: 12,
                            // everything inside EdgeLabelRenderer has no pointer events by default
                            // if you have an interactive element, set pointer-events: all
                            pointerEvents: 'all',
                        }}
                        className="nodrag nopan"
                    >
                        <button className='rounded-full bg-red-600 hover:bg-red-900 text-white text-sm flex px-4 py-1 items-center shadow-sm'
                            type='button'
                            onClick={() => {
                                console.log('delete edge', props.id)
                                const edges = getEdges();
                                const newEdges = edges.filter(edge => edge.id !== props.id);
                                setEdges(newEdges);
                            }}
                        >
                            <TrashIcon className='w-4 h-4' />
                        </button>

                    </div>
                </EdgeLabelRenderer>}
        </>

    },
}

const ExpressionGraph: React.FC<ExpressionGraphProps> = (props) => {
    const reactFlowWrapper = useRef<HTMLDivElement | null>(null);
    const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    const [panMode, setPanMode] = useState('pan' as 'pan' | 'drag' | 'select');


    const onConnect = useCallback(
        (connection: Connection) => setEdges((eds) => addEdge({ ...connection, type: 'SelectableEdge' }, eds)),
        [setEdges]
    );

    const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const onDrop = useCallback(
        (event: React.DragEvent<HTMLDivElement>) => {
            console.log(event)
            event.preventDefault();
            if (!reactFlowWrapper.current) {
                return;
            }

            const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
            const type = event.dataTransfer.getData('application/reactflow');

            // check if the dropped element is valid
            if (typeof type === 'undefined' || !type) {
                return;
            }

            const position = reactFlowInstance.project({
                x: event.clientX - reactFlowBounds.left,
                y: event.clientY - reactFlowBounds.top,
            });
            const newNode = {
                id: `${new Date().getTime()}`,
                type,
                position,
                data: { label: `${type} node` },
            };

            reactFlowInstance.addNodes(newNode);
        },
        [reactFlowInstance]
    );

    return (
        <ReactFlowProvider>
            <div className='w-full h-full' ref={reactFlowWrapper}>
                <ReactFlow
                    className='bg-blue-50'
                    nodes={nodes} edges={edges}
                    onInit={setReactFlowInstance}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    onDrop={onDrop}
                    onDragOver={onDragOver}
                    snapToGrid={true}
                    nodeTypes={StudyEngineNodes}
                    edgeTypes={EdgeTypes}
                    minZoom={0.05}
                    panOnScroll={true}
                    zoomOnScroll={false}
                    onCopy={(event) => {

                        console.log(event);
                    }}
                    panOnDrag={panMode === 'pan'}
                    selectionOnDrag={true}
                    selectionMode={SelectionMode.Partial}
                    // defaultEdgeOptions={defaultEdgeOptions}
                    defaultViewport={{
                        zoom: 0.8,
                        x: nodePaddingX / 2,
                        y: nodePaddingY,

                    }}
                >
                    <Panel
                        position='bottom-right'
                        className='bg-white rounded shadow-md p-2'
                    >
                        <RadioGroup
                            id='drag'
                            value={panMode} onChange={setPanMode}>
                            <RadioGroup.Label
                                htmlFor='drag'
                                id='drag-label'
                                className='block mb-1 text-xs font-medium text-gray-700'>Drag mode</RadioGroup.Label>
                            <div className='flex'>
                                <RadioGroup.Option
                                    id='drag-select'
                                    className='bg-gray-100 text-sm rounded-l border-r border-gray-300 px-2 py-1 ui-checked:bg-gray-300 cursor-pointer'
                                    value={'select'}
                                >
                                    <BsBoundingBoxCircles className='text-xl' />
                                </RadioGroup.Option>
                                <RadioGroup.Option
                                    id='drag-pan'
                                    className='bg-gray-100 text-sm rounded-r border-l border-gray-300 px-2 py-1 ui-checked:bg-gray-300 cursor-pointer'
                                    value={'pan'}
                                >
                                    <BsArrowsMove className='text-xl' />
                                </RadioGroup.Option>
                            </div>
                        </RadioGroup>

                    </Panel>
                    <Background
                        variant={BackgroundVariant.Dots}
                        gap={10}
                        size={1}
                    />
                    <Controls
                        showInteractive={true}
                    />

                </ReactFlow>
            </div>
        </ReactFlowProvider>
    );
};

export default ExpressionGraph;
