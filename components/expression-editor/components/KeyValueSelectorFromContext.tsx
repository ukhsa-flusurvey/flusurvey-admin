import React from 'react';
import { ContextObjectItem, ExpArg, ExpEditorContext, ExpressionArg, ExpressionCategory, ExpressionDef, SlotDef, SlotInputDef, SlotInputDefFormKeyValueFromContext, StrArg } from '../utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import BuiltInSlotWrapper from './BuiltInSlotWrapper';
import ExpArgEditor from '../exp-arg-editor';

interface KeyValueSelectorFromContextProps {
    slotDef: SlotDef;
    slotTypeDef: SlotInputDefFormKeyValueFromContext;
    context?: ExpEditorContext;
    depth?: number;
    currentKey?: string;
    currentValue?: ExpressionArg;
    expRegistry: {
        expressionDefs: ExpressionDef[],
        categories: ExpressionCategory[],
        builtInSlotTypes: SlotInputDef[],
    };
    onSelect: (key?: string, value?: ExpressionArg) => void;
    onClearSlot: () => void;
}

const expressionOptionName = 'Dynamic value';

const KeyValueSelectorFromContext: React.FC<KeyValueSelectorFromContextProps> = (props) => {
    const contextObject: ContextObjectItem | undefined = { ...props.context?.[props.slotTypeDef.contextObjectKey] } as ContextObjectItem | undefined;

    const [currentKey, setCurrentKey] = React.useState<string | undefined>(props.currentKey);
    const [currentValue, setCurrentValue] = React.useState<string | undefined>();


    React.useEffect(() => {
        setCurrentKey(props.currentKey);
    }, [props.currentKey])

    React.useEffect(() => {
        let currentSelectValue = '';
        if (props.currentValue) {
            if (props.currentValue.dtype === 'exp') {
                currentSelectValue = expressionOptionName;
            } else {
                currentSelectValue = (props.currentValue as StrArg).str || '';
            }
        }
        setCurrentValue(currentSelectValue);
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
    const possibleValues = contextObject?.[currentKey || '']?.values.slice() || [];
    if (props.slotTypeDef.allowExpressionsForValue && !possibleValues.includes(expressionOptionName)) {
        possibleValues.splice(0, 0, expressionOptionName);
    }

    if (currentKey !== undefined && currentKey !== '' && !possibleKeys.includes(currentKey)) {
        possibleKeys?.push(currentKey)
    }

    if (currentValue !== undefined && currentValue !== '' && !possibleValues.includes(currentValue)) {
        possibleValues?.push(currentValue)
    }

    const usingDynamicValue = currentValue === expressionOptionName;

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
            isInvalid={props.currentValue === undefined || props.currentKey === undefined || props.currentKey === ''}
            onClearSlot={props.onClearSlot}
        >
            <div className='px-2 py-2 grid grid-cols-1 md:grid-cols-2 gap-2'>
                <Select
                    value={currentKey || ''}
                    onValueChange={(value) => {
                        if (currentValue === expressionOptionName) {
                            if (!confirm('Are you sure you want to replace the expression with a static value? This will remove the expression.')) {
                                return;
                            }
                        }
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
                    value={currentValue}
                    onValueChange={(value) => {
                        if (value === expressionOptionName) {
                            props.onSelect(currentKey, {
                                dtype: 'exp',
                                exp: {
                                    name: ''
                                }
                            });
                        } else {
                            if (currentValue === expressionOptionName) {
                                if (!confirm('Are you sure you want to replace the expression with a static value? This will remove the expression.')) {
                                    return;
                                }
                            }
                            props.onSelect(currentKey, {
                                dtype: 'str',
                                str: value
                            });
                        }
                    }
                    }
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
            {usingDynamicValue && <div className='px-2 py-2 '>
                <ExpArgEditor
                    slotDef={{
                        label: 'Value',
                        required: true,
                        allowedTypes: [
                            {
                                id: 'exp-slot',
                                type: 'expression',
                                allowedExpressionTypes: ['str', 'num']
                            }
                        ]
                    }}
                    currentIndex={0}
                    availableExpData={[
                        (props.currentValue as ExpArg)?.exp?.name ? props.currentValue : undefined
                    ]}
                    expRegistry={props.expRegistry}
                    onChange={(newArgs) => {
                        const newExp = newArgs.at(0);
                        if (newExp === undefined) {
                            props.onSelect(currentKey, undefined);
                            return;
                        }
                        props.onSelect(currentKey, newExp);
                    }}
                />
            </div>}
        </BuiltInSlotWrapper>
    );
};

export default KeyValueSelectorFromContext;
