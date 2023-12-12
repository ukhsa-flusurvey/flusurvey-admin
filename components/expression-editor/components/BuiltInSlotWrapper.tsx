import React from 'react';
import SlotLabel from './SlotLabel';
import Block from './Block';
import BlockHeader from './BlockHeader';
import { ColorVariant, IconVariant } from '../utils';

interface BuiltInSlotWrapperProps {
    children?: React.ReactNode;
    slotLabel: {
        label: string;
        required?: boolean;
    }
    slotTypeDef: {
        color?: ColorVariant;
        icon?: IconVariant;
        label: string;
    }
    depth?: number;
    isInvalid?: boolean;
}

const BuiltInSlotWrapper: React.FC<BuiltInSlotWrapperProps> = (props) => {
    return (
        <div>
            <SlotLabel label={props.slotLabel.label} required={props.slotLabel.required} />
            <Block
                depth={props.depth}
                isInvalid={props.isInvalid}
            >
                <BlockHeader
                    color={props.slotTypeDef.color}
                    icon={props.slotTypeDef.icon}
                    label={props.slotTypeDef.label}
                />
                {props.children}
            </Block>
        </div>
    );
};

export default BuiltInSlotWrapper;
