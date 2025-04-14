import React, { useState } from 'react';
import { ExpEditorContext, Expression, ExpressionArg, ExpressionCategory, ExpressionDef, SlotDef, SlotInputDef, getRecommendedSlotTypes, lookupExpressionDef } from '../utils';
import SlotTypeSelector from '../components/SlotTypeSelector';
import SlotLabel from '../components/SlotLabel';
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronUp, Copy, X } from 'lucide-react';
import { ContextMenuItem, ContextMenuSeparator } from '@/components/ui/context-menu';
import ExpressionPreview from './ExpressionPreview';
import ExpressionEditor from '../ExpressionEditor';
import Block from '../components/Block';
import { toast } from 'sonner';
import SlotFormEditor from './SlotFormEditor';


interface ListEditorProps {
    slotDef: SlotDef;
    currentSlotValues: Array<{
        slotType: string | undefined,
        value: ExpressionArg | undefined,
    }>;
    expRegistry: {
        expressionDefs: ExpressionDef[],
        categories: ExpressionCategory[]
        builtInSlotTypes: SlotInputDef[],
    };
    context?: ExpEditorContext;
    onChangeValues: (newValues: Array<ExpressionArg | undefined>, newSlotTypes: Array<string | undefined>) => void;
    depth?: number;
}

