import React, { useEffect } from 'react';
import { SlotDef, SlotInputDefSimple } from '../utils';
import BuiltInSlotWrapper from './BuiltInSlotWrapper';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface TimedeltaInputProps {
    slotDef: SlotDef;
    slotTypeDef: SlotInputDefSimple;
    depth?: number;
    currentValue?: number;
    onValueChange: (value: number | undefined) => void;
    onClearSlot: () => void;
}

const units = ['seconds', 'minutes', 'hours', 'days', 'weeks'];

function toFixedIfNecessary(value: string, dp: number) {
    return +parseFloat(value).toFixed(dp);
}

const TimedeltaInput: React.FC<TimedeltaInputProps> = (props) => {

    const [currentUnit, setCurrentUnit] = React.useState<string>('days');

    let currentValue = props.currentValue;
    if (currentValue !== undefined && currentValue !== 0) {
        switch (currentUnit) {
            case 'seconds':
                // currentValue = props.currentValue;
                break;
            case 'minutes':
                currentValue = currentValue / 60;
                break;
            case 'hours':
                currentValue = currentValue / 60 / 60;
                break;
            case 'days':
                currentValue = currentValue / 60 / 60 / 24;
                break;
            case 'weeks':
                currentValue = currentValue / 60 / 60 / 24 / 7;
                break;
        }
        currentValue = toFixedIfNecessary(currentValue.toString(), 3);
    }

    const onValueChange = (value: number | undefined) => {
        let valueInSeconds = value;
        switch (currentUnit) {
            case 'seconds':
                valueInSeconds = value;
                break;
            case 'minutes':
                valueInSeconds = value && Math.round(value * 60);
                break;
            case 'hours':
                valueInSeconds = value && Math.round(value * 60 * 60);
                break;
            case 'days':
                valueInSeconds = value && Math.round(value * 60 * 60 * 24);
                break;
            case 'weeks':
                valueInSeconds = value && Math.round(value * 60 * 60 * 24 * 7);
                break;
        }
        props.onValueChange(valueInSeconds);
    }

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
            <div className='px-2 py-2 grid grid-cols-1 md:grid-cols-2 gap-2'>
                <Input
                    type='number'
                    placeholder='Enter a value...'
                    value={currentValue !== undefined ? currentValue : ''}
                    onChange={(e) => {
                        onValueChange(Number(e.target.value))
                    }}
                />
                <Select
                    value={currentUnit}
                    onValueChange={setCurrentUnit}
                >
                    <SelectTrigger className="">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {units?.map((cv) => (
                            <SelectItem key={cv} value={cv}>
                                {cv}
                            </SelectItem>
                        )
                        )}
                    </SelectContent>
                </Select>
            </div>
        </BuiltInSlotWrapper>
    );
};

export default TimedeltaInput;
