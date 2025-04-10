import SortableWrapper from "@/components/survey-editor/components/general/SortableWrapper";
import AddDropdown from "@/components/survey-editor/components/general/add-dropdown";
import { localisedObjectToMap } from "@/components/survey-editor/utils/localeUtils";
import { generateLocStrings } from "case-editor-tools/surveys/utils/simple-generators";
import { Binary, Calendar, Clock, CornerDownLeft, FormInput, GripHorizontal, Heading, SquareChevronDown, X } from "lucide-react";
import React, { useEffect, useRef } from "react";
import { ItemComponent, ItemGroupComponent } from "survey-engine/data_types";
import TextInputContentConfig from "./text-input-content-config";
import NumberInputContentConfig from "./number-input-content-config";
import DateInputContentConfig from "./date-input-content-config";
import MarkdownContentEditor from "../markdown-content-editor";
import SortableItem from "@/components/survey-editor/components/general/SortableItem";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import TimeInputContentConfig from "./time-input-content-config";
import { ClozeItemType } from "@/components/survey-renderer/SurveySingleItemView/ResponseComponent/InputTypes/ClozeQuestion";
import DropdownContentConfig from "./dropdown-content-config";
import { SimpleTextViewContentEditor } from "./text-view-content-editor";
import { useSurveyEditorCtx } from "@/components/survey-editor/surveyEditorContext";
import { cn } from "@/lib/utils";
import { PopoverKeyBadge } from "../../KeyBadge";

interface ClozeContentConfigProps {
    component: ItemGroupComponent;
    onChange: (newComp: ItemGroupComponent) => void;
}


const getClozeItemType = (item: ItemComponent): ClozeItemType => {
    const itemType = item.role as keyof typeof ClozeItemType;
    return itemType as ClozeItemType;
}

const ContentItem = (props: {
    index: number, component: ItemComponent,
    onUpdateComponent: (component: ItemComponent) => void
}) => {
    const { selectedLanguage } = useSurveyEditorCtx();
    const clozeItemType = getClozeItemType(props.component);

    const renderContent = () => {
        const currentContent = localisedObjectToMap(props.component.content).get(selectedLanguage) || '';
        switch (clozeItemType) {
            case ClozeItemType.SimpleText:
                return <SimpleTextViewContentEditor
                    component={props.component}
                    onChange={props.onUpdateComponent}
                    label='Text'
                />;
            case ClozeItemType.Dropdown:
                return <DropdownContentConfig
                    component={props.component}
                    onChange={props.onUpdateComponent}
                    hideLabel={true}
                    hidePlaceholder={true}
                />;
            case ClozeItemType.TextInput:
                return <TextInputContentConfig
                    component={props.component}
                    onChange={props.onUpdateComponent}
                    allowMultipleLines={true}
                    hideLabel={true}
                />;
            case ClozeItemType.NumberInput:
                return <NumberInputContentConfig
                    component={props.component}
                    onChange={props.onUpdateComponent}
                    hideLabel={true}
                />;
            case ClozeItemType.DateInput:
                return <DateInputContentConfig
                    component={props.component}
                    onChange={props.onUpdateComponent}
                    hideLabel={true}
                />;
            case ClozeItemType.TimeInput:
                return <TimeInputContentConfig
                    component={props.component as ItemGroupComponent}
                    onChange={props.onUpdateComponent}
                    hideLabel={true}
                />;
            case ClozeItemType.Markdown:
                return <div className='space-y-1.5'
                    data-no-dnd="true">
                    <MarkdownContentEditor
                        content={currentContent}
                        onUpdateContent={(content) => {
                            const updatedPart = { ...props.component };
                            const updatedContent = localisedObjectToMap(updatedPart.content);
                            updatedContent.set(selectedLanguage, content);
                            updatedPart.content = generateLocStrings(updatedContent);
                            props.onUpdateComponent(updatedPart);
                        }}
                    />
                </div>;
            case ClozeItemType.LineBreak:
                return <div className="text-sm">Nothing to configure.</div>;
            default:
                console.warn('Unknown / unimplemented item type:', clozeItemType);
                return <div className="text-danger text-sm">Unknown / unimplemented cloze item type: {clozeItemType}</div>;
        }
    }

    return (renderContent());
}

