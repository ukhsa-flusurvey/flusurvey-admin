import { cn } from '@/lib/utils';
import React from 'react';
import { ExpEditorContext, ExpressionArg, SlotDef, SlotInputDef } from '../utils';
import SlotLabel from '../components/SlotLabel';
import SelectorFromContext from '../components/SelectorFromContext';
import KeyValueSelectorFromContext from '../components/KeyValueSelectorFromContext';

interface SlotFormEditorProps {
    slotDef: SlotDef;
    currentSlotType: string;
    builtInSlotTypeDefinitions: SlotInputDef[];
    context?: ExpEditorContext;
    depth?: number;
    slotIndex: number;
    currentArgs?: Array<ExpressionArg | undefined>;
    onArgsChange: (newArgs: Array<ExpressionArg | undefined>) => void;
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


    //console.log(props.slotIndex)
    //console.log(props.slotDef.argIndexes)
    //console.log(props.currentArgs)


    switch (currentFormDef.type) {
        case 'list-selector':
            let currentIndex = props.slotIndex;
            if (props.slotDef.argIndexes !== undefined && props.slotDef.argIndexes.length > 0) {
                currentIndex = props.slotDef.argIndexes[0];
            }
            const currentArgValue = props.currentArgs?.at(currentIndex)?.str;

            return (<SelectorFromContext
                slotDef={props.slotDef}
                context={props.context}
                slotTypeDef={currentFormDef}
                depth={props.depth}
                currentValue={currentArgValue}
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
            />)
        case 'key-value':
            let currentKeyIndex = props.slotIndex;
            let currentValueIndex = props.slotIndex + 1;
            if (props.slotDef.argIndexes !== undefined && props.slotDef.argIndexes.length > 1) {
                currentKeyIndex = props.slotDef.argIndexes[0];
                currentValueIndex = props.slotDef.argIndexes[1];
            }

            const currentKey = props.currentArgs?.at(currentKeyIndex)?.str;;
            const currentValue = props.currentArgs?.at(currentValueIndex)?.str;;
            return (<KeyValueSelectorFromContext
                slotDef={props.slotDef}
                context={props.context}
                slotTypeDef={currentFormDef}
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
            />)
        default:
            return (<p>
                Slot type not supported: {props.currentSlotType} of type {currentFormDef.type}
            </p>)
    }
};

export default SlotFormEditor;
