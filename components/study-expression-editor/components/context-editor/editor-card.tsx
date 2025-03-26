import React from 'react';
import { KeyValuePairDefs } from '../../types';
import { PlusIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface EditorCardProps {
    label: string;
    description: string;
    type: 'string' | 'key-value-pair';
    data?: string[] | KeyValuePairDefs[];
    onChange?: (data: string[] | KeyValuePairDefs[]) => void;
    onSelectIndex?: (index: number) => void;
}

interface AddPopoverProps {
    trigger: React.ReactNode;
    usedKeys: string[];
    align?: 'end';
    onAddNewKey: (key: string) => void;
}

const AddPopover: React.FC<AddPopoverProps> = (props) => {
    const [newKey, setNewKey] = React.useState('');

    return (
        <Popover>
            <PopoverTrigger asChild>
                {props.trigger}
            </PopoverTrigger>
            <PopoverContent
                align={props.align}
            >Place content for the popover here.</PopoverContent>
        </Popover>
    );
};

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

            <div className='grow flex flex-col justify-center items-center'>
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
            </div>


        </div>
    );
};

export default EditorCard;
