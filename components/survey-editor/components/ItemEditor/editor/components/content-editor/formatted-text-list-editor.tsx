import ExpArgEditor from '@/components/expression-editor/exp-arg-editor';
import { supportedBuiltInSlotTypes, surveyEngineCategories, surveyEngineRegistry } from '@/components/expression-editor/registries/surveyEngineRegistry';
import { ExpressionArg } from '@/components/expression-editor/utils';
import SortableItem from '@/components/survey-editor/components/general/SortableItem';
import SortableWrapper from '@/components/survey-editor/components/general/SortableWrapper';
import { supportedLanguages } from '@/components/survey-editor/components/general/SurveyLanguageToggle';
import AddDropdown from '@/components/survey-editor/components/general/add-dropdown';
import { SurveyContext } from '@/components/survey-editor/surveyContext';
import { localisedObjectToMap } from '@/components/survey-editor/utils/localeUtils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { generateDateDisplayComp, generateLocStrings } from 'case-editor-tools/surveys/utils/simple-generators';
import { Calendar, GripHorizontal, Info, Type, X } from 'lucide-react';
import React, { useContext } from 'react';
import { ItemComponent, LocalizedString } from 'survey-engine/data_types';

interface FormattedTextListEditorProps {
    sortableID: string;
    parts: ItemComponent[];
    onChange: (newParts: ItemComponent[]) => void;
}

