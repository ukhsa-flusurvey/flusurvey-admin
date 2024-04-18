import React from 'react';
import { ExpEditorContext, ExpressionArg, ExpressionCategory, ExpressionDef, SelectSlotType, SlotDef, SlotInputDef } from './utils';
import ListEditor from './slots/ListEditor';
import EmptySlot from './slots/EmptySlot';
import { toast } from 'sonner';
import SlotLabel from './components/SlotLabel';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import SlotFormEditor from './slots/SlotFormEditor';
import { Expression as CaseExpression } from 'survey-engine/data_types';
import { ContextMenuItem, ContextMenuSeparator } from '../ui/context-menu';
import { useCopyToClipboard } from 'usehooks-ts';
import { useClipboardValue } from '@/hooks/useClipboardValue';
import { Copy, X } from 'lucide-react';
import ExpressionPreview from './slots/ExpressionPreview';
import Block from './components/Block';
import ExpressionEditor from './ExpressionEditor';

interface ExpArgEditorProps {
    slotDef: SlotDef;
    currentIndex: number;
    availableExpData: Array<ExpressionArg | undefined>;
    availableMetadata?: {
        slotTypes: Array<string | undefined>;
    };
    context?: ExpEditorContext;
    expRegistry: {
        expressionDefs: ExpressionDef[],
        categories: ExpressionCategory[],
        builtInSlotTypes: SlotInputDef[],
    };
    depth?: number;
    isHidden?: boolean;
    onToggleHide?: (newState: boolean) => void;
    onChange?: (
        newArgs: Array<ExpressionArg | undefined>,
        newSlotTypes: Array<string | undefined>
    ) => void;
}

