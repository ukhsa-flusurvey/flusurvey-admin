import SortableItem from '@/components/survey-editor/components/general/SortableItem';
import SortableWrapper from '@/components/survey-editor/components/general/SortableWrapper';
import AddDropdown from '@/components/survey-editor/components/general/add-dropdown';
import TabCard from '@/components/survey-editor/components/general/tab-card';
import { SurveyContext } from '@/components/survey-editor/surveyContext';
import { localisedObjectToMap } from '@/components/survey-editor/utils/localeUtils';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { generateLocStrings } from 'case-editor-tools/surveys/utils/simple-generators';
import { Binary, Calendar, CheckSquare, ChevronDown, Clock, Cog, FormInput, GripVertical, Heading, Languages, SquareStack, ToggleLeft } from 'lucide-react';
import React, { useContext } from 'react';
import { ItemComponent, ItemGroupComponent, SurveySingleItem } from 'survey-engine/data_types';
import TextViewContentEditor from './text-view-content-editor';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import TextInputContentConfig from './text-input-content-config';
import NumberInputContentConfig from './number-input-content-config';
import DateInputContentConfig from './date-input-content-config';
import ClozeContentConfig from './cloze-content-config';
import TimeInputContentConfig from './time-input-content-config';
import { ChoiceResponseOptionType } from '@/components/survey-viewer/survey-renderer/SurveySingleItemView/ResponseComponent/InputTypes/MultipleChoiceGroup';
import { TabWrapper } from "@/components/survey-editor/components/ItemEditor/editor/components/TabWrapper";

interface MultipleChoiceProps {
    surveyItem: SurveySingleItem;
    onUpdateSurveyItem: (item: SurveySingleItem) => void;
    isSingleChoice?: boolean;
}