const FormattedPartEditor: React.FC<{
    part: ItemComponent,
    onUpdatePart: (part: ItemComponent) => void,
    onDeletePart: () => void,
}> = (props) => {
    const { selectedLanguage } = useContext(SurveyContext);
    const [hideSlotContent, setHideSlotContent] = React.useState<boolean>(false);

    let type = 'formatted-text';
    if (props.part.role === 'dateDisplay') {
        type = 'dynamic-date';
    }

    let content: React.ReactNode = null;

    switch (type) {
        case 'formatted-text':
            content = <div className='space-y-3'>
                <div className='space-y-1'
                    data-no-dnd="true"
                >
                    <Label
                        htmlFor={'title-part-input-' + props.part.key}
                        className='text-xs'
                    >
                        Content
                    </Label>
                    <Textarea
                        id={'title-part-input-' + props.part.key}
                        value={localisedObjectToMap(props.part.content).get(selectedLanguage) || ''}
                        onChange={(e) => {
                            const updatedPart = { ...props.part };
                            const updatedContent = localisedObjectToMap(updatedPart.content);
                            updatedContent.set(selectedLanguage, e.target.value);
                            updatedPart.content = generateLocStrings(updatedContent);
                            props.onUpdatePart(updatedPart);
                        }}
                        placeholder='Enter content here for the selected language...'
                    />
                </div>

                <div className='space-y-1'
                    data-no-dnd="true"
                >
                    <Label
                        htmlFor={'title-part-class-name-' + props.part.key}
                        className='text-xs'
                    >
                        CSS classes
                    </Label>
                    <Input
                        id={'title-part-class-name-' + props.part.key}
                        placeholder='Enter optional CSS classes for the part...'
                        value={props.part.style?.find(style => style.key === 'className')?.value || ''}
                        onChange={(e) => {
                            const updatedPart = { ...props.part };
                            const classNameIndex = updatedPart.style?.findIndex(style => style.key === 'className');
                            if (classNameIndex === undefined || classNameIndex === -1) {
                                updatedPart.style = [
                                    {
                                        key: 'className',
                                        value: e.target.value,
                                    }
                                ]
                            } else {
                                updatedPart.style![classNameIndex].value = e.target.value;
                            }
                            props.onUpdatePart(updatedPart);
                        }}
                    />
                </div>
            </div>
            break;
        case 'dynamic-date':
            if (!props.part.content || props.part.content.length < 1) {
                return null;
            }
            const currentExpValue = ((props.part.content[0] as LocalizedString).parts[0] as ExpressionArg).exp;
            const args: ExpressionArg[] = [];
            if (currentExpValue?.name !== '') {
                args.push({
                    exp: currentExpValue,
                    dtype: 'exp'
                });
            }
            const slotTypes = args.map(arg => arg.exp?.name);

            content = <div className='space-y-3 pt-3 min-w-80'>

                <div className='space-y-1.5'
                    data-no-dnd="true"
                >
                    <ExpArgEditor
                        depth={0}
                        slotDef={{
                            label: 'Date expression',
                            isListSlot: false,
                            required: true,
                            allowedTypes: [{
                                id: 'exp-slot',
                                type: 'expression',
                                allowedExpressionTypes: ['num'],
                            }],
                        }}
                        currentIndex={0}
                        availableExpData={args}
                        availableMetadata={{
                            slotTypes: slotTypes
                        }}

                        expRegistry={{
                            expressionDefs: surveyEngineRegistry,
                            builtInSlotTypes: supportedBuiltInSlotTypes,
                            categories: surveyEngineCategories,
                        }}

                        context={{}}
                        isHidden={hideSlotContent}
                        onToggleHide={(hide) => { setHideSlotContent(hide) }}
                        onChange={(newArgs, newSlotTypes) => {
                            //console.log(newArgs)
                            //console.log(newSlotTypes)
                            const updatedExp = newArgs.length > 0 ? newArgs[0] : {
                                dtype: 'exp',
                                exp: {
                                    name: newSlotTypes[0] || '',
                                }
                            };

                            const updatedPart = generateDateDisplayComp(
                                props.part.key || '',
                                {
                                    date: updatedExp?.exp || { name: '' },
                                    dateFormat: props.part.style?.find(style => style.key === 'dateFormat')?.value || 'yyyy-MM-dd',
                                    languageCodes: [...supportedLanguages],
                                    className: props.part.style?.find(style => style.key === 'className')?.value || ''
                                }
                            )
                            console.log(updatedPart);
                            props.onUpdatePart(updatedPart);
                        }}
                    />

                </div>

                <div
                    className='space-y-1'
                    data-no-dnd="true"
                >

                    <Label
                        htmlFor={'title-part-date-format-' + props.part.key}
                        className='text-xs flex  items-center gap-2'
                    >
                        Date format
                        <Tooltip
                            delayDuration={50}
                        >
                            <TooltipTrigger>
                                <span>
                                    <Info className='size-3 text-neutral-500' />
                                </span>
                            </TooltipTrigger>
                            <TooltipContent className='max-w-80'>
                                <p>
                                    For more information on date formatting, please visit the date-fns documentation:
                                </p>
                                <a
                                    href='https://date-fns.org/v3.6.0/docs/format'
                                    target='_blank'
                                    rel='noreferrer'
                                    className='text-primary underline'
                                >
                                    https://date-fns.org/v3.6.0/docs/format
                                </a>
                            </TooltipContent>
                        </Tooltip>
                    </Label>
                    <Input
                        id={'title-part-date-format-' + props.part.key}
                        placeholder='Enter a date format...'
                        value={props.part.style?.find(style => style.key === 'dateFormat')?.value || ''}
                        onChange={(e) => {
                            const updatedPart = { ...props.part };
                            const classNameIndex = updatedPart.style?.findIndex(style => style.key === 'dateFormat');
                            if (updatedPart.style === undefined) {
                                updatedPart.style = [];
                            }
                            if (classNameIndex === undefined || classNameIndex === -1) {
                                updatedPart.style.push(
                                    {
                                        key: 'dateFormat',
                                        value: e.target.value,
                                    }
                                )
                            } else {
                                updatedPart.style![classNameIndex].value = e.target.value;
                            }
                            props.onUpdatePart(updatedPart);
                        }}
                    />
                </div>
                <div className='space-y-1'
                    data-no-dnd="true"
                >
                    <Label
                        htmlFor={'title-part-class-name-' + props.part.key}
                        className='text-xs'
                    >
                        CSS classes
                    </Label>
                    <Input
                        id={'title-part-class-name-' + props.part.key}
                        placeholder='Enter optional CSS classes for the part...'
                        value={props.part.style?.find(style => style.key === 'className')?.value || ''}
                        onChange={(e) => {
                            const updatedPart = { ...props.part };
                            const classNameIndex = updatedPart.style?.findIndex(style => style.key === 'className');
                            if (updatedPart.style === undefined) {
                                updatedPart.style = [];
                            }
                            if (classNameIndex === undefined || classNameIndex === -1) {
                                updatedPart.style.push(
                                    {
                                        key: 'className',
                                        value: e.target.value,
                                    }
                                )
                            } else {
                                updatedPart.style![classNameIndex].value = e.target.value;
                            }
                            props.onUpdatePart(updatedPart);
                        }}
                    />
                </div>
            </div>
            break;
    }

    return (
        <SortableItem
            id={props.part.key || ''}
        >
            <div className='p-4 border border-border bg-white rounded-md relative space-y-1 min-w-60 shadow-sm'>
                <div className='absolute top-0 left-0 w-full flex justify-center'>
                    <GripHorizontal className='size-5 text-neutral-500' />
                </div>
                <div className='flex items-center'>
                    <span className='text-xs text-muted-foreground me-1'>key:</span>
                    <span className='grow text-sm font-mono'>
                        {props.part.key}
                    </span>
                    <Button
                        variant={'ghost'}
                        size={'icon'}
                        className='size-8 hover:bg-danger-100'
                        onClick={props.onDeletePart}
                    >
                        <span><X className='size-4' /></span>
                    </Button>
                </div>
                <Separator />
                <div className='grow'>
                    {content}
                </div>

            </div>
        </SortableItem>
    )
}

