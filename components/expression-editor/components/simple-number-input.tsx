import React from 'react';
import { SlotDef, SlotInputDefSimple } from '../utils';
import BuiltInSlotWrapper from './BuiltInSlotWrapper';
import { Input } from '@/components/ui/input';

interface SimpleNumberInputProps {
    slotDef: SlotDef;
    slotTypeDef: SlotInputDefSimple;
    depth?: number;
    currentValue?: number;
    onValueChange: (value: number) => void;
    onClearSlot: () => void;
}

const SimpleNumberInput: React.FC<SimpleNumberInputProps> = (props) => {
    return (
        <BuiltInSlotWrapper
            slotLabel={{
                label: props.slotDef.label,
                required: props.slotDef.required
            }}
            slotTypeDef={{
                color: props.slotTypeDef.color,
                icon: props.slotTypeDef.icon,
                label: props.slotTypeDef.label
            }}
            depth={props.depth}
            isInvalid={props.currentValue === undefined}
            onClearSlot={props.onClearSlot}
        >
            <div className='px-2 py-2'>
                <Input
                    value={props.currentValue !== undefined ? props.currentValue : ''}
                    placeholder='Enter a value...'
                    type='number'
                    onChange={(e) => props.onValueChange(parseFloat(e.target.value))}
                />
            </div>
        </BuiltInSlotWrapper>
    );
};

export default SimpleNumberInput;
