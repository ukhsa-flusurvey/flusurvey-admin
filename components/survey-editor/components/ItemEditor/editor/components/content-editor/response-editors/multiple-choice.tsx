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
import { Binary, Calendar, CheckSquare, Clock, Cog, FormInput, GripVertical, Heading, Languages, SquareStack, ToggleLeft } from 'lucide-react';
import React, { useContext } from 'react';
import { ItemComponent, ItemGroupComponent, SurveySingleItem } from 'survey-engine/data_types';
import TextViewContentEditor from './text-view-content-editor';

interface MultipleChoiceProps {
    surveyItem: SurveySingleItem;
    onUpdateSurveyItem: (item: SurveySingleItem) => void;
}

const getOptionType = (option: ItemComponent): string => {
    if (option.role === 'option') {
        if ((option as ItemGroupComponent).items !== undefined) {
            return 'formattedOption';
        }
    }
    return option.role;
}

const TabWrapper = (props: { children: React.ReactNode }) => {
    return (
        <div className='p-4 ps-6 space-y-4 overflow-y-scroll'>
            {props.children}
        </div>
    )
}

const KeyAndType = (props: { compKey?: string, type: string }) => {
    return <div className='text-xs font-semibold flex justify-between'>
        <Badge className='h-auto py-0'>
            {props.compKey}
        </Badge>
        <span className='text-muted-foreground'>
            {props.type}
        </span>
    </div>
}

export const ContentItem = (props: {
    index: number, component: ItemComponent,
    onUpdateComponent: (component: ItemComponent) => void,
    onDeleteComponent: () => void

}) => {
    const { selectedLanguage } = useContext(SurveyContext);
    const [currentKey, setCurrentKey] = React.useState(props.component.key);

    const optionType = getOptionType(props.component);

    const renderContent = () => {
        switch (optionType) {
            case 'option':
                const currentContent = localisedObjectToMap(props.component.content).get(selectedLanguage) || '';
                return <div className='space-y-4'>
                    <KeyAndType compKey={props.component.key} type='SIMPLE OPTION' />

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
                </div>;
            case 'formattedOption':
                return <div className='space-y-4'>
                    <KeyAndType compKey={props.component.key} type='FORMATTED OPTION' />
                    <TextViewContentEditor
                        component={props.component}
                        onChange={props.onUpdateComponent}
                        hideToggle={true}
                        useAdvancedMode={true}
                    />
                </div>;
            case 'input':
                return <div>Option with text input</div>;
            case 'text':
                return <div>
                    <TextViewContentEditor
                        component={props.component}
                        onChange={props.onUpdateComponent}
                        hideToggle={true}
                    />
                </div>;
            case 'numberInput':
                return <div>Option with number input</div>;
            case 'cloze':
                return <div>Option with cloze</div>;
            case 'timeInput':
                return <div>Option with time input</div>;
            case 'dateInput':
                return <div>Option with date input</div>;
            default:
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
                            todo: edit key & delete option
                        </TabWrapper>
                    },
                ]}
            />
        </div>
    </SortableItem>)
}