const ClozeItemOverviewRow = (props: {
    i: number,
    isDragOverlay: boolean,
    clozeItems: ItemComponent[],
    selectedItem: ItemComponent | undefined,
    draggedItem: ItemComponent | undefined,
    usedKeys: string[],
    onSelectionChange?: (key: string) => void,
    onKeyChange?: (oldKey: string, newKey: string) => void,
    onDelete?: () => void,
}) => {
    const { selectedLanguage } = useSurveyEditorCtx();
    const clozeItem = props.clozeItems[props.i];
    const clozeItemType = getClozeItemType(clozeItem);
    const isSelected = (props.selectedItem && props.selectedItem.key === clozeItem.key) ?? false;

    const icons = {
        [ClozeItemType.SimpleText]: <Heading className='size-4 text-muted-foreground' />,
        [ClozeItemType.Dropdown]: <SquareChevronDown className='size-4 text-muted-foreground' />,
        [ClozeItemType.TextInput]: <FormInput className='size-4 text-muted-foreground' />,
        [ClozeItemType.NumberInput]: <Binary className='size-4 text-muted-foreground' />,
        [ClozeItemType.TimeInput]: <Clock className='size-4 text-muted-foreground' />,
        [ClozeItemType.DateInput]: <Calendar className='size-4 text-muted-foreground' />,
        [ClozeItemType.Markdown]: <Heading className='size-4 text-muted-foreground' />,
        [ClozeItemType.LineBreak]: <CornerDownLeft className='size-4 text-muted-foreground' />,
    };

    const typeHints = {
        [ClozeItemType.SimpleText]: 'Text',
        [ClozeItemType.Dropdown]: 'Dropdown',
        [ClozeItemType.TextInput]: 'Text Input',
        [ClozeItemType.NumberInput]: 'Number Input',
        [ClozeItemType.TimeInput]: 'Time Input',
        [ClozeItemType.DateInput]: 'Date Input',
        [ClozeItemType.Markdown]: 'Markdown',
        [ClozeItemType.LineBreak]: 'Line Break',
    };

    const text = localisedObjectToMap(clozeItem.content).get(selectedLanguage) || 'Text';

    const descriptiveText = clozeItemType == ClozeItemType.SimpleText ? text : typeHints[clozeItemType];

    return <div>
        <Button
            variant={'outline'}
            className={cn(
                'w-full gap-2 py-2 h-auto px-3 text-start',
                { 'bg-accent text-accent-foreground': isSelected },
                (props.draggedItem?.key === clozeItem.key && !props.isDragOverlay) && 'invisible')}
            onClick={props.isDragOverlay ? undefined : () => { props.onSelectionChange?.(clozeItem.key ?? ''); }}
        >
            <div>
                {icons[clozeItemType] || <Heading className='size-4 text-muted-foreground' />}
            </div>
            <span className={cn('grow space-x-2',)}>
                <PopoverKeyBadge
                    itemKey={clozeItem.key ?? ''}
                    isHighlighted={isSelected}
                    allOtherKeys={props.usedKeys.filter(key => key !== clozeItem.key)}
                    onKeyChange={(newKey) => { props.onKeyChange?.(clozeItem.key ?? '', newKey); }}
                />

                <span className='text-muted-foreground'>
                    {descriptiveText}
                </span>
            </span>
            <div className='flex flex-row gap-2 items-center'>
                {isSelected && <Button className='h-[20px] w-[20px] hover:bg-slate-300 rounded-full' variant={'ghost'} onClick={props.onDelete}>
                    <X className='size-4 text-muted-foreground' />
                </Button>}
                <GripHorizontal className='size-4' />
            </div>
        </Button >
    </div >;
}

