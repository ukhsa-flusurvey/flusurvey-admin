import React, { useContext } from 'react';
import EditorWrapper from './editor-wrapper';
import { ItemComponent, ItemGroupComponent, SurveySingleItem } from 'survey-engine/data_types';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { SurveyContext } from '@/components/survey-editor/surveyContext';
import { Textarea } from '@/components/ui/textarea';
import SurveyLanguageToggle from '@/components/survey-editor/components/general/SurveyLanguageToggle';
import { generateDateDisplayComp, generateLocStrings } from 'case-editor-tools/surveys/utils/simple-generators';
import { localisedObjectToMap } from '@/components/survey-editor/utils/localeUtils';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Calendar, Grip, GripHorizontal, Plus, Type, X } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import SortableWrapper from '@/components/survey-editor/components/general/SortableWrapper';
import SortableItem from '@/components/survey-editor/components/general/SortableItem';


interface TitleEditorProps {
    surveyItem: SurveySingleItem;
    onUpdateSurveyItem: (item: SurveySingleItem) => void;
}


const SimpleTitleEditor: React.FC<TitleEditorProps> = (props) => {
    const { selectedLanguage } = useContext(SurveyContext);

    let titleComponentIndex = props.surveyItem.components?.items.findIndex(comp => comp.role === 'title');
    if (titleComponentIndex === undefined || titleComponentIndex === -1) {
        return null;
    }

    const titleComponent = props.surveyItem.components?.items[titleComponentIndex];
    if (!titleComponent) {
        return null;
    }

    const titleMap = localisedObjectToMap(titleComponent.content);

    const classNameIndex = titleComponent.style?.findIndex(style => style.key === 'className');
    let hasStickyHeader = false;
    if (classNameIndex !== undefined && classNameIndex !== -1) {
        hasStickyHeader = titleComponent.style![classNameIndex].value.includes('sticky-top');
    }

    const onToggleStickyHeader = (checked: boolean) => {
        const existingComponents = props.surveyItem.components?.items || [];
        if (checked) {
            if (classNameIndex === undefined) {
                existingComponents[titleComponentIndex].style = [
                    {
                        key: 'className',
                        value: 'sticky-top',
                    }
                ]
            } else if (classNameIndex === -1) {
                existingComponents[titleComponentIndex].style?.push({
                    key: 'className',
                    value: 'sticky-top',
                });
            } else {
                existingComponents[titleComponentIndex].style![classNameIndex].value = 'sticky-top';
            }
        } else {
            if (classNameIndex !== undefined && classNameIndex !== -1) {
                existingComponents[titleComponentIndex].style?.splice(classNameIndex, 1);
            }
        }

        props.onUpdateSurveyItem({
            ...props.surveyItem,
            components: {
                ...props.surveyItem.components,
                role: 'root',
                items: existingComponents,
            }
        })
    }

    const onUpdateContent = (content: string) => {
        titleMap.set(selectedLanguage, content);

        const existingComponents = props.surveyItem.components?.items || [];
        existingComponents[titleComponentIndex].content = generateLocStrings(titleMap);
        props.onUpdateSurveyItem({
            ...props.surveyItem,
            components: {
                ...props.surveyItem.components,
                role: 'root',
                items: existingComponents,
            }
        })
    }

    return (
        <div className='mt-6 space-y-4'>
            <div className='flex justify-end'>
                <SurveyLanguageToggle />
            </div>
            <div className='space-y-1.5'>
                <Label
                    htmlFor='title-input'
                >
                    Title
                </Label>
                <Textarea
                    id='title-input'
                    value={titleMap.get(selectedLanguage) || ''}
                    onChange={(e) => {
                        onUpdateContent(e.target.value);
                    }}
                    placeholder='Enter title here for the selected language...'
                />
            </div>

            <Label
                htmlFor='sticky-header-switch'
                className='flex items-center gap-2'
            >
                <Switch
                    id='sticky-header-switch'
                    checked={hasStickyHeader}
                    onCheckedChange={onToggleStickyHeader}
                />
                <span>
                    Sticky header
                </span>

            </Label>
        </div>
    );
}

