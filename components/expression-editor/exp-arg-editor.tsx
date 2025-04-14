import React from 'react';
import { ExpArg, ExpEditorContext, Expression, ExpressionArg, ExpressionCategory, ExpressionDef, SelectSlotType, SlotDef, SlotInputDef, StrArg, lookupExpressionDef } from './utils';
import ListEditor from './slots/ListEditor';
import EmptySlot from './slots/EmptySlot';
import { toast } from 'sonner';
import SlotLabel from './components/SlotLabel';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import SlotFormEditor from './slots/SlotFormEditor';
import { ContextMenuItem, ContextMenuSeparator } from '../ui/context-menu';
import { useCopyToClipboard } from 'usehooks-ts';
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



const ensureMinLength = <T,>(arr: Array<T>, minLength: number): Array<T> => {
    if (arr.length >= minLength) {
        return [...arr]; // Return a copy of the array
    }

    // Create a new array with the correct length, filled with undefined
    const result = [...arr];
    result.length = minLength;

    return result;
}

const updateEntriesAfterIndex = <T,>(arr: Array<T>, index: number, newValues: Array<T>): Array<T> => {
    // Create a new array with at least startIndex + newEntries.length elements
    const targetLength = index + newValues.length;
    const result = ensureMinLength(arr.slice(0, targetLength), targetLength);

    // Update the entries starting from startIndex
    for (let i = 0; i < newValues.length; i++) {
        result[index + i] = newValues[i];
    }

    return result;
}

const ExpArgEditor: React.FC<ExpArgEditorProps> = ({
    slotDef,
    ...props
}) => {
    const [, copy] = useCopyToClipboard();

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
            const slotType = currentSlotTypes.at(argIndex) || (argValue as ExpArg)?.exp?.name;

            return {
                slotType: slotType,
                value: argValue
            }
        })

        return <ListEditor
            slotDef={slotDef}
            expRegistry={props.expRegistry}
            context={props.context}
            currentSlotValues={currentSlotValues}
            onChangeValues={(newValues, newSlotTypes) => {
                const currentData = [...props.availableExpData] || [];
                const updatedData = updateEntriesAfterIndex(currentData, props.currentIndex, newValues)

                const currentSlotTypes = props.availableMetadata?.slotTypes || []
                const updatedSlotTypes = updateEntriesAfterIndex(currentSlotTypes, props.currentIndex, newSlotTypes)

                props.onChange?.(
                    updatedData,
                    updatedSlotTypes
                )
            }}
            depth={props.depth}
        />
    }

    // Single slot editor:
    const currentSlotTypes = props.availableMetadata?.slotTypes || props.availableExpData.map(arg => (arg as ExpArg)?.exp?.name);
    const isSimpleSelect = slotDef.allowedTypes?.length === 1 && slotDef.allowedTypes[0].type === 'select';

    const isDefined = currentSlotTypes.at(props.currentIndex) !== undefined && currentSlotTypes.at(props.currentIndex) !== '';

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

                const currentArgs = props.availableExpData || []
                if (currentArgs.length < props.currentIndex) {
                    currentArgs.fill(undefined, currentArgs.length, props.currentIndex)
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
                        currentArgs[props.currentIndex] = content.value;
                        props.onChange?.(
                            currentArgs,
                            currentSlotTypes
                        )
                    } catch (error) {
                        toast.error('Error reading clipboard content');
                        console.error(error)
                    }
                    return;
                }


                currentSlotTypes[props.currentIndex] = slotTypeId;

                if (slotTypeId !== undefined) {
                    const expressionDef = lookupExpressionDef(slotTypeId, props.expRegistry.expressionDefs);
                    if (expressionDef?.defaultValue !== undefined) {
                        currentArgs[props.currentIndex] = JSON.parse(JSON.stringify(expressionDef.defaultValue));
                    }
                    if (expressionDef?.isTemplateFor) {
                        currentSlotTypes[props.currentIndex] = expressionDef.isTemplateFor;
                    }
                }

                props.onChange?.(
                    currentArgs,
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
                value={(currentArgValue as StrArg)?.str || ''}
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
    let currentExpression: Expression;
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
                            exp: newExpression,
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
