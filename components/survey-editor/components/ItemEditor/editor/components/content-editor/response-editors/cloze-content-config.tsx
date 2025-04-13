import SortableWrapper from "@/components/survey-editor/components/general/SortableWrapper";
import AddDropdown from "@/components/survey-editor/components/general/add-dropdown";
import { localisedObjectToMap } from "@/components/survey-editor/utils/localeUtils";
import { generateLocStrings } from "case-editor-tools/surveys/utils/simple-generators";
import { Binary, Calendar, Clock, CornerDownLeft, FormInput, Heading, SquareChevronDown } from "lucide-react";
import React, { useEffect, useRef } from "react";
import { ItemComponent, ItemGroupComponent } from "survey-engine/data_types";
import TextInputContentConfig from "./text-input-content-config";
import NumberInputContentConfig from "./number-input-content-config";
import DateInputContentConfig from "./date-input-content-config";
import MarkdownContentEditor from "../markdown-content-editor";
import SortableItem from "@/components/survey-editor/components/general/SortableItem";
import { Separator } from "@/components/ui/separator";
import TimeInputContentConfig from "./time-input-content-config";
import { ClozeItemType } from "@/components/survey-renderer/SurveySingleItemView/ResponseComponent/InputTypes/ClozeQuestion";
import DropdownContentConfig from "./dropdown-content-config";
import { SimpleTextViewContentEditor } from "./text-view-content-editor";
import { useSurveyEditorCtx } from "@/components/survey-editor/surveyEditorContext";
import { ItemOverviewRow } from "./item-overview-row";
import { useCopyToClipboard } from "usehooks-ts";

interface ClozeContentConfigProps {
    component: ItemGroupComponent;
    onChange: (newComp: ItemGroupComponent) => void;
}

const getClozeItemType = (item: ItemComponent): ClozeItemType => {
    const itemType = item.role as keyof typeof ClozeItemType;
    return itemType as ClozeItemType;
}