const ClozeContentConfig: React.FC<ClozeContentConfigProps> = (props) => {
    const [draggedId, setDraggedId] = React.useState<string | null>();
    const [selectedKey, setSelectedKey] = React.useState<string | null>(null);
    const lastItem = useRef<HTMLDivElement | null>(null);

    const clozeItems = props.component.items || [];
    const selectedItem = clozeItems.find(item => item.key === selectedKey);
    const draggedItem = clozeItems.find(item => item.key === draggedId);
    const usedKeys = clozeItems.map(comp => comp.key || '');

    const sortableClozeItems = clozeItems.map((component, index) => {
        return {
            id: component.key || index.toString(), ...component
        }
    });

    useEffect(() => {
        // Hacky way to scroll to the last item when it is newly added
        const lastClozeItem = sortableClozeItems.at(-1);
        if (lastItem.current && lastClozeItem?.key == selectedKey) {
            lastItem.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }, [selectedKey, sortableClozeItems]);

    const updateComponent = (newItems: ItemComponent[]) => {
        props.onChange({
            ...props.component,
            items: newItems,
        });
    }

    const onAddItem = (keyOfSelectedItem: string) => {
        const randomKey = Math.random().toString(36).substring(9);
        const itemType = keyOfSelectedItem as keyof typeof ClozeItemType;
        const newItem = {
            key: randomKey,
            role: itemType,
        }

        const newItems = [...clozeItems, newItem];
        updateComponent(newItems);
        setSelectedKey(randomKey);
    };

    return (
        <div className=''>
            <p className='font-semibold pb-2'>Items: <span className='text-muted-foreground'>({clozeItems.length})</span></p>
            <SortableWrapper
                sortableID={'response-group-editor'}
                items={sortableClozeItems}
                onDraggedIdChange={(id) => {
                    setDraggedId(id);
                }}
                onReorder={(activeIndex, overIndex) => {
                    const newItems = [...clozeItems];
                    newItems.splice(overIndex, 0, newItems.splice(activeIndex, 1)[0]);
                    updateComponent(newItems);
                }}
                dragOverlayItem={(draggedId && draggedItem) ?
                    <ClozeItemOverviewRow
                        i={sortableClozeItems.findIndex(item => item.id === draggedId)}
                        isDragOverlay={true}
                        clozeItems={clozeItems}
                        selectedItem={selectedItem}
                        draggedItem={draggedItem}
                        usedKeys={usedKeys} />
                    : null}
            >
                <div className='space-y-2'>
                    <ol className='max-h-64 overflow-y-auto space-y-1'>
                        {sortableClozeItems.map((clozeItem, i) => (
                            <SortableItem
                                id={clozeItem.id}
                                key={clozeItem.id}

                            >
                                <div ref={i == sortableClozeItems.length - 1 ? lastItem : null}>
                                    <ClozeItemOverviewRow
                                        i={i}
                                        isDragOverlay={false}
                                        clozeItems={clozeItems}
                                        selectedItem={selectedItem}
                                        draggedItem={draggedItem}
                                        usedKeys={usedKeys}
                                        onSelectionChange={(key) => setSelectedKey(key)}
                                        onKeyChange={(oldKey, newKey) => {
                                            const newItems = [...clozeItems];
                                            const itemToUpdate = newItems.find(clozeItem => clozeItem.key === oldKey);
                                            if (itemToUpdate) {
                                                itemToUpdate.key = newKey;
                                                updateComponent(newItems);
                                            }
                                        }}
                                        onDelete={() => {
                                            if (confirm('Are you sure you want to delete this item?')) {
                                                updateComponent(clozeItems.filter(item => item.key !== clozeItem.key));
                                                setSelectedKey(null);
                                            }
                                        }}
                                    />
                                </div>
                            </SortableItem>
                        ))}
                    </ol>
                    <Separator className='bg-border' />
                    <div className='flex justify-center w-full '>
                        <AddDropdown
                            options={[
                                { key: ClozeItemType.SimpleText, label: 'Text', icon: <Heading className='size-4 text-muted-foreground me-2' /> },
                                { key: ClozeItemType.Markdown, label: 'Markdown', icon: <Heading className='size-4 text-muted-foreground me-2' /> },
                                { key: ClozeItemType.Dropdown, label: 'Dropdown', icon: <SquareChevronDown className='size-4 text-muted-foreground me-2' /> },
                                { key: ClozeItemType.TextInput, label: 'Text Input', icon: <FormInput className='size-4 text-muted-foreground me-2' /> },
                                { key: ClozeItemType.NumberInput, label: 'Number Input', icon: <Binary className='size-4 text-muted-foreground me-2' /> },
                                { key: ClozeItemType.TimeInput, label: 'Time Input', icon: <Clock className='size-4 text-muted-foreground me-2' /> },
                                { key: ClozeItemType.DateInput, label: 'Date Input', icon: <Calendar className='size-4 text-muted-foreground me-2' /> },
                                { key: ClozeItemType.LineBreak, label: 'Line Break', icon: <CornerDownLeft className='size-4 text-muted-foreground me-2' /> },
                            ]}
                            onAddItem={onAddItem}
                        />
                    </div>
                </div>
            </SortableWrapper>

            {selectedItem && <div>
                <p className='font-semibold pb-2'>Selected Element:</p>
                <ContentItem
                    index={clozeItems.indexOf(selectedItem)}
                    component={selectedItem}
                    onUpdateComponent={(updatedComponent: ItemComponent) => {
                        const updatedItems = [...clozeItems];
                        const index = updatedItems.findIndex(item => item.key === selectedItem?.key);
                        if (index !== -1) {
                            updatedItems[index] = updatedComponent;
                        }
                        updateComponent(updatedItems);
                    }}
                />
            </div>}
        </div>
    );


};

export default ClozeContentConfig;
