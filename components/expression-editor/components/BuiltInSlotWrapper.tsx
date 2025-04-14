import React from 'react';
import SlotLabel from './SlotLabel';
import Block from './Block';
import BlockHeader from './BlockHeader';
import { ColorVariant, IconVariant } from '../utils';
import { ContextMenuItem } from '@/components/ui/context-menu';
import { X } from 'lucide-react';

interface BuiltInSlotWrapperProps {
    children?: React.ReactNode;
    slotLabel: {
        label?: string;
        required?: boolean;
    }
    slotTypeDef: {
        color?: ColorVariant;
        icon?: IconVariant;
        label: string;
    }
    depth?: number;
    isInvalid?: boolean;
    onClearSlot?: () => void;
}

const BuiltInSlotWrapper: React.FC<BuiltInSlotWrapperProps> = (props) => {
    return (
        <div>
            {props.slotLabel.label && <SlotLabel label={props.slotLabel.label} required={props.slotLabel.required}
                contextMenuContent={
                    <>
                        <ContextMenuItem
                            onClick={() => {
                                if (!confirm('Are you sure you want to delete the values of this slot? This cannot be undone.')) {
                                    return;
                                }
                                props.onClearSlot?.();
                            }}
                        >
                            <X className='w-4 h-4 mr-2 text-red-400' />
                            Clear Slot
                        </ContextMenuItem>
                    </>
                }
            />}
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
