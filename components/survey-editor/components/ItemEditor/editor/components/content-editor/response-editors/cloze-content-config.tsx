import SortableWrapper from "@/components/survey-editor/components/general/SortableWrapper";
import AddDropdown from "@/components/survey-editor/components/general/add-dropdown";
import { SurveyContext } from "@/components/survey-editor/surveyContext";
import { localisedObjectToMap } from "@/components/survey-editor/utils/localeUtils";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { generateLocStrings } from "case-editor-tools/surveys/utils/simple-generators";
import { Binary, Calendar, ChevronDown, Clock, Cog, CornerDownLeft, FormInput, GripVertical, Heading, Languages, SquareChevronDown, ToggleLeft } from "lucide-react";
import React from "react";
import { useContext } from "react";
import { ItemComponent, ItemGroupComponent } from "survey-engine/data_types";
import TextInputContentConfig from "./text-input-content-config";
import NumberInputContentConfig from "./number-input-content-config";
import DateInputContentConfig from "./date-input-content-config";
import MarkdownContentEditor from "../markdown-content-editor";
import SortableItem from "@/components/survey-editor/components/general/SortableItem";
import TabCard from "@/components/survey-editor/components/general/tab-card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import TimeInputContentConfig from "./time-input-content-config";
import { ClozeItemType } from "@/components/survey-renderer/SurveySingleItemView/ResponseComponent/InputTypes/ClozeQuestion";
import DropdownContentConfig from "./dropdown-content-config";
import { SimpleTextViewContentEditor } from "./text-view-content-editor";
import { TabWrapper } from "@/components/survey-editor/components/ItemEditor/editor/components/TabWrapper";

interface ClozeContentConfigProps {
    component: ItemGroupComponent;
    onChange: (newComp: ItemGroupComponent) => void;
}


const getClozeItemType = (item: ItemComponent): ClozeItemType => {
    const itemType = item.role as keyof typeof ClozeItemType;
    return itemType as ClozeItemType;
}

export const KeyAndType = (props: { compKey?: string, type: string }) => {
    return <div className='text-xs font-semibold flex justify-between w-full'>
        <Badge className='h-auto py-0'>
            {props.compKey}
        </Badge>
        <span className='text-muted-foreground'>
            {props.type}
        </span>
    </div>
}

export const ContentTabCollapsible = (props: { compKey?: string, type: string, children: React.ReactNode, defaultOpen: boolean }) => {
    return <div className='space-y-4'>
        <Collapsible defaultOpen={props.defaultOpen}
            className='group'
        >
            <CollapsibleTrigger asChild>
                <div className='flex w-full gap-2'>
                    <KeyAndType compKey={props.compKey} type={props.type} />
                    <span>
                        <ChevronDown className="size-4 group-data-[state=open]:rotate-180 transition-transform duration-500" />
                    </span>
                </div>
            </CollapsibleTrigger>
            <CollapsibleContent className='pt-4'>
                {props.children}
            </CollapsibleContent>
        </Collapsible>
    </div>
}

