import SortableWrapper from "@/components/survey-editor/components/general/SortableWrapper";
import AddDropdown from "@/components/survey-editor/components/general/add-dropdown";
import { localisedObjectToMap } from "@/components/survey-editor/utils/localeUtils";
import { generateLocStrings } from "case-editor-tools/surveys/utils/simple-generators";
import { Binary, Calendar, Clock, CornerDownLeft, FormInput, Heading, SquareChevronDown, TypeIcon, TypeOutlineIcon } from "lucide-react";
import React, { useEffect, useRef } from "react";
import { ItemComponent, ItemGroupComponent } from "survey-engine/data_types";
import TextInputContentConfig from "./text-input-content-config";
import NumberInputContentConfig from "./number-input-content-config";
import DateInputContentConfig from "./date-input-content-config";
import MarkdownContentEditor from "../markdown-content-editor";
import SortableItem from "@/components/survey-editor/components/general/SortableItem";
import TimeInputContentConfig from "./time-input-content-config";
import { ClozeItemType } from "@/components/survey-renderer/SurveySingleItemView/ResponseComponent/InputTypes/ClozeQuestion";
import DropdownContentConfig from "./dropdown-content-config";
import { SimpleTextViewContentEditor } from "./text-view-content-editor";
import { useSurveyEditorCtx } from "@/components/survey-editor/surveyEditorContext";
import { ItemOverviewRow } from "./item-overview-row";
import { useCopyToClipboard } from "usehooks-ts";
import { TabbedItemEditor } from "./tabbed-item-editor";
import { Separator } from "@/components/ui/separator";

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
                    hidePlaceholder={false}
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

const icons = {
    [ClozeItemType.SimpleText]: <TypeIcon className='size-4 text-muted-foreground' />,
    [ClozeItemType.Dropdown]: <SquareChevronDown className='size-4 text-muted-foreground' />,
    [ClozeItemType.TextInput]: <FormInput className='size-4 text-muted-foreground' />,
    [ClozeItemType.NumberInput]: <Binary className='size-4 text-muted-foreground' />,
    [ClozeItemType.TimeInput]: <Clock className='size-4 text-muted-foreground' />,
    [ClozeItemType.DateInput]: <Calendar className='size-4 text-muted-foreground' />,
    [ClozeItemType.Markdown]: <TypeOutlineIcon className='size-4 text-muted-foreground' />,
    [ClozeItemType.LineBreak]: <CornerDownLeft className='size-4 text-muted-foreground' />,
};

const clozeItemIconLookup = (item: ItemComponent): React.ReactNode => {
    const clozeItemType = getClozeItemType(item);
    return icons[clozeItemType] || <Heading className='size-4 text-muted-foreground' />;
}


const typeHints = {
    [ClozeItemType.SimpleText]: 'Simple Text',
    [ClozeItemType.Markdown]: 'Markdown Text',
    [ClozeItemType.Dropdown]: 'Dropdown',
    [ClozeItemType.TextInput]: 'Text Input',
    [ClozeItemType.NumberInput]: 'Number Input',
    [ClozeItemType.TimeInput]: 'Time Input',
    [ClozeItemType.DateInput]: 'Date Input',
    [ClozeItemType.LineBreak]: 'Line Break',
};

const clozeItemDescriptiveTextLookup = (item: ItemComponent, lang: string): string => {
    const itemType = getClozeItemType(item);
    const typeText = typeHints[itemType] ?? 'Unknown Type';
    return itemType == ClozeItemType.SimpleText ? (localisedObjectToMap(item.content).get(lang) ?? typeText) : typeText;
}

