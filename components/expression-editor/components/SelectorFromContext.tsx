import React from 'react';
import { ContextArrayItem, ExpEditorContext, SlotDef, SlotInputDefSelectorFromContext } from '../utils';
import SlotLabel from './SlotLabel';
import ExpressionIcon from './ExpressionIcon';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import BlockHeader from './BlockHeader';
import Block from './Block';

interface SelectorFromContextProps {
    slotDef: SlotDef;
    slotTypeDef: SlotInputDefSelectorFromContext;
    context?: ExpEditorContext;
    depth?: number;
    currentValue?: string;
    onSelect: (value: string) => void;
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
            </Block>
        </div>

    );
};

export default SelectorFromContext;
