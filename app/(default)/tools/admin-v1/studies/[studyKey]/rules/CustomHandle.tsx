import clsx from "clsx";
import { is } from "date-fns/locale";
import React from "react";
import { useCallback, useRef } from "react";
import { Handle, Position, ReactFlowState, getConnectedEdges, useNodeId, useReactFlow, useStore } from "reactflow";

interface CustomHandleProps {
    nodeId: string;
    handleId: string;
    name: string;
    isConnectable?: boolean;
    maxConnections?: number;
}


export const CustomTargetHandle = (props: {
    isConnectable?: boolean;
    maxConnections?: number;
}) => {
    const nodeId = useNodeId();
    const isConnectable = useStore(
        useCallback((s: ReactFlowState) => {
            // If the user props say this handle is not connectable, we don't need to
            // bother checking anything else.
            if (!props.isConnectable) return false;
            if (props.maxConnections === undefined) return true;
            if (!nodeId) return false;

            const node = s.nodeInternals.get(nodeId);
            if (!node) return false;
            const connectedEdges = getConnectedEdges([node], s.edges).filter((edge) => edge.target === nodeId);
            return connectedEdges.length < props.maxConnections;
        }, [
            nodeId,
            props.isConnectable,
            props.maxConnections,
        ])
    );

    return <Handle type='target'
        className='!absolute !left-0 !w-full !h-full !rounded-sm !border-none !bg-transparent'
        isConnectable={isConnectable}
        position={Position.Left} />
}

export const CustomSourceHandle = (props: CustomHandleProps) => {
    const reactFlowInstance = useReactFlow();
    const handleWrapper = useRef<HTMLDivElement | null>(null);
    const [dragHover, setDragHover] = React.useState(false);

    const nodeId = useNodeId();

    const isConnectable = useStore(
        useCallback((s: ReactFlowState) => {
            // If the user props say this handle is not connectable, we don't need to
            // bother checking anything else.
            if (!props.isConnectable) return false;
            if (props.maxConnections === undefined) return true;
            if (!nodeId) return false;

            const node = s.nodeInternals.get(nodeId);
            if (!node) return false;
            const connectedEdges = getConnectedEdges([node], s.edges).filter((edge) => {
                return edge.source === nodeId && edge.sourceHandle === props.handleId
            });
            return connectedEdges.length < props.maxConnections;
        }, [
            nodeId,
            props.isConnectable,
            props.maxConnections,
            props.handleId,
        ])
    );


    const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
        setDragHover(true);
    }, []);


    const onDragEnter = () => {
        setDragHover(true);
    };

    const onDragLeave = () => {
        setDragHover(false);
    };

    const onDrop = useCallback(
        (event: React.DragEvent<HTMLDivElement>) => {
            console.log(event)
            event.preventDefault();
            if (!handleWrapper.current) {
                return;
            }
            setDragHover(false);
            const reactFlowBounds = handleWrapper.current.getBoundingClientRect();
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
                id: `${props.nodeId}.${props.handleId}`,
                type,
                position,
                data: { label: `${type} node` },
            };

            reactFlowInstance.addNodes(newNode);
        },
        [props.handleId, props.nodeId, reactFlowInstance]
    );

    return <div className={clsx(
        'flex items-center relative py-2',
        {
            'bg-blue-200': dragHover,
        }

    )}
        ref={handleWrapper}
        onDragOver={onDragOver}
        onDrop={onDrop}
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
    >
        <div className='grow text-end pe-3 '>
            {props.name}
        </div>
        <div className="h-8 bg-gray-500 w-1 rounded-s">

        </div>
        <Handle
            id={props.handleId}
            position={Position.Right}
            isConnectable={isConnectable}
            className='!absolute !block !right-0 !w-16 !border-none !box-content !p-0 !h-8 !bg-transparent !rounded-sm'
            type="source"
        />
    </div>
}
