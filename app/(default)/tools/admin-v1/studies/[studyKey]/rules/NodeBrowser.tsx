'use client';
import React, { useMemo } from 'react';
import Fuse from 'fuse.js';
import { ReactMarkdown } from 'react-markdown/lib/react-markdown';
import clsx from 'clsx';

interface NodeReference {
    id: string;
    groupIds: string[];
    type: string;
    label: string;
    description: string;
    meta: {
        expName?: string;
        description: string;
    } // not visible, to search
}

interface NodeBrowserProps {
    nodes: NodeReference[];
    groups: Array<{
        id: string;
        label: string;
    }>;
}

interface NodePreviewCardProps {
    id: string;
    type: string;
    label: string;
    description: string;
}

const NodePreviewCard: React.FC<NodePreviewCardProps> = (props) => {
    const onDragStart = (event: React.DragEvent<HTMLDivElement>, nodeType: string) => {
        event.dataTransfer.setData('application/reactflow', nodeType);
        event.dataTransfer.effectAllowed = 'move';
    };


    return (
        <div className="rounded border border-gray-500 overflow-hidden cursor-grab bg-white shadow-sm"
            onDragStart={(event) => onDragStart(event, props.id)}
            draggable>
            <div className={clsx(
                'font-mono px-4 py-1 text-sm font-bold',
                {
                    'text-white bg-gray-600': props.type === 'constantNum',
                    'text-gray-600 bg-gray-200': props.type === 'constantStr',
                    'text-white bg-cyan-800': props.type === 'dynamicValue',
                    'text-white bg-green-700': props.type === 'comparision',
                    'text-white bg-blue-600': props.type === 'logical',
                    'text-gray-800 bg-teal-400': props.type === 'action',
                    'text-white bg-fuchsia-800': props.type === 'flowControl',
                    'text-white bg-yellow-800': props.type === 'other',

                }
            )}>{props.label}</div>
            <div className='text-gray-600 px-4 py-1 text-xs'>
                <ReactMarkdown>
                    {props.description}
                </ReactMarkdown>
            </div>
        </div>
    );
}

