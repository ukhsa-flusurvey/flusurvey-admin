import React from 'react';
import { ExpEditorContext, ExpressionArg, NumArg, SlotDef, SlotInputDef, SlotInputDefFormKeyValueFromContext, SlotInputDefKeyValueList, SlotInputDefSelectorFromContext, StrArg } from '../utils';
import SelectorFromContext from '../components/SelectorFromContext';
import KeyValueSelectorFromContext from '../components/KeyValueSelectorFromContext';
import SimpleTextInput from '../components/SimpleTextInput';
import DatePicker from '../components/DatePicker';
import TimedeltaInput from '../components/TimedeltaInput';
import SimpleNumberInput from '../components/simple-number-input';
import KeyValueListFromContext from '../components/key-value-list-from-context';


interface SlotFormEditorProps {
    slotDef: SlotDef;
    currentSlotType: string;
    builtInSlotTypeDefinitions: SlotInputDef[];
    context?: ExpEditorContext;
    depth?: number;
    slotIndex: number;
    currentArgs?: Array<ExpressionArg | undefined>;
    onArgsChange: (newArgs: Array<ExpressionArg | undefined>) => void;
    onClearSlot: () => void;
}

const isSingleValueSlot = (type: string) => {
    return ['str', 'num', 'list-selector', 'date', 'time-delta'].includes(type);
}

