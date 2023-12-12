import React from 'react';
import { ExpEditorContext, SlotDef, SlotInputDefSimple } from '../utils';
import SlotLabel from './SlotLabel';
import Block from './Block';
import BlockHeader from './BlockHeader';
import { Input } from '@/components/ui/input';

interface SimpleTextInputProps {
    slotDef: SlotDef;
    slotTypeDef: SlotInputDefSimple;
    context?: ExpEditorContext;
    depth?: number;
    currentValue?: string;
    onSelect: (value: string) => void;
}

const SimpleTextInput: React.FC<SimpleTextInputProps> = (props) => {
    return (
        <div>
            <SlotLabel label={props.slotDef.label} required={props.slotDef.required} />
            <Block
                depth={props.depth}
                isInvalid={props.currentValue === undefined || props.currentValue === ''}
            >
                <BlockHeader
                    color={props.slotTypeDef.color}
                    icon={props.slotTypeDef.icon}
                    label={props.slotTypeDef.label}
                />

                <div className='px-2 py-2'>
                    <Input
                        value={props.currentValue || ''}
                        placeholder='Enter a value...'
                        onChange={(e) => props.onSelect(e.target.value)}
                    />
                </div>
            </Block>
        </div>
    );
};

export default SimpleTextInput;