const FormattedTextListEditor: React.FC<FormattedTextListEditorProps> = (props) => {
    const { selectedLanguage } = useContext(SurveyContext);
    const [draggedId, setDraggedId] = React.useState<string | null>(null);

    const onAddItem = (type: string) => {
        const randomKey = Math.random().toString(36).substring(7);
        let newItem: ItemComponent | undefined = undefined;
        switch (type) {
            case 'formatted-text':
                newItem = {
                    key: randomKey,
                    role: 'text',
                    content: generateLocStrings(new Map([[selectedLanguage, '']])),
                    style: [],
                }
                break;
            case 'dynamic-date':
                newItem = generateDateDisplayComp(
                    randomKey,
                    {
                        date: {
                            name: 'timestampWithOffset',
                        },
                        dateFormat: 'yyyy-MM-dd',
                        languageCodes: [...supportedLanguages],
                        className: ''
                    }
                )
                break;
        }
        if (!newItem) {
            return;
        }

        const newParts = [...props.parts];
        newParts.push(newItem);
        props.onChange(newParts);
    }

    const draggedItem = draggedId ? props.parts.find(part => part.key === draggedId) : null;

    return (
        <div>

            <div>
                <p className='text-sm font-semibold'>
                    Content parts:
                    <span className='ps-2 text-muted-foreground'>
                        ({props.parts.length})
                    </span>
                </p>
                <span className='text-xs text-muted-foreground ms-1'>
                    (drag and drop to reorder)
                </span>

                <SortableWrapper
                    sortableID={props.sortableID}
                    direction='horizontal'
                    items={props.parts.map((part, index) => {
                        return {
                            id: part.key || index.toString(),
                        }
                    })}
                    onDraggedIdChange={(id) => {
                        setDraggedId(id);
                    }}
                    onReorder={(activeIndex, overIndex) => {
                        const newItems = [...props.parts];
                        newItems.splice(overIndex, 0, newItems.splice(activeIndex, 1)[0]);

                        props.onChange(newItems);
                    }}
                    dragOverlayItem={(draggedId && draggedItem) ?
                        <FormattedPartEditor
                            part={draggedItem}
                            onUpdatePart={() => { }}
                            onDeletePart={() => { }}
                        />
                        : null}
                >

                    <div className=' my-2 overflow-x-scroll overscroll-x-contain max-w-full'>
                        <ol className='flex items-start gap-4 p-4 border border-border border-dashed rounded-md w-fit min-w-full' >

                            {props.parts.map((part, index) => {
                                return <FormattedPartEditor
                                    key={part.key}
                                    part={part}
                                    onDeletePart={() => {
                                        if (!confirm('Are you sure you want to delete this part?')) {
                                            return;
                                        }
                                        const newParts = props.parts.filter(p => p.key !== part.key);
                                        props.onChange(newParts);
                                    }}
                                    onUpdatePart={(updatedPart) => {
                                        const newParts = [...props.parts];
                                        newParts[index] = updatedPart;
                                        props.onChange(newParts);
                                    }}
                                />
                            })}

                            <AddDropdown
                                options={[
                                    { key: 'formatted-text', label: 'Formatted text', icon: <Type className='size-4 me-2 text-muted-foreground' /> },
                                    { key: 'dynamic-date', label: 'Dynamic date', icon: <Calendar className='size-4 me-2 text-muted-foreground' /> },
                                ]}
                                onAddItem={(type) => {
                                    onAddItem(type);
                                }}
                            />
                        </ol>
                    </div>

                </SortableWrapper>
            </div>
        </div>
    );
};

export default FormattedTextListEditor;