const ContentItem = (props: {
    component: ItemComponent,
    onUpdateComponent: (component: ItemComponent) => void
}) => {
    const { selectedLanguage } = useSurveyEditorCtx();
    const clozeItemType = getClozeItemType(props.component);

    const renderContent = () => {
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
                        content={localisedObjectToMap(props.component.content).get(selectedLanguage) || ''}
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

const clozeItemIconLookup = (item: ItemComponent): React.ReactNode => {
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
    const clozeItemType = getClozeItemType(item);
    return icons[clozeItemType] || <Heading className='size-4 text-muted-foreground' />;
}

const clozeItemDescriptiveTextLookup = (item: ItemComponent, lang: string): string => {
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

    const clozeItemType = getClozeItemType(item);
    return clozeItemType == ClozeItemType.SimpleText ? localisedObjectToMap(item.content).get(lang) || 'Simple Text' : typeHints[clozeItemType] || 'Unknown Item Type';
}

const ClozeContentConfig: React.FC<ClozeContentConfigProps> = (props) => {
    const { selectedLanguage } = useSurveyEditorCtx();
    const [draggedKey, setDraggedKey] = React.useState<string | null>();
    const [selectedKey, setSelectedKey] = React.useState<string | null>(null);
    const lastItemRef = useRef<HTMLDivElement | null>(null);
    const [copiedValue, copyToClipboard] = useCopyToClipboard();

    const clozeItems = props.component.items || [];
    const selectedItem = clozeItems.find(item => item.key === selectedKey);
    const draggedItem = clozeItems.find(item => item.key === draggedKey);
    const usedKeys = clozeItems.map(comp => comp.key || '');

    const sortableClozeItems = clozeItems.map((component, index) => {
        return {
            id: component.key || index.toString(), ...component
        }
    });

    console.log('sortableClozeItems', sortableClozeItems);

    // Hacky way to scroll to the last item when it is newly added
    useEffect(() => {
        const lastClozeItem = sortableClozeItems.at(-1);
        if (lastItemRef.current && lastClozeItem?.key == selectedKey) {
            lastItemRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }, [selectedKey, sortableClozeItems]);

    useEffect(() => {
        console.log('seletedKey', selectedKey);
    }, [selectedKey]);

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
            <p className='font-semibold pb-2'>Cloze Items: <span className='text-muted-foreground'>({clozeItems.length})</span></p>
            <SortableWrapper
                sortableID={'response-group-editor'}
                items={sortableClozeItems}
                onDraggedIdChange={(id) => {
                    setDraggedKey(id);
                }}
                onReorder={(activeIndex, overIndex) => {
                    const newItems = [...clozeItems];
                    newItems.splice(overIndex, 0, newItems.splice(activeIndex, 1)[0]);
                    updateComponent(newItems);
                }}
                dragOverlayItem={(draggedKey && draggedItem) ?
                    <ItemOverviewRow
                        i={sortableClozeItems.findIndex(item => item.id === draggedKey)}
                        isDragOverlay={true}
                        item={draggedItem}
                        isSelected={draggedItem.key === selectedKey}
                        isBeingDragged={true}
                        usedKeys={usedKeys}
                        itemIconLookup={clozeItemIconLookup}
                        itemDescriptiveTextLookup={(item) => clozeItemDescriptiveTextLookup(item, selectedLanguage)} />
                    : null}
            >
                <div className='space-y-2'>
                    <ol className='max-h-64 overflow-y-auto space-y-1'>
                        {sortableClozeItems.map((clozeItem, i) => (
                            <SortableItem
                                id={clozeItem.id}
                                key={clozeItem.id}>
                                <div ref={i == sortableClozeItems.length - 1 ? lastItemRef : null}>
                                    <ItemOverviewRow
                                        i={i}
                                        isDragOverlay={false}
                                        usedKeys={usedKeys}
                                        item={clozeItem}
                                        isSelected={selectedKey === clozeItem.key}
                                        isBeingDragged={draggedKey === clozeItem.key}
                                        itemIconLookup={clozeItemIconLookup}
                                        itemDescriptiveTextLookup={(item) => clozeItemDescriptiveTextLookup(item, selectedLanguage)}
                                        onClick={() => {
                                            console.log('onClick', clozeItem.key);
                                            setSelectedKey(clozeItem.key!);

                                        }}
                                        onKeyChange={(oldKey, newKey) => {
                                            const newItems = [...clozeItems];
                                            const itemToUpdate = newItems.find(clozeItem => clozeItem.key === oldKey);
                                            if (itemToUpdate) {
                                                itemToUpdate.key = newKey;
                                                updateComponent(newItems);
                                            }
                                            if (selectedKey === oldKey) {
                                                setSelectedKey(newKey);
                                            }
                                        }}
                                        onDelete={() => {
                                            if (confirm('Are you sure you want to delete this item?')) {
                                                updateComponent(clozeItems.filter(item => item.key !== clozeItem.key));
                                                setSelectedKey(null);
                                            }
                                        }}
                                        onDuplicate={() => {
                                            const itemToDuplicate = clozeItems.find(item => item.key === clozeItem.key);
                                            if (itemToDuplicate != undefined) {
                                                const newItem = { ...itemToDuplicate, key: Math.random().toString(36).substring(9) };
                                                const newItems = [...clozeItems];
                                                newItems.splice(i + 1, 0, newItem);
                                                setSelectedKey(newItem.key);
                                                updateComponent(newItems);
                                            }
                                        }}
                                        onCopy={() => {
                                            const itemToCopy = clozeItems.find(item => item.key === clozeItem.key);
                                            if (itemToCopy != undefined) {
                                                copyToClipboard(JSON.stringify(itemToCopy));
                                            }
                                        }}
                                        onPaste={() => {
                                            if (!copiedValue) return;
                                            // Replace contents of current item with copied values
                                            const copiedItem = JSON.parse(copiedValue) as ItemComponent;
                                            const indexOfItem = clozeItems.findIndex(item => item.key === clozeItem.key);
                                            clozeItems[indexOfItem] = copiedItem;
                                            clozeItems[indexOfItem].key = clozeItem.key;
                                            updateComponent(clozeItems);
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
                <p className='font-semibold pb-2'>Selected Cloze Item:</p>
                <ContentItem
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