const getOptionType = (option: ItemComponent): ChoiceResponseOptionType => {
    const optionType = option.role as keyof typeof ChoiceResponseOptionType;
    return optionType as ChoiceResponseOptionType;
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

export const OptionContentTabCollapsible = (props: { compKey?: string, type: string, children: React.ReactNode, defaultOpen: boolean }) => {
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

    const optionType = getOptionType(props.component);

    //console.log('optionType:', optionType);

    const renderContent = () => {
        switch (optionType) {
            case ChoiceResponseOptionType.SimpleText:
                const currentContent = localisedObjectToMap(props.component.content).get(selectedLanguage) || '';
                return <OptionContentTabCollapsible
                    compKey={props.component.key}
                    type='SIMPLE OPTION'
                    defaultOpen={props.index > -1}
                >
                    <div className='space-y-1.5'
                        data-no-dnd="true"
                    >
                        <Label
                            htmlFor={props.component.key + '-option-label'}
                        >
                            Option label
                        </Label>
                        <Input
                            id={props.component.key + '-option-label'}
                            placeholder='Enter option label for selected language...'
                            value={currentContent}
                            onChange={(e) => {
                                const updatedPart = { ...props.component };
                                const updatedContent = localisedObjectToMap(updatedPart.content);
                                updatedContent.set(selectedLanguage, e.target.value);
                                updatedPart.content = generateLocStrings(updatedContent);
                                props.onUpdateComponent(updatedPart);
                            }}
                        />
                    </div>
                </OptionContentTabCollapsible>;
            case ChoiceResponseOptionType.FormattedText:
                return <OptionContentTabCollapsible
                    compKey={props.component.key}
                    type='FORMATTED OPTION'
                    defaultOpen={props.index > -1}
                >
                    <TextViewContentEditor
                        component={props.component}
                        onChange={props.onUpdateComponent}
                        hideToggle={true}
                        useAdvancedMode={true}
                    />
                </OptionContentTabCollapsible>;
            case ChoiceResponseOptionType.TextInput:
                return <OptionContentTabCollapsible
                    compKey={props.component.key}
                    type='WITH TEXT INPUT'
                    defaultOpen={props.index > -1}
                >
                    <TextInputContentConfig
                        component={props.component}
                        onChange={props.onUpdateComponent}
                        allowMultipleLines={false}
                    />
                </OptionContentTabCollapsible>;
            case ChoiceResponseOptionType.NumberInput:
                return <OptionContentTabCollapsible
                    compKey={props.component.key}
                    type='WITH NUMBER INPUT'
                    defaultOpen={props.index > -1}
                >
                    <NumberInputContentConfig
                        component={props.component}
                        onChange={props.onUpdateComponent}
                    />
                </OptionContentTabCollapsible>;
            case ChoiceResponseOptionType.DateInput:
                return <OptionContentTabCollapsible
                    compKey={props.component.key}
                    type='WITH DATE INPUT'
                    defaultOpen={props.index > -1}
                >
                    <DateInputContentConfig
                        component={props.component}
                        onChange={props.onUpdateComponent}
                    />
                </OptionContentTabCollapsible>;
            case ChoiceResponseOptionType.Cloze:
                return <OptionContentTabCollapsible
                    compKey={props.component.key}
                    type='WITH CLOZE'
                    defaultOpen={props.index > -1}
                >
                    <ClozeContentConfig
                        component={props.component as ItemGroupComponent}
                        onChange={props.onUpdateComponent}
                    />
                </OptionContentTabCollapsible>;
            case ChoiceResponseOptionType.TimeInput:
                return <OptionContentTabCollapsible
                    compKey={props.component.key}
                    type='WITH TIME INPUT'
                    defaultOpen={props.index > -1}
                >
                    <TimeInputContentConfig
                        component={props.component as ItemGroupComponent}
                        onChange={props.onUpdateComponent}
                    />
                </OptionContentTabCollapsible>;
            case ChoiceResponseOptionType.DisplayText:
                return <OptionContentTabCollapsible
                    compKey={props.component.key}
                    type='DISPLAY TEXT'
                    defaultOpen={props.index > -1}
                >
                    <TextViewContentEditor
                        component={props.component}
                        onChange={props.onUpdateComponent}
                        hideToggle={true}
                        useAdvancedMode={true}
                    />
                </OptionContentTabCollapsible>;
            default:
                console.warn('Unknown / unimplemented choice option type:', optionType);
                return <div>Unknown option type</div>;
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

const MultipleChoice: React.FC<MultipleChoiceProps> = (props) => {
    const [draggedId, setDraggedId] = React.useState<string | null>(null);
    //console.log('props.surveyItem:', props.surveyItem);
    //console.log('props.isSingleChoice:', props.isSingleChoice);
    // TODO: remove magic strings
    const relevantResponseGroupRoleString = props.isSingleChoice ? 'singleChoiceGroup' : 'multipleChoiceGroup';

    const rgIndex = props.surveyItem.components?.items.findIndex(comp => comp.role === 'responseGroup');
    if (rgIndex === undefined || rgIndex === -1) {
        return <p>Response group not found</p>;
    }
    const rg = props.surveyItem.components?.items[rgIndex] as ItemGroupComponent;
    if (!rg || !rg.items) {
        return <p>Response group not found</p>;
    }

    const choiceGroupIndex = rg.items.findIndex(comp => comp.role === relevantResponseGroupRoleString);
    if (choiceGroupIndex === undefined || choiceGroupIndex === -1) {
        return <p>Multiple / Single choice group not found</p>;
    }
    const choiceGroup = rg.items[choiceGroupIndex] as ItemGroupComponent;
    if (!choiceGroup || !choiceGroup.items) {
        return <p>Multiple / Single choice group not found</p>;
    }


    const responseItems: ItemComponent[] = choiceGroup.items || [];

    const onAddItem = (keyOfSelectedOption: string) => {
        const randomKey = Math.random().toString(36).substring(9);
        //console.log('keyOfSelectedOption:', keyOfSelectedOption);
        const optionType = keyOfSelectedOption as keyof typeof ChoiceResponseOptionType;

        // Create empty option of given type.
        const newOption = {
            key: randomKey,
            role: optionType,
        }

        const newItems = [...responseItems, newOption];
        updateSurveyItemWithNewOptions(newItems);
    };

    const draggedItem = responseItems.find(comp => comp.key === draggedId);

    const updateSurveyItemWithNewOptions = (options: ItemComponent[]) => {
        const newChoiceGroup = {
            ...choiceGroup,
            items: options,
        };

        const newRg = {
            ...rg,
            items: rg.items.map(comp => {
                if (comp.role === relevantResponseGroupRoleString) {
                    return newChoiceGroup;
                }
                return comp;
            }),
        };

        const existingComponents = props.surveyItem.components?.items || [];
        existingComponents[rgIndex] = newRg;

        const newSurveyItem = {
            ...props.surveyItem,
            components: {
                ...props.surveyItem.components as ItemGroupComponent,
                items: existingComponents,
            }
        }
        props.onUpdateSurveyItem(newSurveyItem);
    }

    const usedKeys = responseItems.map(comp => comp.key || '');

    return (
        <div className='mt-4'>
            <p className='font-semibold mb-2'>Options: <span className='text-muted-foreground'>({responseItems.length})</span></p>
            <SortableWrapper
                sortableID={'response-group-editor'}
                direction='vertical'
                items={responseItems.map((component, index) => {
                    return {
                        id: component.key || index.toString(),
                    }
                })}
                onDraggedIdChange={(id) => {
                    setDraggedId(id);
                }}
                onReorder={(activeIndex, overIndex) => {
                    const newItems = [...responseItems];
                    newItems.splice(overIndex, 0, newItems.splice(activeIndex, 1)[0]);
                    updateSurveyItemWithNewOptions(newItems);
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
                        {responseItems.map((component, index) => {
                            return <ContentItem
                                key={component.key || index}
                                index={index}
                                component={component}
                                existingKeys={usedKeys}
                                onDeleteComponent={() => {
                                    const newItems = responseItems.filter(comp => comp.key !== component.key);
                                    updateSurveyItemWithNewOptions(newItems);
                                }}
                                onUpdateComponent={(updatedItem) => {
                                    const newItems = responseItems.map((comp => {
                                        if (comp.key === component.key) {
                                            return updatedItem;
                                        }
                                        return comp;
                                    }))
                                    updateSurveyItemWithNewOptions(newItems);
                                }}
                            />
                        })}

                        <div className='flex justify-center w-full'>
                            <AddDropdown
                                options={[
                                    { key: ChoiceResponseOptionType.SimpleText, label: 'Option with simple label', icon: <CheckSquare className='size-4 text-muted-foreground me-2' /> },
                                    { key: ChoiceResponseOptionType.FormattedText, label: 'Option with formatted label', icon: <CheckSquare className='size-4 text-muted-foreground me-2' /> },
                                    { key: ChoiceResponseOptionType.TextInput, label: 'Option with text input', icon: <FormInput className='size-4 text-muted-foreground me-2' /> },
                                    { key: ChoiceResponseOptionType.NumberInput, label: 'Option with number input', icon: <Binary className='size-4 text-muted-foreground me-2' /> },
                                    { key: ChoiceResponseOptionType.Cloze, label: 'Option with cloze', icon: <SquareStack className='size-4 text-muted-foreground me-2' /> },
                                    { key: ChoiceResponseOptionType.TimeInput, label: 'Option with time input', icon: <Clock className='size-4 text-muted-foreground me-2' /> },
                                    { key: ChoiceResponseOptionType.DateInput, label: 'Option with date input', icon: <Calendar className='size-4 text-muted-foreground me-2' /> },
                                    { key: ChoiceResponseOptionType.DisplayText, label: 'Display text', icon: <Heading className='size-4 text-muted-foreground me-2' /> },
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

export default MultipleChoice;
