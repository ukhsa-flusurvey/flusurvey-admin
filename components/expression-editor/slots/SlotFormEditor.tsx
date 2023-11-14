import { cn } from '@/lib/utils';
import React from 'react';
import { ExpEditorContext, ExpressionArg, SlotDef, SlotInputDef } from '../utils';
import SlotLabel from '../components/SlotLabel';
import SelectorFromContext from '../components/SelectorFromContext';

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
        default:
            return (<p>
                Slot type not supported: {props.currentSlotType} of type {currentFormDef.type}
            </p>)
    }
};

export default SlotFormEditor;
