import React from 'react';
import AddPopover from './add-popover';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface SectionCardProps {
    title: string;
    description: string;
    count?: number;

    // add new handler:
    usedKeys?: string[];
    keySuggestions?: string[];
    addWithoutKey?: boolean;
    onAddNewEntry?: (key?: string) => void;
}

const SectionCard: React.FC<SectionCardProps> = (props) => {
    const renderAddNew = () => {

        if (props.addWithoutKey) {
            return <Button
                variant={'ghost'}
                size='icon'
                onClick={() => { props.onAddNewEntry?.() }}
            >
                <PlusIcon className='size-4' />
            </Button>
        }

        return <AddPopover
            trigger={
                <Button
                    variant={'ghost'}
                    size='icon'
                >
                    <PlusIcon className='size-4' />
                </Button>
            }
            usedKeys={props.usedKeys ?? []}
            suggestions={props.keySuggestions ?? []}
            align='end'
            onAddNewKey={(key: string) => {
                props.onAddNewEntry?.(key)
            }}
        />
    }


    return (
        <Card>
            <div className='flex justify-between gap-2 items-start border-b border-border px-4 py-2'>
                <div>
                    <h3 className='font-bold text-lg tracking-wide'>
                        {props.title}

                        {props.count !== undefined && <span
                            className='font-normal ms-1 text-muted-foreground'
                        >
                            ({props.count})
                        </span>}
                    </h3>
                    <p className='text-xs text-muted-foreground mt-1'>
                        {props.description}
                    </p>
                </div>
                {props.onAddNewEntry && <div className='-mt-1 -me-3'>
                    {renderAddNew()}
                </div>}
            </div>
        </Card>
    );
};

export default SectionCard;