const AdvancedTitlePartEditor: React.FC<{
    part: ItemComponent,
    onUpdatePart: (part: ItemComponent) => void,
    onDeletePart: () => void,
}> = (props) => {
    const { selectedLanguage } = useContext(SurveyContext);

    let type = 'formatted-text';
    if (props.part.role === 'dateDisplay') {
        type = 'dynamic-date';
    }

    let content: React.ReactNode = null;

    switch (type) {
        case 'formatted-text':


            content = <div className='space-y-3'>
                <div className='space-y-1'>
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

                <div className='space-y-1'>
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
            content = <p className='h-80'>dynamic date</p>
            break;
    }

    return (
        <SortableItem
            id={props.part.key || ''}
        >
            <div className='p-2 border border-neutral-300 bg-slate-100 rounded-md relative space-y-1'>
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

const AdvancedTitleEditor: React.FC<TitleEditorProps> = (props) => {
    const { selectedLanguage } = useContext(SurveyContext);
    const [draggedId, setDraggedId] = React.useState<string | null>(null);

    let titleComponentIndex = props.surveyItem.components?.items.findIndex(comp => comp.role === 'title');
    if (titleComponentIndex === undefined || titleComponentIndex === -1) {
        return null;
    }

    const titleComponent = props.surveyItem.components?.items[titleComponentIndex];
    if (!titleComponent) {
        return null;
    }

    const titleParts = (titleComponent as ItemGroupComponent).items || [];

    const onAddItem = (type: 'formatted-text' | 'expression' | 'dynamic-date') => {
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
                        languageCodes: [selectedLanguage],
                        className: ''
                    }
                )
                break;
        }
        if (!newItem) {
            return;
        }
        (titleComponent as ItemGroupComponent).items?.push(newItem);

        const existingComponents = props.surveyItem.components?.items || [];
        existingComponents[titleComponentIndex] = titleComponent;
        props.onUpdateSurveyItem({
            ...props.surveyItem,
            components: {
                ...props.surveyItem.components,
                role: 'root',
                items: existingComponents,
            }
        })
    }

    const draggedItem = draggedId ? titleParts.find(part => part.key === draggedId) : null;

    return (
        <div className='mt-6 space-y-4'>
            <div className='flex justify-end'>
                <SurveyLanguageToggle />
            </div>

            <div>
                <p className='text-sm font-semibold mb-2'>Title parts:</p>
                {titleParts.length === 0 && <p className='text-sm text-neutral-500'>No title parts defined yet.</p>}

                <SortableWrapper
                    sortableID='title-parts'
                    items={titleParts.map((part, index) => {
                        return {
                            id: part.key || index.toString(),
                        }
                    })}
                    onDraggedIdChange={(id) => {
                        setDraggedId(id);
                    }}
                    onReorder={(activeIndex, overIndex) => {
                        const newItems = [...titleParts];
                        newItems.splice(overIndex, 0, newItems.splice(activeIndex, 1)[0]);
                        (titleComponent as ItemGroupComponent).items = newItems;

                        const existingComponents = props.surveyItem.components?.items || [];
                        existingComponents[titleComponentIndex] = titleComponent;
                        props.onUpdateSurveyItem({
                            ...props.surveyItem,
                            components: {
                                ...props.surveyItem.components,
                                role: 'root',
                                items: existingComponents,
                            }
                        })
                    }}
                    dragOverlayItem={(draggedId && draggedItem) ?
                        <AdvancedTitlePartEditor
                            part={draggedItem}
                            onUpdatePart={() => { }}
                            onDeletePart={() => { }}
                        />
                        : null}
                >
                    <ol className='mb-4 space-y-2'>
                        {titleParts.map((part, index) => {
                            return <AdvancedTitlePartEditor
                                key={index}
                                part={part}
                                onDeletePart={() => {
                                    if (!confirm('Are you sure you want to delete this part?')) {
                                        return;
                                    }
                                    const newParts = (titleComponent as ItemGroupComponent).items!.filter(p => p.key !== part.key);
                                    (titleComponent as ItemGroupComponent).items = newParts;
                                    const existingComponents = props.surveyItem.components?.items || [];
                                    existingComponents[titleComponentIndex] = titleComponent;
                                    props.onUpdateSurveyItem({
                                        ...props.surveyItem,
                                        components: {
                                            ...props.surveyItem.components,
                                            role: 'root',
                                            items: existingComponents,
                                        }
                                    })
                                }}
                                onUpdatePart={(updatedPart) => {
                                    (titleComponent as ItemGroupComponent).items[index] = updatedPart;
                                    const existingComponents = props.surveyItem.components?.items || [];
                                    existingComponents[titleComponentIndex] = titleComponent;
                                    props.onUpdateSurveyItem({
                                        ...props.surveyItem,
                                        components: {
                                            ...props.surveyItem.components,
                                            role: 'root',
                                            items: existingComponents,
                                        }
                                    })

                                }}
                            />
                        })}
                    </ol>
                </SortableWrapper>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant={'outline'} size={'sm'}>
                            <span><Plus className='size-4 me-2' /></span>Add new title part
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side='right'>
                        <DropdownMenuItem className='flex items-center'
                            onClick={() => onAddItem('formatted-text')}
                        >
                            <span>
                                <Type className='size-4 me-2 text-muted-foreground' />
                            </span>
                            Formatted text
                        </DropdownMenuItem>
                        <DropdownMenuItem className='flex items-center'
                            onClick={() => onAddItem('dynamic-date')}
                        >
                            <span>
                                <Calendar className='size-4 me-2 text-muted-foreground' />
                            </span>
                            Dynamic date
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

            </div>

            <div className='space-y-1.5'>
                <Label
                    htmlFor='global-header-class-name'
                >
                    Item header CSS classes
                </Label>
                <Input
                    id='global-header-class-name'
                    placeholder='Enter optional CSS classes for the item header...'
                    value={titleComponent.style?.find(style => style.key === 'className')?.value || ''}
                    onChange={(e) => {
                        const existingComponents = props.surveyItem.components?.items || [];
                        const classNameIndex = titleComponent.style?.findIndex(style => style.key === 'className');
                        if (classNameIndex === undefined || classNameIndex === -1) {
                            existingComponents[titleComponentIndex].style = [
                                {
                                    key: 'className',
                                    value: e.target.value,
                                }
                            ]
                        } else {
                            existingComponents[titleComponentIndex].style![classNameIndex].value = e.target.value;
                        }

                        props.onUpdateSurveyItem({
                            ...props.surveyItem,
                            components: {
                                ...props.surveyItem.components,
                                role: 'root',
                                items: existingComponents,
                            }
                        })
                    }}
                />
            </div>

        </div>
    );
}

