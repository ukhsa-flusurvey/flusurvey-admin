import React, { useContext } from 'react';
import EditorWrapper from './editor-wrapper';
import { ItemComponent, SurveySingleItem } from 'survey-engine/data_types';
import TabCard from '@/components/survey-editor/components/general/tab-card';
import { AlertCircle, AlertTriangle, Cog, GripVertical, Languages, ToggleLeft, Type } from 'lucide-react';
import SurveyLanguageToggle from '@/components/survey-editor/components/general/SurveyLanguageToggle';
import SortableWrapper from '@/components/survey-editor/components/general/SortableWrapper';
import AddDropdown from '@/components/survey-editor/components/general/add-dropdown';
import { filterForBodyComponents, findTopComponents } from '@/components/survey-renderer/SurveySingleItemView/utils';
import SortableItem from '@/components/survey-editor/components/general/SortableItem';
import { generateLocStrings } from 'case-editor-tools/surveys/utils/simple-generators';
import { SurveyContext } from '@/components/survey-editor/surveyContext';
import { ComponentGenerators } from 'case-editor-tools/surveys/utils/componentGenerators';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { localisedObjectToMap } from '@/components/survey-editor/utils/localeUtils';
import MarkdownContentEditor from './markdown-content-editor';
import { TabWrapper } from "@/components/survey-editor/components/ItemEditor/editor/components/TabWrapper";
import { SimpleTextViewContentEditor } from './response-editors/text-view-content-editor';


interface TopContentEditorProps {
    surveyItem: SurveySingleItem;
    onUpdateSurveyItem: (item: SurveySingleItem) => void;
}

export const ContentItem = (props: {
    index: number, component: ItemComponent,
    onUpdateComponent: (component: ItemComponent) => void,
    onDeleteComponent: () => void

}) => {
    const { selectedLanguage } = useContext(SurveyContext);
    const [currentKey, setCurrentKey] = React.useState(props.component.key);

    const currentContent = localisedObjectToMap(props.component.content).get(selectedLanguage) || '';

    const renderContent = () => {
        if (props.component.role === 'markdown') {
            return <div className='p-4 ps-6'>
                <div
                    data-no-dnd="true"
                >
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
            </div>
        }

        return <TabWrapper>
            <div className='flex gap-2 items-center'>
                <span className='text-xs'>Type:</span>
                <span className='uppercase font-bold'>{props.component.role}</span>
            </div>
            <div className='space-y-1.5'
                data-no-dnd="true"
            >
                <SimpleTextViewContentEditor
                    component={props.component}
                    hideStyling={false}
                    useTextArea={true}
                    onChange={(newComp) => {
                        props.onUpdateComponent(newComp);
                    }} />
            </div>
        </TabWrapper>
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
                        content: renderContent()
                    },
                    {
                        label: 'Condition',
                        icon: <ToggleLeft className='me-1 size-3 text-muted-foreground' />,
                        content: <TabWrapper>TODO: condition editor</TabWrapper>
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
                                        disabled={currentKey === props.component.key}
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
                    }
                ]}
            />
        </div>
    </SortableItem>
    )
}