const NodeBrowser: React.FC<NodeBrowserProps> = (props) => {
    const [searchText, setSearchText] = React.useState('');

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchText(event.target.value);
    };

    const onDragStart = (event: React.DragEvent<HTMLDivElement>, nodeType: string) => {
        event.dataTransfer.setData('application/reactflow', nodeType);
        event.dataTransfer.effectAllowed = 'move';
    };

    const fuse = useMemo(() => {
        return new Fuse(props.nodes, {
            keys: [
                'label',
                { name: 'description', weight: 0.3 },
                { name: 'meta.expName', weight: 1.0 },
                { name: 'meta.description', weight: 0.3 }
            ],
            threshold: 0.1,
            ignoreLocation: searchText.length > 3,
        });
    }, [props.nodes, searchText]);

    const filteredNodes = searchText.length > 0 ? fuse.search(searchText).map(i => i.item) : props.nodes;



    return (
        <aside className='flex flex-col bg-neutral-200 h-full w-64 overflow-y-scroll pt-2 pb-12 drop-shadow-[-5px_0_5px_rgba(0,0,0,0.25)]' >
            <div className='py-2 px-4'>
                <h3 className='font-bold text-xl mb-1'>Expressions</h3>
                <div>
                    <input type="text"
                        className='form-input border border-gray-300 rounded w-full px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/50'
                        value={searchText}
                        onChange={handleSearch}
                        placeholder='Search...'
                    />
                </div>
            </div>
            <div>
                {filteredNodes.length === 0 && <div className='px-4 py-2 text-gray-700 text-sm'>No results. Try a different search.</div>}
                {props.groups.map((group) => {
                    const groupNodes = filteredNodes.filter((node) => node.groupIds.includes(group.id));
                    if (groupNodes.length === 0) {
                        return null;
                    }
                    return (
                        <div key={group.id} className='py-2 px-4 border-t border-gray-600 mt-4'>
                            <h4 className='font-bold mb-1'>{group.label}</h4>
                            <div className='flex flex-col gap-2'>
                                {groupNodes.map((node) => {
                                    return (
                                        <NodePreviewCard key={node.id}
                                            id={node.id}
                                            type={node.type}
                                            label={node.label}
                                            description={node.description}
                                        />
                                    );
                                })}
                            </div>
                        </div>
                    )
                })}
            </div>


            <div className='py-2 px-4 border-t mt-4'>
                <h4 className='font-bold text-lg'>Values</h4>
            </div>
            <div className='flex flex-col gap-2 px-4' >

                <div className="border border-gray-600 rounded  overflow-hidden cursor-grab bg-white" onDragStart={(event) => onDragStart(event, 'and')} draggable>
                    <div className='font-mono px-4 py-1 text-gray-600 bg-gray-200'>string</div>
                    <div className='text-gray-600 px-4 py-1 text-xs'>
                        Define a string constant
                    </div>
                </div>
                <div className="border border-cyan-800 rounded  overflow-hidden cursor-grab bg-white" onDragStart={(event) => onDragStart(event, 'and')} draggable>
                    <div className='font-mono px-4 py-1 text-white bg-cyan-800'>timestamp</div>
                    <div className='text-gray-600 px-4 py-1 text-xs'>
                        <span className='font-bold'>t = reference + offset.</span> <br /> If no reference date is provided, the current date is used as the reference.
                    </div>
                </div>
                <div className="border border-cyan-800 rounded  overflow-hidden cursor-grab bg-white" onDragStart={(event) => onDragStart(event, 'generateRandomNumber')} draggable>
                    <div className='font-mono px-4 py-1 text-white bg-cyan-800'>random number</div>
                    <div className='text-gray-600 px-4 py-1 text-xs'>
                        Random number between min and max (both inclusive)
                    </div>
                </div>

                <div className="border border-sky-800 rounded  overflow-hidden cursor-grab bg-white" onDragStart={(event) => onDragStart(event, 'generateRandomNumber')} draggable>
                    <div className='font-mono px-4 py-1 text-white bg-sky-800'>get participant flag</div>
                    <div className='text-gray-600 px-4 py-1 text-xs'>
                        Get a context value
                    </div>
                </div>
            </div>
            <div className='py-2 px-4 border-t mt-4'>
                <h4 className='font-bold text-lg'>Logical operators</h4>
            </div>
            <div className='flex flex-col gap-2 px-4 text-sm' >
                <div className="border border-blue-600 rounded overflow-hidden cursor-grab bg-white" onDragStart={(event) => onDragStart(event, 'and')} draggable>
                    <div className='font-mono px-4 py-1 text-white bg-blue-600'>and</div>
                    <div className='text-gray-600 px-4 py-1 text-xs'>
                        Logical AND, returns true if all arguments are true
                    </div>
                </div>
                <div className="border border-blue-600 rounded overflow-hidden cursor-grab bg-white" onDragStart={(event) => onDragStart(event, 'and')} draggable>
                    <div className='font-mono px-4 py-1 text-white bg-blue-600'>or</div>
                    <div className='text-gray-600 px-4 py-1 text-xs'>
                        Logical OR, returns true if any argument is true
                    </div>
                </div>
                <div className="border border-blue-600 rounded overflow-hidden cursor-grab bg-white" onDragStart={(event) => onDragStart(event, 'and')} draggable>
                    <div className='font-mono px-4 py-1 text-white bg-blue-600'>not</div>
                    <div className='text-gray-600 px-4 py-1 text-xs'>
                        Logical NOT, negates the argument
                    </div>
                </div>



                <div className="border border-amber-400 rounded overflow-hidden cursor-grab bg-white" onDragStart={(event) => onDragStart(event, 'and')} draggable>
                    <div className='font-mono px-4 py-1 text-black bg-amber-400'>IF</div>
                    <div className='text-gray-600 px-4 py-1 text-xs'>
                        IF condition THEN true ELSE false
                    </div>
                </div>

                <div className="border border-green-700 rounded overflow-hidden cursor-grab bg-white" onDragStart={(event) => onDragStart(event, 'and')} draggable>
                    <div className='font-mono px-4 py-1 text-white bg-green-700'>equals</div>
                    <div className='text-gray-600 px-4 py-1 text-xs'>
                        Returns true if both arguments are equal
                    </div>
                </div>

                <div className="border border-teal-400 rounded overflow-hidden cursor-grab bg-white" onDragStart={(event) => onDragStart(event, 'and')} draggable>
                    <div className='font-mono px-4 py-1 text-black bg-teal-400'>add survey</div>
                    <div className='text-gray-600 px-4 py-1 text-xs'>
                        Add a survey to the participant
                    </div>
                </div>

                <div className="border border-fuchsia-800 rounded overflow-hidden cursor-grab bg-white" onDragStart={(event) => onDragStart(event, 'and')} draggable>
                    <div className='font-mono px-4 py-1 text-white bg-fuchsia-800'>action group</div>
                    <div className='text-gray-600 px-4 py-1 text-xs'>
                        Group of actions to execute in sequence
                    </div>
                </div>

                <div className="border border-yellow-800 rounded overflow-hidden cursor-grab bg-white" onDragStart={(event) => onDragStart(event, 'and')} draggable>
                    <div className='font-mono px-4 py-1 text-white bg-yellow-800'>other </div>
                    <div className='text-gray-600 px-4 py-1 text-xs'>
                        other category
                    </div>
                </div>
            </div>

        </aside >
    );

};

export default NodeBrowser;