const determineAdvancedMode = (item: SurveySingleItem) => {
    let titleComponentIndex = item.components?.items.findIndex(comp => comp.role === 'title');
    if (titleComponentIndex === undefined || titleComponentIndex === -1) {
        return false;
    }

    const titleComponent = item.components?.items[titleComponentIndex];
    if (!titleComponent) {
        return false;
    }

    return (titleComponent as ItemGroupComponent).items !== undefined && (titleComponent as ItemGroupComponent).content === undefined;
}

const TitleEditor: React.FC<TitleEditorProps> = (props) => {
    const isAdvancedMode = determineAdvancedMode(props.surveyItem);

    const onToggleAdvanceMode = (checked: boolean) => {
        if (!confirm('Are you sure you want to switch the editor mode? You will loose the current content.')) {
            return
        }

        const newTitleComp: ItemComponent = {
            role: 'title',
            items: undefined,
        };
        if (checked) {
            (newTitleComp as ItemGroupComponent).items = [];
        }


        let titleComponentIndex = props.surveyItem.components?.items.findIndex(comp => comp.role === 'title');
        const existingComponents = props.surveyItem.components?.items || [];
        if (titleComponentIndex === undefined || titleComponentIndex === -1) {
            // add a new title component
            existingComponents.push(newTitleComp);
        } else {
            // update the existing title component
            existingComponents[titleComponentIndex] = newTitleComp;
        }
        props.onUpdateSurveyItem({
            ...props.surveyItem,
            components: {
                ...props.surveyItem.components,
                role: 'root',
                items: existingComponents,
            }
        });

    }

    return (
        <EditorWrapper>
            <div className='mb-4 flex justify-end'>
                <Label
                    htmlFor="advanced-mode-switch"
                    className='flex items-center gap-2'
                >
                    <Switch
                        id="advanced-mode-switch"
                        checked={isAdvancedMode}
                        onCheckedChange={onToggleAdvanceMode}
                    />
                    <span>
                        Use advanced mode
                    </span>
                </Label>
            </div>
            <Separator />
            {isAdvancedMode ? <AdvancedTitleEditor {...props} /> : <SimpleTitleEditor {...props} />}
        </EditorWrapper>
    );
};

export default TitleEditor;