const TopContentEditor: React.FC<TopContentEditorProps> = (props) => {
    const [draggedId, setDraggedId] = React.useState<string | null>(null);
    const { selectedLanguage } = useContext(SurveyContext);

    const allItemComponents = props.surveyItem.components?.items || [];
    const relevantBodyComponents = filterForBodyComponents(allItemComponents);
    const topComponents = findTopComponents(relevantBodyComponents);

    const draggedItem = topComponents.find(comp => comp.key === draggedId);

    const onAddItem = (type: string) => {
        const randomKey = Math.random().toString(36).substring(7);
        let newComponent: ItemComponent | undefined = undefined;

        switch (type) {
            case 'simple-text':
                newComponent = {
                    key: randomKey,
                    role: 'text',
                    content: generateLocStrings(new Map([[selectedLanguage, '']])),
                    style: [],
                }
                break;
            case 'markdown':
                newComponent = ComponentGenerators.markdown({
                    key: randomKey,
                    content: new Map([[selectedLanguage, '']]),
                });
                break;
            case 'error':
                newComponent = {
                    key: randomKey,
                    role: 'error',
                    content: generateLocStrings(new Map([[selectedLanguage, '']])),
                    style: [],
                }
                break;
            case 'warning':
                newComponent = {
                    key: randomKey,
                    role: 'warning',
                    content: generateLocStrings(new Map([[selectedLanguage, '']])),
                    style: [],
                }
                break;
        }
        if (!newComponent) {
            console.warn('Unknown component type:', type);
            return;
        }

        const existingComponents = props.surveyItem.components?.items || [];
        const firstRgIndex = existingComponents.findIndex(comp => comp.role === 'responseGroup');
        if (firstRgIndex < 0) {
            existingComponents.push(newComponent);
        } else {
            existingComponents.splice(firstRgIndex, 0, newComponent);
        }

        props.onUpdateSurveyItem({
            ...props.surveyItem,
            components: {
                ...props.surveyItem.components as ItemComponent,
                items: [
                    ...existingComponents,
                ]
            }
        });
    }

    return (
        <EditorWrapper>
            <div className='flex justify-end'>
                <SurveyLanguageToggle />
            </div>

            <SortableWrapper
                sortableID={'top-content-editor'}
                direction='vertical'
                items={topComponents.map((component, index) => {
                    return {
                        id: component.key || index.toString(),
                    }
                })}
                onDraggedIdChange={(id) => {
                    setDraggedId(id);
                }}
                onReorder={(activeIndex, overIndex) => {
                    const globalActiveIndex = allItemComponents.findIndex(comp => comp.key === topComponents[activeIndex].key);
                    const globalOverIndex = allItemComponents.findIndex(comp => comp.key === topComponents[overIndex].key);

                    const newItems = [...allItemComponents];
                    newItems.splice(globalOverIndex, 0, newItems.splice(globalActiveIndex, 1)[0]);

                    const newSurveyItem = {
                        ...props.surveyItem,
                        components: {
                            ...props.surveyItem.components as ItemComponent,
                            items: newItems,
                        }
                    }
                    props.onUpdateSurveyItem(newSurveyItem);
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

                <div className='my-2 overflow-y-auto overscroll-y-contain max-w-full'>
                    <ol className='flex flex-col gap-4 min-w-full'>
                        {topComponents.map((component, index) => {
                            return <ContentItem
                                key={component.key || index}
                                index={index}
                                component={component}
                                onDeleteComponent={() => {
                                    const newItems = allItemComponents.filter(comp => comp.key !== component.key);
                                    const newSurveyItem = {
                                        ...props.surveyItem,
                                        components: {
                                            ...props.surveyItem.components as ItemComponent,
                                            items: newItems,
                                        }
                                    }
                                    props.onUpdateSurveyItem(newSurveyItem);
                                }}
                                onUpdateComponent={(updatedItem) => {
                                    const newItems = allItemComponents.map(comp => {
                                        if (comp.key === component.key) {
                                            return updatedItem;
                                        }
                                        return comp;
                                    });
                                    const newSurveyItem = {
                                        ...props.surveyItem,
                                        components: {
                                            ...props.surveyItem.components as ItemComponent,
                                            items: newItems,
                                        }
                                    }
                                    props.onUpdateSurveyItem(newSurveyItem);
                                }}
                            />
                        })}

                        <div className='flex justify-center w-full'>
                            <AddDropdown
                                options={[
                                    { key: 'simple-text', label: 'Simple text', icon: <Type className='size-4 me-2 text-muted-foreground' /> },
                                    { key: 'markdown', label: 'Markdown', icon: <Type className='size-4 me-2 text-muted-foreground' /> },
                                    { key: 'error', label: 'Error', icon: <AlertCircle className='size-4 me-2 text-muted-foreground' /> },
                                    { key: 'warning', label: 'Warning', icon: <AlertTriangle className='size-4 me-2 text-muted-foreground' /> },
                                ]}
                                onAddItem={onAddItem}
                            />
                        </div>


                    </ol>
                </div>
            </SortableWrapper>
        </EditorWrapper>
    );
};

export default TopContentEditor;