export const ContentItem = (props: {
    index: number, component: ItemComponent,
    onUpdateComponent: (component: ItemComponent) => void,
    onDeleteComponent: () => void,
    existingKeys?: string[]

}) => {
    const { selectedLanguage } = useContext(SurveyContext);
    const [currentKey, setCurrentKey] = React.useState(props.component.key || '');

    const clozeItemType = getClozeItemType(props.component);

    //console.log('optionType:', clozeItemType);

    const renderContent = () => {
        const currentContent = localisedObjectToMap(props.component.content).get(selectedLanguage) || '';
        switch (clozeItemType) {
            case ClozeItemType.SimpleText:
                return <ContentTabCollapsible
                    compKey={props.component.key}
                    type='SIMPLE TEXT'
                    defaultOpen={props.index > -1}>
                    <SimpleTextViewContentEditor
                        component={props.component}
                        onChange={props.onUpdateComponent}
                        label='Text'
                    />
                </ContentTabCollapsible>;
            case ClozeItemType.Dropdown:
                return <ContentTabCollapsible
                    compKey={props.component.key}
                    type='DROPDOWN'
                    defaultOpen={props.index > -1}

                >
                    <DropdownContentConfig
                        component={props.component}
                        onChange={props.onUpdateComponent}
                        hideLabel={true}
                        hidePlaceholder={true}
                    />
                </ContentTabCollapsible>;
            case ClozeItemType.TextInput:
                return <ContentTabCollapsible
                    compKey={props.component.key}
                    type='TEXT INPUT'
                    defaultOpen={props.index > -1}
                >
                    <TextInputContentConfig
                        component={props.component}
                        onChange={props.onUpdateComponent}
                        allowMultipleLines={true}
                    />
                </ContentTabCollapsible>;
            case ClozeItemType.NumberInput:
                return <ContentTabCollapsible
                    compKey={props.component.key}
                    type='NUMBER INPUT'
                    defaultOpen={props.index > -1}
                >
                    <NumberInputContentConfig
                        component={props.component}
                        onChange={props.onUpdateComponent}
                    />
                </ContentTabCollapsible>;
            case ClozeItemType.DateInput:
                return <ContentTabCollapsible
                    compKey={props.component.key}
                    type='DATE INPUT'
                    defaultOpen={props.index > -1}
                >
                    <DateInputContentConfig
                        component={props.component}
                        onChange={props.onUpdateComponent}
                    />
                </ContentTabCollapsible>;
            case ClozeItemType.TimeInput:
                return <ContentTabCollapsible
                    compKey={props.component.key}
                    type='TIME INPUT'
                    defaultOpen={props.index > -1}
                >
                    <TimeInputContentConfig
                        component={props.component as ItemGroupComponent}
                        onChange={props.onUpdateComponent}
                    />
                </ContentTabCollapsible>;
            case ClozeItemType.Markdown:
                return <ContentTabCollapsible
                    compKey={props.component.key}
                    type='MARKDOWN'
                    defaultOpen={props.index > -1}>
                    <div className='space-y-1.5'
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
                    </div>
                </ContentTabCollapsible>;
            case ClozeItemType.LineBreak:
                return <div>Line break</div>;
            default:
                console.warn('Unknown / unimplemented item type:', clozeItemType);
                return <div>Unknown / unimplemented role: {clozeItemType}</div>;
        }
    }

    return (<SortableItem
        id={props.component.key || props.index.toString()}
    >
        <div className='relative'>
            <div className='absolute left-0 top-1/2'>
                <GripVertical className='size-4' />
            </div>
            <TabCard
                tabs={[
                    {
                        label: 'Content',
                        icon: <Languages className='me-1 size-3 text-muted-foreground' />,
                        content: <TabWrapper>
                            {renderContent()}
                        </TabWrapper>
                    },
                    {
                        label: 'Conditions',
                        icon: <ToggleLeft className='me-1 size-3 text-muted-foreground' />,
                        content: <TabWrapper>
                            TODO: display and disabled condition editor - for section header, disabled part is not relevant

                        </TabWrapper>
                    },
                    {
                        label: 'Settings',
                        icon: <Cog className='me-1 size-3 text-muted-foreground' />,
                        content: <TabWrapper>
                            <div className='space-y-1.5'
                                data-no-dnd="true"
                            >
                                <Label
                                    htmlFor='key'
                                >
                                    Key
                                </Label>
                                <div className='flex gap-2'>
                                    <Input
                                        id='key'
                                        value={currentKey}
                                        onChange={(e) => {
                                            setCurrentKey(e.target.value);
                                        }}
                                    />

                                    <Button
                                        variant={'outline'}
                                        disabled={currentKey === props.component.key}
                                        onClick={() => {
                                            setCurrentKey(props.component.key || '');
                                        }}
                                    >
                                        Reset
                                    </Button>
                                    <Button
                                        variant={'outline'}
                                        disabled={currentKey === props.component.key || !currentKey || props.existingKeys?.includes(currentKey)}
                                        onClick={() => {
                                            props.onUpdateComponent({
                                                ...props.component,
                                                key: currentKey,
                                            });
                                        }}
                                    >
                                        Apply
                                    </Button>
                                </div>
                                {(props.existingKeys?.includes(currentKey || '') && currentKey !== props.component.key) && <p className='text-danger-600 text-sm font-semibold'>Key already in use</p>}

                            </div>
                            <Separator />
                            <Button
                                data-no-dnd="true"
                                variant={'outline'}
                                className='hover:bg-danger-100'
                                onClick={() => {
                                    if (!confirm('Are you sure you want to delete this component?')) {
                                        return;
                                    }
                                    props.onDeleteComponent();
                                }}
                            >
                                Delete component
                            </Button>
                        </TabWrapper>
                    },
                ]}
            />
        </div>
    </SortableItem>)
}

const ClozeContentConfig: React.FC<ClozeContentConfigProps> = (props) => {
    const [draggedId, setDraggedId] = React.useState<string | null>(null);

    const clozeItems = props.component.items || [];
    //console.log('clozeItems:', clozeItems);

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
    };

    const draggedItem = clozeItems.find(comp => comp.key === draggedId);

    const usedKeys = clozeItems.map(comp => comp.key || '');

    return (
        <div className='mt-4'>
            <p className='font-semibold mb-2'>Items: <span className='text-muted-foreground'>({clozeItems.length})</span></p>
            <SortableWrapper
                sortableID={'response-group-editor'}
                direction='vertical'
                items={clozeItems.map((component, index) => {
                    return {
                        id: component.key || index.toString(),
                    }
                })}
                onDraggedIdChange={(id) => {
                    setDraggedId(id);
                }}
                onReorder={(activeIndex, overIndex) => {
                    const newItems = [...clozeItems];
                    newItems.splice(overIndex, 0, newItems.splice(activeIndex, 1)[0]);

                    updateComponent(newItems);
                }}
                dragOverlayItem={(draggedId && draggedItem) ?
                    <ContentItem
                        index={-1}
                        component={draggedItem}
                        onDeleteComponent={() => { }}
                        onUpdateComponent={() => { }}
                    />
                    : null}
            >
                <div className='overflow-y-auto'>
                    <ol className='flex flex-col gap-4 min-w-full'>
                        {clozeItems.map((component, index) => {
                            return <ContentItem
                                key={component.key || index}
                                index={index}
                                component={component}
                                existingKeys={usedKeys}
                                onDeleteComponent={() => {
                                    const newItems = clozeItems.filter(comp => comp.key !== component.key);
                                    updateComponent(newItems);
                                }}
                                onUpdateComponent={(updatedItem) => {
                                    const newItems = clozeItems.map((comp => {
                                        if (comp.key === component.key) {
                                            return updatedItem;
                                        }
                                        return comp;
                                    }))
                                    updateComponent(newItems);
                                }}
                            />
                        })}

                        <div className='flex justify-center w-full'>
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
                    </ol>
                </div>

            </SortableWrapper>
        </div>
    );


};

export default ClozeContentConfig;
