import { ExpressionArg } from '@/components/expression-editor/utils';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeftIcon } from 'lucide-react';
import React from 'react';
import ExpEditorWrapper from './exp-editor-wrapper';


export interface HandlerSelection {
    type: 'entry' | 'merge' | 'leave' | 'survey-submission' | 'custom-event' | 'timer-event';
    index?: number;
    handlerKey?: string;
    actions?: Array<ExpressionArg | undefined>;
}

interface HandlerEditorProps {
    selection: HandlerSelection;
    onClose: () => void;
    onChange: (selection: HandlerSelection) => void;
}

const HandlerEditor: React.FC<HandlerEditorProps> = (props) => {
    console.log(props.selection)

    const currentActions = props.selection.actions;


    return (
        <div className='px-6 pt-2 pb-12 space-y-2 overflow-y-auto'>
            <Button
                variant={'ghost'}
                onClick={() => {
                    props.onClose();
                }}
            >
                <span><ArrowLeftIcon className='size-4' /></span>
                Exit handler editor
            </Button>

            <Card className='p-4 space-y-4'>
                <h3 className='font-bold text-sm flex justify-between gap-4'>
                    <span>
                        Edit
                        <span
                            className='uppercase font-bold text-sm mx-1 text-primary'
                        >
                            {props.selection.type}
                        </span>
                        handler
                        {props.selection.handlerKey !== undefined && <span className='font-bold text-sm mx-1 text-primary'>
                            {props.selection.handlerKey}
                        </span>}
                        {
                            props.selection.index !== undefined && <span className='font-bold text-sm mx-1 text-muted-foreground'>
                                (list position {props.selection.index + 1})
                            </span>
                        }
                    </span>
                </h3>
                <ExpEditorWrapper
                    label={props.selection.type !== 'timer-event' ? 'Actions' : 'Action'}
                    value={currentActions || []}
                    onChange={(newValue) => {
                        props.onChange({
                            ...props.selection,
                            actions: newValue
                        })
                    }}
                    isListSlot={props.selection.type !== 'timer-event' ? true : false}
                />
            </Card>


        </div>

    );
};

export default HandlerEditor;
