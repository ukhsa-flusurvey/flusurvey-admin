import React from 'react';
import { KeyValuePairDefs } from '../../types';
import { PlusIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from '@/components/ui/context-menu';
import AddPopover from './add-popover';
import ListItemView from './list-item-view';

interface EditorCardProps {
    label: string;
    description: string;
    type: 'string' | 'key-value-pair';
    data?: string[] | KeyValuePairDefs[];
    selectedIndex?: number;
    onChange?: (data: string[] | KeyValuePairDefs[]) => void;
    onSelectIndex?: (index: number | undefined) => void;
}


const EditorCard: React.FC<EditorCardProps> = (props) => {
    const getUsedKeys = (): string[] => {
        if (!props.data) {
            return [];
        }

        if (props.type === 'string') {
            return props.data as string[];
        }

        if (props.type === 'key-value-pair') {
            return (props.data as KeyValuePairDefs[]).map(kv => kv.key);
        }

        return [];
    }
    const usedKeys = getUsedKeys();


    const addNewKey = (key: string) => {
        if (!key) {
            return;
        }
        if (props.type === 'string') {
            const newData = props.data !== undefined ? [...(props.data as string[]), key] : [key];
            if (props.onChange) {
                props.onChange(newData);
            }
        } else if (props.type === 'key-value-pair') {
            const newData = props.data !== undefined ? [...(props.data as KeyValuePairDefs[]), { key, possibleValues: [] }] : [{ key, possibleValues: [] }];
            if (props.onChange) {
                props.onChange(newData);
            }
        }
    }

    const removeItem = (item: string | KeyValuePairDefs) => {
        if (!confirm('Are you sure you want to delete this entry? All unsaved changes will be lost.')) {
            return;
        }

        if (props.type === 'string') {
            const newData = props.data !== undefined ? [...(props.data as string[])] : [];
            newData.splice(newData.indexOf(item as string), 1);
            if (props.onChange) {
                props.onChange(newData);
            }
        } else if (props.type === 'key-value-pair') {
            const newData = props.data !== undefined ? [...(props.data as KeyValuePairDefs[])] : [];
            newData.filter(e => e.key !== (item as KeyValuePairDefs).key);
            if (props.onChange) {
                props.onChange(newData);
            }
        }
        props.onSelectIndex?.(undefined);
    }

    const hasItems = props.data !== undefined && props.data?.length > 0;

    return (
        <div
            className='border border-border rounded-lg p-4 flex flex-col h-hull'
        >
            <div className='flex justify-between gap-2 items-start'>
                <div>
                    <h3 className='font-bold text-lg tracking-wide'>
                        {props.label}
                        <span
                            className='font-normal ms-1 text-muted-foreground'
                        >
                            ({props.data?.length ?? 0})
                        </span>
                    </h3>
                    <p className='text-xs text-muted-foreground mt-1'>
                        {props.description}
                    </p>
                </div>

                <div className='-mt-2 -me-2'>
                    <AddPopover
                        trigger={
                            <Button
                                variant={'ghost'}
                                size='icon'
                            >
                                <PlusIcon className='size-4' />
                            </Button>
                        }
                        usedKeys={usedKeys}
                        align='end'
                        onAddNewKey={addNewKey}
                    />
                </div>

            </div>

            {!hasItems && (<div className='grow flex flex-col justify-center items-center'>
                <AddPopover
                    trigger={
                        <Button
                            variant={'outline'}
                        >
                            <PlusIcon className='size-4' />
                            <span>Add first entry</span>
                        </Button>
                    }
                    usedKeys={usedKeys}
                    onAddNewKey={addNewKey}
                />
            </div>)}
            {hasItems && (<ul className='w-full divide-y divide-border pt-4 max-h-64 overflow-y-auto'>
                {props.data?.map((item, index) => (
                    <li key={index} className='py-1'>
                        <ContextMenu>
                            <ContextMenuTrigger asChild>
                                <Button variant={props.selectedIndex === index ? 'secondary' : 'ghost'}
                                    className='w-full h-auto'
                                    onClick={() => {
                                        if (props.selectedIndex === index) {
                                            props.onSelectIndex?.(undefined);
                                            return;
                                        }
                                        props.onSelectIndex?.(index)
                                    }}
                                >
                                    <ListItemView
                                        entry={item}
                                    />
                                </Button>
                            </ContextMenuTrigger>
                            <ContextMenuContent>
                                <ContextMenuItem onClick={() => removeItem(item)}>
                                    Delete entry
                                </ContextMenuItem>

                            </ContextMenuContent>
                        </ContextMenu>
                    </li>))}
            </ul>)}
        </div>
    );
};

export default EditorCard;
