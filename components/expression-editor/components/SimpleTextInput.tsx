import React from 'react';
import { SlotDef, SlotInputDefSimple } from '../utils';
import { Input } from '@/components/ui/input';
import BuiltInSlotWrapper from './BuiltInSlotWrapper';

interface SimpleTextInputProps {
    slotDef: SlotDef;
    slotTypeDef: SlotInputDefSimple;
    depth?: number;
    currentValue?: string;
    onValueChange: (value: string) => void;
}

const SimpleTextInput: React.FC<SimpleTextInputProps> = (props) => {
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
            isInvalid={props.currentValue === undefined || props.currentValue === ''}
        >
            <div className='px-2 py-2'>
                <Input
                    value={props.currentValue || ''}
                    placeholder='Enter a value...'
                    onChange={(e) => props.onValueChange(e.target.value)}
                />
            </div>
        </BuiltInSlotWrapper>

    );
};

export default SimpleTextInput;