const ListEditor: React.FC<ListEditorProps> = (props) => {
    const [hideSlotContent, setHideSlotContent] = useState<Array<number>>([]);

    const listCircle = <span className={cn(
        "absolute flex items-center justify-center w-[20px] h-[20px]",
        "rounded-full -left-[47px] top-[2px]",
        "bg-neutral-400",
        "ring-4",
        {
            "ring-slate-100": (props.depth || 0) % 2 === 0,
            "ring-slate-50": (props.depth || 0) % 2 !== 0,
        })}>

    </span>

    const renderItemEditor = (index: number, currentSlot: {
        slotType: string | undefined,
        value: ExpressionArg | undefined,
    }, isHidden: boolean) => {
        const currentSlotType = currentSlot.slotType || '';
        const expressionDef = props.expRegistry.expressionDefs.find((expDef) => expDef.id === currentSlotType)
        const currentArgValue = currentSlot.value;
        const isExpression = expressionDef !== undefined;

        if (!isExpression) {
            console.log(currentArgValue, currentSlotType);
            return <SlotFormEditor
                currentSlotType={currentSlotType}
                slotDef={{
                    label: '',
                    required: false,
                }}
                builtInSlotTypeDefinitions={props.expRegistry.builtInSlotTypes}
                context={props.context}
                depth={props.depth}
                slotIndex={index}
                currentArgs={[currentArgValue]}
                onArgsChange={(newArgs) => {
                    const newValues = [...props.currentSlotValues].map((val) => val.value);
                    newValues[index] = newArgs[0];
                    props.onChangeValues(
                        newValues,
                        props.currentSlotValues.map((val) => val.slotType)
                    );

                }}
                onClearSlot={() => {
                }}
            />
        }

        let currentExpression: Expression;
        if (currentArgValue?.dtype === 'exp' && currentArgValue.exp !== undefined) {
            currentExpression = currentArgValue.exp;
        } else {
            // create empty expression
            currentExpression = { name: expressionDef.id }
        }

        return (
            <>
                {isHidden && <ExpressionPreview
                    expRegistry={props.expRegistry}
                    expressionValue={currentExpression}
                    depth={props.depth}
                />}
                {!isHidden && <Block depth={props.depth}>
                    <ExpressionEditor
                        expRegistry={props.expRegistry}
                        expressionValue={currentExpression}
                        depth={(props.depth || 0) + 1}
                        context={props.context}
                        onChange={(newExpression) => {
                            const newValues = [...props.currentSlotValues].map((val) => val.value);
                            newValues[index] = {
                                exp: newExpression,
                                dtype: 'exp'
                            }
                            props.onChangeValues(
                                newValues,
                                props.currentSlotValues.map((val) => val.slotType)
                            );
                        }}
                    />
                </Block>}
            </>
        )
    }

    return (
        <div>
            <SlotLabel label={props.slotDef.label} required={props.slotDef.required} />
            <div className='pl-[15px]'>
                <ol className="relative border-l-2 border-neutral-300 space-y-[42px]">
                    {props.currentSlotValues.map((currentSlot, index) => {
                        if (currentSlot === undefined) {
                            return <div key={index}>
                                <p> slot is undefined </p>
                            </div>
                        }

                        const isHidden = hideSlotContent.includes(index);

                        return (
                            <li className="ml-[36px] relative" key={index.toFixed()}>
                                {listCircle}
                                <SlotLabel
                                    depth={props.depth}
                                    label={'Item ' + (index + 1)} required={props.slotDef.required}
                                    isHidden={isHidden}
                                    toggleHide={() => {
                                        // console.log('toggle hide')
                                        if (isHidden) {
                                            setHideSlotContent(prev => prev.filter((i) => i !== index))
                                        } else {
                                            setHideSlotContent(prev => { return [...prev, index] })
                                        }
                                    }}
                                    contextMenuContent={
                                        <>
                                            <ContextMenuItem
                                                onClick={() => {
                                                    const cbContent = {
                                                        slotType: currentSlot.slotType,
                                                        value: currentSlot.value
                                                    }
                                                    navigator.clipboard.writeText(JSON.stringify(cbContent));
                                                    toast(
                                                        'Item copied to clipboard',
                                                        { duration: 3000 }
                                                    )
                                                }}
                                            >
                                                <Copy className='w-4 h-4 mr-2 text-slate-400' />
                                                Copy
                                            </ContextMenuItem>
                                            <ContextMenuSeparator />
                                            <ContextMenuItem disabled={index === 0}
                                                onClick={() => {
                                                    const newValues = [...props.currentSlotValues];
                                                    const temp = newValues[index];
                                                    newValues[index] = newValues[index - 1];
                                                    newValues[index - 1] = temp;
                                                    props.onChangeValues(
                                                        newValues.map((value) => value?.value),
                                                        newValues.map((value) => value?.slotType)
                                                    );
                                                }}
                                            >
                                                <ChevronUp className='w-4 h-4 mr-2 text-slate-400' />
                                                Move Up
                                            </ContextMenuItem>
                                            <ContextMenuItem disabled={index === props.currentSlotValues.length - 1}
                                                onClick={() => {
                                                    const newValues = [...props.currentSlotValues];
                                                    const temp = newValues[index];
                                                    newValues[index] = newValues[index + 1];
                                                    newValues[index + 1] = temp;
                                                    props.onChangeValues(
                                                        newValues.map((value) => value?.value),
                                                        newValues.map((value) => value?.slotType)
                                                    );
                                                }}
                                            >
                                                <ChevronDown className='w-4 h-4 mr-2 text-slate-400' />
                                                Move Down
                                            </ContextMenuItem>
                                            <ContextMenuSeparator />
                                            <ContextMenuItem
                                                onClick={() => {
                                                    if (!confirm('Are you sure you want to delete this item? This action cannot be undone.')) {
                                                        return;
                                                    }
                                                    const newValues = [...props.currentSlotValues];
                                                    newValues.splice(index, 1);
                                                    props.onChangeValues(
                                                        newValues.map((value) => value?.value),
                                                        newValues.map((value) => value?.slotType)
                                                    );
                                                }}
                                            >
                                                <X className='w-4 h-4 mr-2 text-red-400' />
                                                Delete Item
                                            </ContextMenuItem>
                                        </>
                                    }
                                />
                                {renderItemEditor(index, currentSlot, isHidden)}
                            </li>
                        )
                    })}
                    <li className="ml-[36px] relative">
                        <span className={cn("absolute flex items-center justify-center w-6 h-full -left-[40px]",
                            {
                                'bg-slate-100': (props.depth || 0) % 2 === 0,
                                'bg-slate-50': (props.depth || 0) % 2 !== 0,
                            })}>
                        </span>
                        {props.currentSlotValues.length > 0 && <>
                            {listCircle}
                        </>}
                        <SlotTypeSelector
                            groups={getRecommendedSlotTypes(props.slotDef, props.expRegistry)}
                            isRequired={props.currentSlotValues.length < 1}
                            onSelect={async (slotTypeId) => {
                                const currentSlotTypes = props.currentSlotValues.map((value) => value?.slotType);
                                const currentValues = props.currentSlotValues.map((value) => value?.value);

                                if (slotTypeId === 'clipboard') {
                                    // paste item from clipboard
                                    try {
                                        const cbContent = await navigator.clipboard.readText();
                                        const content = JSON.parse(cbContent);
                                        if (!content || !content.slotType) {
                                            toast.error('Clipboard content is not valid')
                                            return;
                                        }
                                        currentSlotTypes.push(content.slotType);
                                        currentValues.push(content.value);
                                    } catch (error) {
                                        console.error(error)
                                        return;
                                    }
                                } else {
                                    let newArg: ExpressionArg | undefined;
                                    let isTemplateFor = '';
                                    if (slotTypeId !== undefined) {
                                        const expressionDef = lookupExpressionDef(slotTypeId, props.expRegistry.expressionDefs);
                                        if (expressionDef?.defaultValue !== undefined) {
                                            newArg = JSON.parse(JSON.stringify(expressionDef.defaultValue));
                                        }
                                        isTemplateFor = expressionDef?.isTemplateFor || '';
                                    }
                                    console.log('new arg from list', newArg)
                                    // TODO: does not work for non-expressions yet - FIX - newArg is undefined
                                    currentSlotTypes.push(!isTemplateFor ? slotTypeId : isTemplateFor);
                                    currentValues.push(newArg);
                                }
                                props.onChangeValues(currentValues, currentSlotTypes);

                            }}
                        />
                    </li>
                </ol>
            </div>
        </div>
    );
};

export default ListEditor;
