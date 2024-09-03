import React from 'react';
import { ContextArrayItem, ExpEditorContext, SlotDef, SlotInputDefSelectorFromContext } from '../utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import BuiltInSlotWrapper from './BuiltInSlotWrapper';

interface SelectorFromContextProps {
    slotDef: SlotDef;
    slotTypeDef: SlotInputDefSelectorFromContext;
    context?: ExpEditorContext;
    depth?: number;
    currentValue?: string;
    onSelect: (value: string) => void;
    onClearSlot: () => void;
}

const SelectorFromContext: React.FC<SelectorFromContextProps> = (props) => {
    let contextValues: Array<ContextArrayItem> | undefined = props.context?.[props.slotTypeDef.contextArrayKey] as Array<ContextArrayItem> | undefined;
    if (!Array.isArray(contextValues)) {
        contextValues = undefined;
    }
    if (contextValues !== undefined && props.slotTypeDef.filterForItemType !== undefined) {
        contextValues = contextValues.filter((cv) => cv.type === props.slotTypeDef.filterForItemType)
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
            isInvalid={props.currentValue === undefined || props.currentValue === ''}
            onClearSlot={props.onClearSlot}
        >

            <div className='px-2 py-2'>
                <Select
                    value={props.currentValue || ''}
                    onValueChange={props.onSelect}
                >
                    <SelectTrigger className="">
                        <SelectValue placeholder="Select a value..." />
                    </SelectTrigger>
                    <SelectContent>
                        {contextValues?.map((cv) => (
                            <SelectItem key={cv.key} value={cv.key}>
                                {cv.label}
                            </SelectItem>
                        )
                        )}
                    </SelectContent>
                </Select>
            </div>
        </BuiltInSlotWrapper>
    );
};

export default SelectorFromContext;