const ExpArgEditor: React.FC<ExpArgEditorProps> = ({
    slotDef,
    ...props
}) => {
    const [copiedText, copy] = useCopyToClipboard();
    const [clipboardValue, readClipboard] = useClipboardValue();

    const isListSlot = slotDef.isListSlot || false;

    if (isListSlot) {
        const currentArgValues: Array<ExpressionArg | undefined> = []
        if (props.availableExpData && props.availableExpData.length > props.currentIndex) {
            currentArgValues.push(...props.availableExpData.slice(props.currentIndex))
        }

        const currentSlotTypes: Array<string | undefined> = []
        if (props.availableMetadata?.slotTypes && props.availableMetadata?.slotTypes.length > props.currentIndex) {
            currentSlotTypes.push(...props.availableMetadata?.slotTypes.slice(props.currentIndex))
        }

        const currentSlotValues = currentArgValues.map((argValue, argIndex) => {
            return {
                slotType: currentSlotTypes.at(argIndex),
                value: argValue
            }
        })

        return <ListEditor
            slotDef={slotDef}
            expRegistry={props.expRegistry}
            context={props.context}
            currentSlotValues={currentSlotValues}
            onChangeValues={(newValues, newSlotTypes) => {
                const currentData = props.availableExpData || [];
                if (currentData.length < props.currentIndex) {
                    currentData.fill(undefined, currentData.length, props.currentIndex)
                }

                const currentSlotTypes = props.availableMetadata?.slotTypes || []
                if (currentSlotTypes.length < props.currentIndex) {
                    currentSlotTypes.fill(undefined, currentSlotTypes.length, props.currentIndex)
                }

                // replace list from index
                currentData.splice(props.currentIndex, currentData.length - props.currentIndex, ...newValues)
                currentSlotTypes.splice(props.currentIndex, currentSlotTypes.length - props.currentIndex, ...newSlotTypes)
                props.onChange?.(
                    currentData,
                    currentSlotTypes
                )
            }}
            depth={props.depth}
        />
    }

    // Single slot editor:


    const currentSlotTypes = props.availableMetadata?.slotTypes || []

    const isSimpleSelect = slotDef.allowedTypes?.length === 1 && slotDef.allowedTypes[0].type === 'select';

    const isDefined = currentSlotTypes.at(props.currentIndex) !== undefined;

    // Empty slot:
    if (!isDefined && !isSimpleSelect) {
        return <EmptySlot
            slotDef={slotDef}
            expRegistry={props.expRegistry}
            onSelect={async (slotTypeId) => {
                const currentSlotTypes = props.availableMetadata?.slotTypes || []
                if (currentSlotTypes.length < props.currentIndex) {
                    currentSlotTypes.fill(undefined, currentSlotTypes.length, props.currentIndex)
                }


                if (slotTypeId === 'clipboard') {
                    // paste item from clipboard
                    try {
                        const cbContent = await navigator.clipboard.readText();
                        const content = JSON.parse(cbContent);
                        console.log(content)
                        if (!content || !content.slotType || !content.value) {
                            toast.error('Clipboard content is not valid');
                            return;
                        }
                        currentSlotTypes[props.currentIndex] = content.slotType;
                        const currentData = props.availableExpData || [];
                        if (currentData.length < props.currentIndex) {
                            currentData.fill(undefined, currentData.length, props.currentIndex)
                        }
                        currentData[props.currentIndex] = content.value;
                        props.onChange?.(
                            currentData,
                            currentSlotTypes
                        )
                    } catch (error) {
                        toast.error('Error reading clipboard content');
                        console.error(error)
                    }
                    return;
                }


                currentSlotTypes[props.currentIndex] = slotTypeId;
                props.onChange?.(
                    props.availableExpData || [],
                    currentSlotTypes
                )
            }}
        />
    }

    // Select slot:
    if (isSimpleSelect) {
        let currentIndex = props.currentIndex;
        if (slotDef.argIndexes !== undefined && slotDef.argIndexes.length > 0) {
            currentIndex = slotDef.argIndexes[0];
        }

        const currentArgValue = props.availableExpData?.at(currentIndex);
        const options = (slotDef.allowedTypes?.at(0) as SelectSlotType).options || [];
        return <div key={props.currentIndex}>
            <SlotLabel label={slotDef.label} required={slotDef.required} />
            <Select
                value={currentArgValue?.str || ''}
                onValueChange={(value) => {
                    const currentData = props.availableExpData || [];
                    if (currentData.length < props.currentIndex) {
                        currentData.fill(undefined, currentData.length, props.currentIndex)
                    }
                    currentData[props.currentIndex] = {
                        str: value,
                        dtype: 'str'
                    }
                    props.onChange?.(
                        currentData,
                        currentSlotTypes
                    )
                }}
            >
                <SelectTrigger>
                    <SelectValue
                        placeholder="Select a value..." />
                </SelectTrigger>
                <SelectContent>
                    {options?.map((option) => {
                        return <SelectItem key={option.key} value={option.key}>{option.label}</SelectItem>
                    })}
                </SelectContent>
            </Select>
        </div>
    }


    // extract values for current slot type
    const currentSlotType = currentSlotTypes.at(props.currentIndex) || '';
    const expressionDef = props.expRegistry.expressionDefs.find((expDef) => expDef.id === currentSlotType)
    const isExpression = expressionDef !== undefined;

    if (!isExpression) {
        return <SlotFormEditor
            currentSlotType={currentSlotType}
            slotDef={slotDef}
            key={props.currentIndex}
            builtInSlotTypeDefinitions={props.expRegistry.builtInSlotTypes}
            context={props.context}
            depth={props.depth}
            slotIndex={props.currentIndex}
            currentArgs={props.availableExpData || []}
            onArgsChange={(newArgs) => {
                props.onChange?.(
                    newArgs,
                    currentSlotTypes
                )
            }}
            onClearSlot={() => {
                const currentIndex = props.currentIndex;
                const currentData = props.availableExpData || [];
                if (currentData.length < currentIndex) {
                    currentData.fill(undefined, currentData.length, currentIndex)
                }
                const currentSlotTypes = props.availableMetadata?.slotTypes || []
                if (currentSlotTypes.length < currentIndex) {
                    currentSlotTypes.fill(undefined, currentSlotTypes.length, currentIndex)
                }

                currentSlotTypes[currentIndex] = undefined;
                currentData[currentIndex] = undefined;
                props.onChange?.(
                    currentData,
                    currentSlotTypes
                )
            }}
        />
    }


    let currentIndex = props.currentIndex;
    if (slotDef.argIndexes !== undefined && slotDef.argIndexes.length > 0) {
        currentIndex = slotDef.argIndexes[0];
    }

    const currentArgValue = props.availableExpData.at(currentIndex);
    let currentExpression: CaseExpression;
    if (currentArgValue?.dtype === 'exp' && currentArgValue.exp !== undefined) {
        currentExpression = currentArgValue.exp;
    } else {
        currentExpression = { name: expressionDef.id }
    }

    const isHidden = props.isHidden || false;

    return <div>
        <SlotLabel label={slotDef.label} required={slotDef.required}
            depth={props.depth}
            isHidden={isHidden}
            toggleHide={() => props.onToggleHide?.(!isHidden)}
            contextMenuContent={
                <>
                    <ContextMenuItem
                        onClick={() => {
                            const cbContent = {
                                slotType: currentSlotType,
                                value: currentArgValue
                            }
                            //navigator.clipboard.writeText(JSON.stringify(cbContent));
                            copy(JSON.stringify(cbContent));
                            toast('Item copied to clipboard');
                        }}
                    >
                        <Copy className='w-4 h-4 mr-2 text-slate-400' />
                        Copy
                    </ContextMenuItem>
                    <ContextMenuSeparator />
                    <ContextMenuItem
                        onClick={() => {
                            if (!confirm('Are you sure you want to delete the values of this slot? This cannot be undone.')) {
                                return;
                            }
                            const currentData = props.availableExpData || [];
                            if (currentData.length < currentIndex) {
                                currentData.fill(undefined, currentData.length, currentIndex)
                            }
                            const currentSlotTypes = props.availableMetadata?.slotTypes || []
                            if (currentSlotTypes.length < currentIndex) {
                                currentSlotTypes.fill(undefined, currentSlotTypes.length, currentIndex)
                            }

                            currentSlotTypes[currentIndex] = undefined;
                            currentData[currentIndex] = undefined;
                            props.onChange?.(
                                currentData,
                                currentSlotTypes
                            )
                        }}
                    >
                        <X className='w-4 h-4 mr-2 text-red-400' />
                        Clear Slot
                    </ContextMenuItem>
                </>
            }
        />

        {isHidden ? <ExpressionPreview
            expressionValue={currentExpression}
            expRegistry={props.expRegistry}
            depth={props.depth}
        />
            :
            <Block depth={props.depth}>
                <ExpressionEditor
                    expRegistry={props.expRegistry}
                    expressionValue={currentExpression}
                    depth={(props.depth || 0) + 1}
                    context={props.context}
                    onChange={(newExpression) => {
                        const currentData = props.availableExpData || [];
                        if (currentData.length < currentIndex) {
                            currentData.fill(undefined, currentData.length, currentIndex)
                        }
                        currentData[currentIndex] = {
                            exp: newExpression as CaseExpression,
                            dtype: 'exp'
                        }

                        props.onChange?.(
                            currentData,
                            currentSlotTypes
                        )
                    }}
                />
            </Block>
        }
    </div>

};

export default ExpArgEditor;