const ClozeContentConfig: React.FC<ClozeContentConfigProps> = (props) => {
    const { selectedLanguage } = useSurveyEditorCtx();
    const [draggedKey, setDraggedKey] = React.useState<string | null>();
    const [selectedKey, setSelectedKey] = React.useState<string | null>(null);
    const lastItemRef = useRef<HTMLDivElement | null>(null);
    const [clipboardContent, setClipboardContent] = useCopyToClipboard();

    const clozeItems = props.component.items || [];
    const selectedItem = clozeItems.find(item => item.key === selectedKey);
    const draggedItem = clozeItems.find(item => item.key === draggedKey);

    const sortableClozeItems = clozeItems.map((component, index) => {
        return {
            id: component.key || index.toString(), ...component
        }
    });


    // Hacky way to scroll to the last item when it is newly added
    useEffect(() => {
        const lastClozeItem = sortableClozeItems.at(-1);
        if (lastItemRef.current && lastClozeItem?.key == selectedKey) {
            lastItemRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
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
        <div className='space-y-6'>
            <div>
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
                            isSelected={draggedItem.key === selectedKey}
                            isBeingDragged={true}
                            itemIconLookup={clozeItemIconLookup}
                            itemDescriptiveTextLookup={(item) => clozeItemDescriptiveTextLookup(item, selectedLanguage)}
                            itemList={clozeItems} />
                        : null}
                >
                    <div className='space-y-2'>
                        <ol className='space-y-1'>
                            {sortableClozeItems.map((clozeItem, i) => (
                                <SortableItem
                                    id={clozeItem.id}
                                    key={clozeItem.id}>
                                    <div ref={i == sortableClozeItems.length - 1 ? lastItemRef : null}>
                                        <ItemOverviewRow
                                            i={i}
                                            isDragOverlay={false}
                                            isSelected={selectedKey === clozeItem.key}
                                            isBeingDragged={draggedKey === clozeItem.key}
                                            itemIconLookup={clozeItemIconLookup}
                                            itemDescriptiveTextLookup={(item) => clozeItemDescriptiveTextLookup(item, selectedLanguage)}
                                            onSelectionUpdate={(key) => {
                                                setSelectedKey(key);
                                                setDraggedKey(null);
                                            }}
                                            itemList={clozeItems}
                                            onListUpdate={(list) => updateComponent(list)}
                                            getClipboardValue={() => clipboardContent?.toString() ?? ""}
                                            setClipboardValue={(value) => setClipboardContent(value)}
                                        />
                                    </div>
                                </SortableItem>
                            ))}
                        </ol>
                        <div className='flex justify-center w-full'>
                            <AddDropdown
                                options={[
                                    { key: ClozeItemType.SimpleText, label: typeHints[ClozeItemType.SimpleText], icon: icons[ClozeItemType.SimpleText] },
                                    { key: ClozeItemType.Markdown, label: typeHints[ClozeItemType.Markdown], icon: icons[ClozeItemType.Markdown] },
                                    { key: ClozeItemType.Dropdown, label: typeHints[ClozeItemType.Dropdown], icon: icons[ClozeItemType.Dropdown] },
                                    { key: ClozeItemType.TextInput, label: typeHints[ClozeItemType.TextInput], icon: icons[ClozeItemType.TextInput] },
                                    { key: ClozeItemType.NumberInput, label: typeHints[ClozeItemType.NumberInput], icon: icons[ClozeItemType.NumberInput] },
                                    { key: ClozeItemType.TimeInput, label: typeHints[ClozeItemType.TimeInput], icon: icons[ClozeItemType.TimeInput] },
                                    { key: ClozeItemType.DateInput, label: typeHints[ClozeItemType.DateInput], icon: icons[ClozeItemType.DateInput] },
                                    { key: ClozeItemType.LineBreak, label: typeHints[ClozeItemType.LineBreak], icon: icons[ClozeItemType.LineBreak] },
                                ]}
                                onAddItem={onAddItem}
                            />
                        </div>
                    </div>
                </SortableWrapper>
            </div>

            <Separator />

            <TabbedItemEditor isActive={selectedItem != undefined}
                contentEditor={selectedItem && <ContentItem
                    component={selectedItem}
                    onUpdateComponent={(updatedComponent: ItemComponent) => {
                        const updatedItems = [...clozeItems];
                        const index = updatedItems.findIndex(item => item.key === selectedItem?.key);
                        if (index !== -1) {
                            updatedItems[index] = updatedComponent;
                        }
                        updateComponent(updatedItems);
                    }} />}
                conditionsEditor={selectedItem && <p className="text-sm">Condition Editor.</p>}
                title={'Selected Item:'} />
        </div>
    );


};

export default ClozeContentConfig;
