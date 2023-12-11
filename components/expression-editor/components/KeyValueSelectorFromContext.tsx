import React from 'react';
import { ContextObjectItem, ExpEditorContext, SlotDef, SlotInputDefFormKeyValueFromContext } from '../utils';
import SlotLabel from './SlotLabel';
import Block from './Block';
import BlockHeader from './BlockHeader';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface KeyValueSelectorFromContextProps {
    slotDef: SlotDef;
    slotTypeDef: SlotInputDefFormKeyValueFromContext;
    context?: ExpEditorContext;
    depth?: number;
    currentKey?: string;
    currentValue?: string;
    onSelect: (key?: string, value?: string) => void;
}

const KeyValueSelectorFromContext: React.FC<KeyValueSelectorFromContextProps> = (props) => {
    let contextObject: ContextObjectItem | undefined = { ...props.context?.[props.slotTypeDef.contextObjectKey] } as ContextObjectItem | undefined;

    const [currentKey, setCurrentKey] = React.useState<string | undefined>(props.currentKey);
    const [currentValue, setCurrentValue] = React.useState<string | undefined>(props.currentValue);

    React.useEffect(() => {
        setCurrentKey(props.currentKey);
    }, [props.currentKey])

    React.useEffect(() => {
        setCurrentValue(props.currentValue);
    }, [props.currentValue])

    if (contextObject !== undefined && props.slotTypeDef.filterForObjectType !== undefined) {
        // delete key where type does not match
        for (const key in contextObject) {
            if (contextObject[key].type !== props.slotTypeDef.filterForObjectType) {
                delete contextObject[key];
            }
        }
    }

    const possibleKeys = Object.keys(contextObject || {});
    const possibleValues = contextObject?.[currentKey || '']?.values || [];


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

                <div className='px-2 py-2 grid grid-cols-1 md:grid-cols-2 gap-2'>
                    <Select
                        value={currentKey || ''}
                        onValueChange={(value) => {
                            props.onSelect(value, undefined);
                        }}
                    >
                        <SelectTrigger className="">
                            <SelectValue placeholder="Select a key..." />
                        </SelectTrigger>
                        <SelectContent>
                            {possibleKeys?.map((cv) => (
                                <SelectItem key={cv} value={cv}>
                                    {cv}
                                </SelectItem>
                            )
                            )}
                        </SelectContent>
                    </Select>
                    <Select
                        value={currentValue || ''}
                        onValueChange={(value) => {
                            props.onSelect(currentKey, value);
                        }}
                        disabled={props.currentKey === undefined}
                    >
                        <SelectTrigger className="">
                            <SelectValue placeholder="Select a value..." />
                        </SelectTrigger>
                        <SelectContent>
                            {possibleValues?.map((cv) => (
                                <SelectItem key={cv} value={cv}>
                                    {cv}
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

export default KeyValueSelectorFromContext;