const SlotFormEditor: React.FC<SlotFormEditorProps> = (props) => {

    const currentFormDef = props.builtInSlotTypeDefinitions.find(def => def.id === props.currentSlotType)

    if (!currentFormDef) {
        return (
            <div>
                <p>Slot type not found: {props.currentSlotType}</p>
            </div>
        )
    }

    if (isSingleValueSlot(currentFormDef.type)) {
        let currentIndex = props.slotIndex;
        if (props.slotDef.argIndexes !== undefined && props.slotDef.argIndexes.length > 0) {
            currentIndex = props.slotDef.argIndexes[0];
        }
        const currentArgValue = props.currentArgs?.at(currentIndex);

        switch (currentFormDef.type) {
            case 'list-selector':
                return (<SelectorFromContext
                    slotDef={props.slotDef}
                    context={props.context}
                    slotTypeDef={currentFormDef as SlotInputDefSelectorFromContext}
                    depth={props.depth}
                    currentValue={(currentArgValue as StrArg)?.str}
                    onSelect={(value) => {
                        console.log(value)
                        const currentData = props.currentArgs || [];
                        if (currentData.length < currentIndex) {
                            currentData.fill(undefined, currentData.length, currentIndex)
                        }
                        currentData[currentIndex] = {
                            str: value,
                            dtype: 'str'
                        }
                        props.onArgsChange(currentData)
                    }}
                    onClearSlot={props.onClearSlot}
                />)
            case 'str':
                return <SimpleTextInput
                    slotDef={props.slotDef}
                    slotTypeDef={currentFormDef}
                    depth={props.depth}
                    currentValue={(currentArgValue as StrArg)?.str}
                    onValueChange={(value) => {
                        const currentData = props.currentArgs || [];
                        if (currentData.length < props.slotIndex) {
                            currentData.fill(undefined, currentData.length, props.slotIndex)
                        }
                        currentData[props.slotIndex] = {
                            str: value,
                            dtype: 'str'
                        }
                        props.onArgsChange(currentData)
                    }}
                    onClearSlot={props.onClearSlot}
                />
            case 'num':
                return <SimpleNumberInput
                    slotDef={props.slotDef}
                    slotTypeDef={currentFormDef}
                    depth={props.depth}
                    currentValue={(currentArgValue as NumArg)?.num}
                    onValueChange={(value) => {
                        const currentData = props.currentArgs || [];
                        if (currentData.length < props.slotIndex) {
                            currentData.fill(undefined, currentData.length, props.slotIndex)
                        }
                        currentData[props.slotIndex] = {
                            num: value,
                            dtype: 'num'
                        }
                        props.onArgsChange(currentData)
                    }}
                    onClearSlot={props.onClearSlot}
                />
            case 'date':
                return <DatePicker
                    slotDef={props.slotDef}
                    slotTypeDef={currentFormDef}
                    depth={props.depth}
                    currentValue={(currentArgValue as NumArg)?.num}
                    onValueChange={(value) => {
                        const currentData = props.currentArgs || [];
                        if (currentData.length < props.slotIndex) {
                            currentData.fill(undefined, currentData.length, props.slotIndex)
                        }
                        currentData[props.slotIndex] = {
                            num: value,
                            dtype: 'num'
                        }
                        props.onArgsChange(currentData)
                    }}
                    onClearSlot={props.onClearSlot}
                />
            case 'time-delta':
                return <TimedeltaInput
                    slotDef={props.slotDef}
                    slotTypeDef={currentFormDef}
                    depth={props.depth}
                    currentValue={(currentArgValue as NumArg)?.num}
                    onValueChange={(value) => {
                        const currentData = props.currentArgs || [];
                        if (currentData.length < props.slotIndex) {
                            currentData.fill(undefined, currentData.length, props.slotIndex)
                        }
                        if (value === undefined) {
                            currentData[props.slotIndex] = undefined;
                        } else {
                            currentData[props.slotIndex] = {
                                num: value,
                                dtype: 'num'
                            }
                        }
                        props.onArgsChange(currentData)
                    }}
                    onClearSlot={props.onClearSlot}
                />
            default:
                return <p>Slot type not supported: {props.currentSlotType} of type {currentFormDef.type}</p>
        }
    } else {
        let currentKeyIndex = props.slotIndex;
        let currentValueIndex = props.slotIndex + 1;
        switch (currentFormDef.type) {
            case 'key-value':
                if (props.slotDef.argIndexes !== undefined && props.slotDef.argIndexes.length > 1) {
                    currentKeyIndex = props.slotDef.argIndexes[0];
                    currentValueIndex = props.slotDef.argIndexes[1];
                }

                const currentKey = (props.currentArgs?.at(currentKeyIndex) as StrArg)?.str;
                const currentValue = (props.currentArgs?.at(currentValueIndex) as StrArg)?.str;
                return (<KeyValueSelectorFromContext
                    slotDef={props.slotDef}
                    context={props.context}
                    slotTypeDef={currentFormDef as SlotInputDefFormKeyValueFromContext}
                    depth={props.depth}
                    currentValue={currentValue}
                    currentKey={currentKey}
                    onSelect={(key, value) => {
                        const currentData = props.currentArgs || [];
                        if (currentData.length < currentValueIndex) {
                            currentData.fill(undefined, currentData.length, currentValueIndex)
                        }
                        if (key !== undefined) {
                            currentData[currentKeyIndex] = {
                                str: key,
                                dtype: 'str'
                            }
                        } else {
                            currentData[currentKeyIndex] = undefined;
                            currentData[currentValueIndex] = undefined;
                        }
                        if (value !== undefined) {
                            currentData[currentValueIndex] = {
                                str: value,
                                dtype: 'str'
                            }
                        } else {
                            currentData[currentValueIndex] = undefined;
                        }

                        props.onArgsChange(currentData)
                    }}
                    onClearSlot={props.onClearSlot}
                />);
            case 'key-value-list':
                if (props.slotDef.argIndexes !== undefined && props.slotDef.argIndexes.length > 1) {
                    currentKeyIndex = props.slotDef.argIndexes[0];
                    currentValueIndex = props.slotDef.argIndexes[1];
                }

                const currentListValues = props.currentArgs?.slice(currentValueIndex + 1)?.map(arg => (arg as StrArg)?.str);

                return (<KeyValueListFromContext
                    slotDef={props.slotDef}
                    context={props.context}
                    slotTypeDef={currentFormDef as SlotInputDefKeyValueList}
                    depth={props.depth}
                    currentValue={{
                        itemKey: (props.currentArgs?.at(currentKeyIndex) as StrArg)?.str,
                        slotKey: (props.currentArgs?.at(currentValueIndex) as StrArg)?.str,
                        listValues: currentListValues
                    }}
                    onChange={(newValue) => {
                        const currentData = props.currentArgs !== undefined ? [...props.currentArgs] : [];
                        if (currentData.length < currentValueIndex) {
                            currentData.fill(undefined, currentData.length, currentValueIndex)
                        }

                        currentData[currentKeyIndex] = {
                            str: newValue.itemKey || '',
                            dtype: 'str' as const
                        }
                        currentData[currentValueIndex] = {
                            str: newValue.slotKey || '',
                            dtype: 'str' as const
                        }

                        const newOptions = newValue.listValues?.map(value => ({
                            str: value || '',
                            dtype: 'str' as const
                        }))


                        currentData.splice(currentValueIndex + 1, currentData.length - currentValueIndex - 1)
                        if (newOptions !== undefined) {
                            currentData.push(...newOptions)
                        }

                        props.onArgsChange([...currentData])
                    }}
                    onClearSlot={() => {
                        props.onClearSlot()
                        props.onArgsChange([])
                    }}
                />)
            default:
                return (<p>
                    Slot type not supported: {props.currentSlotType} of type {currentFormDef.type}
                </p>)
        }
    }
};

export default SlotFormEditor;
