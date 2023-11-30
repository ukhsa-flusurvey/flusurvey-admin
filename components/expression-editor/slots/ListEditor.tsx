import React from 'react';
import { ExpressionArg, ExpressionCategory, ExpressionDef, SlotDef, SlotInputDef, getRecommendedSlotTypes } from '../utils';
import SlotTypeSelector from '../components/SlotTypeSelector';
import SlotLabel from '../components/SlotLabel';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, CircleEllipsis, Copy, X } from 'lucide-react';
import { ContextMenuItem, ContextMenuSeparator } from '@/components/ui/context-menu';

interface ListEditorProps {
    slotDef: SlotDef;
    currentValues: Array<ExpressionArg | undefined>;
    expRegistry: {
        expressionDefs: ExpressionDef[],
        categories: ExpressionCategory[]
        builtInSlotTypes: SlotInputDef[],
    };
    onChangeValues: (newValues: Array<ExpressionArg | undefined>) => void;
    depth?: number;
}

const ListEditor: React.FC<ListEditorProps> = (props) => {
    console.log(props.slotDef)
    //props.slotDef.label = ''
    // props.slotDef.required = false

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

    return (
        <div>
            <SlotLabel label={props.slotDef.label} required={props.slotDef.required} />
            <div className='pl-[15px]'>
                <ol className="relative border-l-2 border-neutral-300 space-y-[42px]">
                    {props.currentValues.map((value, index) => {
                        if (value === undefined) {
                            return <div key={index}>
                                <p>undefined</p>
                            </div>
                        }
                        return (
                            <li className="ml-[36px] relative group" key={index.toFixed()}>
                                {listCircle}
                                <Button
                                    size='icon'
                                    className='absolute right-2 top-2 hidden group-hover:flex'
                                    variant='outline'
                                >
                                    <CircleEllipsis />
                                </Button>
                                <SlotLabel label={'Item ' + (index + 1)} required={props.slotDef.required}
                                    isHidden={true}
                                    toggleHide={() => { }}
                                    contextMenuContent={
                                        <>
                                            <ContextMenuItem>
                                                <Copy className='w-4 h-4 mr-2 text-slate-400' />
                                                Copy
                                            </ContextMenuItem>
                                            <ContextMenuSeparator />
                                            <ContextMenuItem disabled>
                                                <ChevronUp className='w-4 h-4 mr-2 text-slate-400' />
                                                Move Up
                                            </ContextMenuItem>
                                            <ContextMenuItem>
                                                <ChevronDown className='w-4 h-4 mr-2 text-slate-400' />
                                                Move Down
                                            </ContextMenuItem>
                                            <ContextMenuSeparator />
                                            <ContextMenuItem>
                                                <X className='w-4 h-4 mr-2 text-red-400' />
                                                Delete Item
                                            </ContextMenuItem>
                                        </>
                                    }
                                />
                                <p>{value.str}</p>
                                make them expandable
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
                        {props.currentValues.length > 0 && <>

                            {listCircle}
                        </>}
                        <SlotTypeSelector
                            groups={getRecommendedSlotTypes(props.slotDef, props.expRegistry)}
                            isRequired={props.currentValues.length < 1}
                            onSelect={(slotTypeId) => {
                                console.log(slotTypeId)
                                const currentData = props.currentValues || [];
                                currentData.push({
                                    str: 'test',
                                    dtype: 'str'
                                })
                                props.onChangeValues(currentData)

                            }}
                        />
                    </li>
                </ol>
            </div>
        </div>
    );
};

export default ListEditor;
