'use client'

import React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '../../ui/popover';
import { Button } from '../../ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '../../ui/command';
import { BsPlusCircleDotted } from 'react-icons/bs';
import { cn } from '@/lib/utils';
import ExpressionIcon from './ExpressionIcon';
import { SlotTypeGroup } from '../utils';


interface SlotTypeSelectorProps {
    groups: SlotTypeGroup[];
    onSelect: (slotTypeId?: string) => void;
    isRequired: boolean;
}

const SlotTypeSelector: React.FC<SlotTypeSelectorProps> = (props) => {
    const [open, setOpen] = React.useState(false)

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    // size="sm"
                    className={cn('w-full border-dashed border-slate-300 text-slate-500',
                        {
                            'border-red-400': props.isRequired
                        }
                    )}
                >
                    <>
                        <span className='me-2 text-slate-500'>
                            <BsPlusCircleDotted />
                        </span>
                        add value
                    </>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0" side="bottom" align="start">
                <Command>
                    <CommandInput placeholder="Select type..." />
                    <CommandList>
                        <CommandEmpty>No results found.</CommandEmpty>
                        {
                            props.groups.map((group) => {
                                return (
                                    <CommandGroup key={group.id} heading={group.label}>
                                        {
                                            group.slotTypes.map((slotType) => {
                                                return (
                                                    <CommandItem key={slotType.id}
                                                        onSelect={(currentValue) => {
                                                            props.onSelect(slotType.id);
                                                            setOpen(false)
                                                        }}
                                                    >
                                                        <ExpressionIcon icon={slotType.icon} color={slotType.color} />
                                                        <span className='ms-2'>{slotType.label}</span>
                                                    </CommandItem>
                                                )
                                            })
                                        }
                                    </CommandGroup>)
                            })
                        }
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
};

export default SlotTypeSelector;