const MultipleChoice: React.FC<MultipleChoiceProps> = (props) => {
    const [draggedId, setDraggedId] = React.useState<string | null>(null);

    const rgIndex = props.surveyItem.components?.items.findIndex(comp => comp.role === 'responseGroup');
    if (rgIndex === undefined || rgIndex === -1) {
        return <p>Response group not found</p>;
    }
    const rg = props.surveyItem.components?.items[rgIndex] as ItemGroupComponent;
    if (!rg || !rg.items) {
        return <p>Response group not found</p>;
    }

    const mcgGroupIndex = rg.items.findIndex(comp => comp.role === 'multipleChoiceGroup');
    if (mcgGroupIndex === undefined || mcgGroupIndex === -1) {
        return <p>Multiple choice group not found</p>;
    }
    const mcgGroup = rg.items[mcgGroupIndex] as ItemGroupComponent;
    if (!mcgGroup || !mcgGroup.items) {
        return <p>Multiple choice group not found</p>;
    }


    const responseItems: ItemComponent[] = mcgGroup.items || [];

    const onAddItem = (key: string) => {
        const randomKey = Math.random().toString(36).substring(9);
        let newOption: ItemComponent | undefined = undefined;

        switch (key) {
            case 'option-simple':
                newOption = {
                    key: randomKey,
                    role: 'option',
                    content: generateLocStrings(new Map<string, string>())
                }
                break;
            case 'option-formatted':
                newOption = {
                    key: randomKey,
                    role: 'option',
                    items: []
                }
                break;
            case 'option-text':
                newOption = {
                    key: randomKey,
                    role: 'input',
                    content: generateLocStrings(new Map<string, string>())
                }
                break;
            case 'option-number':
                newOption = {
                    key: randomKey,
                    role: 'numberInput',
                    content: generateLocStrings(new Map<string, string>())
                }
                break;
            case 'option-cloze':
                newOption = {
                    key: randomKey,
                    role: 'cloze',
                    items: [{
                        key: '1',
                        role: 'text',
                        content: generateLocStrings(new Map<string, string>())
                    }],
                }
                break;
            case 'option-time':
                newOption = {
                    key: randomKey,
                    role: 'timeInput',
                    content: generateLocStrings(new Map<string, string>())
                }
                break;
            case 'option-date':
                newOption = {
                    key: randomKey,
                    role: 'dateInput',
                    content: generateLocStrings(new Map<string, string>())
                }
                break;
            case 'section-header':
                newOption = {
                    key: randomKey,
                    role: 'text',
                    content: generateLocStrings(new Map<string, string>())
                }
                break;
        }

        if (!newOption) {
            console.warn('Unknown component type:', key);
            return;
        }
        const newItems = [...responseItems, newOption];
        updateSurveyItemWithNewOptions(newItems);
    };

    const draggedItem = responseItems.find(comp => comp.key === draggedId);

    const updateSurveyItemWithNewOptions = (options: ItemComponent[]) => {
        const newMcgGroup = {
            ...mcgGroup,
            items: options,
        };

        const newRg = {
            ...rg,
            items: rg.items.map(comp => {
                if (comp.role === 'multipleChoiceGroup') {
                    return newMcgGroup;
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

    return (
        <div className='mt-4'>
            <p>each item: delete item, edit key, disabled, display condition</p>
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
                <div className='overflow-y-scroll'>
                    <ol className='flex flex-col gap-4 min-w-full'>
                        {responseItems.map((component, index) => {
                            return <ContentItem
                                key={component.key || index}
                                index={index}
                                component={component}
                                onDeleteComponent={() => {


                                    /*const newItems = allItemComponents.filter(comp => comp.key !== component.key);
                                    const newSurveyItem = {
                                        ...props.surveyItem,
                                        components: {
                                            ...props.surveyItem.components as ItemComponent,
                                            items: newItems,
                                        }
                                    }
                                    props.onUpdateSurveyItem(newSurveyItem);*/
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
                                    { key: 'option-simple', label: 'Option with simple label', icon: <CheckSquare className='size-4 text-muted-foreground me-2' /> },
                                    { key: 'option-formatted', label: 'Option with formatted label', icon: <CheckSquare className='size-4 text-muted-foreground me-2' /> },
                                    { key: 'option-text', label: 'Option with text input', icon: <FormInput className='size-4 text-muted-foreground me-2' /> },
                                    { key: 'option-number', label: 'Option with number input', icon: <Binary className='size-4 text-muted-foreground me-2' /> },
                                    { key: 'option-cloze', label: 'Option with cloze', icon: <SquareStack className='size-4 text-muted-foreground me-2' /> },
                                    { key: 'option-time', label: 'Option with time input', icon: <Clock className='size-4 text-muted-foreground me-2' /> },
                                    { key: 'option-date', label: 'Option with date input', icon: <Calendar className='size-4 text-muted-foreground me-2' /> },
                                    { key: 'section-header', label: 'Section header', icon: <Heading className='size-4 text-muted-foreground me-2' /> },
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
