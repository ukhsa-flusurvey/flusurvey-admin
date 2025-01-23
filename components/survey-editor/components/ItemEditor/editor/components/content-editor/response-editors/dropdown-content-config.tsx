

import SortableItem from '@/components/survey-editor/components/general/SortableItem';
import SortableWrapper from '@/components/survey-editor/components/general/SortableWrapper';
import AddDropdown from '@/components/survey-editor/components/general/add-dropdown';
import { SurveyContext } from '@/components/survey-editor/surveyContext';
import { localisedObjectToMap } from '@/components/survey-editor/utils/localeUtils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { generateLocStrings } from 'case-editor-tools/surveys/utils/simple-generators';
import { Circle, X } from 'lucide-react';
import React, { useContext } from 'react';
import { toast } from 'sonner';
import { ItemComponent, ItemGroupComponent } from 'survey-engine/data_types';

interface DropdownContentConfigProps {
    hideLabel?: boolean;
    hidePlaceholder?: boolean;
    component: ItemComponent;
    onChange: (newComp: ItemComponent) => void;
}

const DropdownOptionItem = (props: {
    index: number;
    optionComp: ItemComponent;
    onChange?: (newComp: ItemComponent) => void;
    onDelete?: () => void;
    usedKeys?: string[];

}) => {
    const { selectedLanguage } = useContext(SurveyContext);
    const currentContent = localisedObjectToMap(props.optionComp.content).get(selectedLanguage) || '';

    return (
        <SortableItem
            id={props.optionComp.key || props.index.toString()}
            className='w-full'
        >
            <div className='bg-secondary rounded-md border border-border p-2 flex gap-2 items-center'>
                <Input
                    value={props.optionComp.key || ''}
                    onChange={(e) => {
                        const value = e.target.value;
                        if (value.length < 1) {
                            toast.error('Key cannot be empty');
                            return;
                        }
                        if (props.usedKeys?.includes(value)) {
                            toast.error('Key already in use');
                            return;
                        }

                        if (props.onChange) {
                            props.onChange({
                                ...props.optionComp,
                                key: value,
                            })
                        }

                    }}
                    className='w-24'
                    placeholder='Key...'
                />

                <Input
                    value={currentContent}
                    className='grow'
                    onChange={(e) => {
                        const updatedContent = localisedObjectToMap(props.optionComp.content);
                        updatedContent.set(selectedLanguage, e.target.value);
                        props.optionComp.content = generateLocStrings(updatedContent);
                        if (props.onChange) {
                            props.onChange(props.optionComp);
                        }
                    }}
                    placeholder='Enter option content...'
                />


                <Button
                    variant='ghost'
                    size='icon'
                    onClick={() => {
                        if (confirm('Are you sure you want to delete this option?')) {
                            props.onDelete?.();
                        }
                    }}
                >
                    <X className='size-4 text-muted-foreground' />
                </Button>
            </div>
        </SortableItem>
    )
}

const DropdownContentConfig: React.FC<DropdownContentConfigProps> = (props) => {
    const { selectedLanguage } = useContext(SurveyContext);
    const [draggedId, setDraggedId] = React.useState<string | null>(null);

    const currentLabel = localisedObjectToMap(props.component.content).get(selectedLanguage) || '';
    const currentPlaceholder = localisedObjectToMap(props.component.description).get(selectedLanguage) || '';
    const currentItems = (props.component as ItemGroupComponent).items || [];

    const draggedItem = currentItems.find(ri => ri.key === draggedId);

    const usedKeys = currentItems.map(comp => comp.key || '');


    return (
        <div className='space-y-4'>
            {!props.hideLabel && <div className='space-y-1.5'>
                <Label
                    htmlFor={props.component.key + 'label'}
                >
                    Label
                </Label>
                <Input
                    id={props.component.key + 'label'}
                    value={currentLabel}
                    onChange={(e) => {
                        const updatedComponent = { ...props.component };
                        const updatedContent = localisedObjectToMap(updatedComponent.content);
                        updatedContent.set(selectedLanguage, e.target.value);
                        updatedComponent.content = generateLocStrings(updatedContent);
                        props.onChange(updatedComponent);
                    }}
                    placeholder='Enter label...'
                />
            </div>}

            {!props.hidePlaceholder && <div className='space-y-1.5'>
                <Label
                    htmlFor={props.component.key + 'placeholder'}
                >
                    Placeholder text
                </Label>
                <Input
                    id={props.component.key + 'placeholder'}
                    value={currentPlaceholder}
                    onChange={(e) => {
                        const updatedComponent = { ...props.component };
                        const updatedContent = localisedObjectToMap(updatedComponent.description);
                        updatedContent.set(selectedLanguage, e.target.value);
                        updatedComponent.description = generateLocStrings(updatedContent);
                        props.onChange(updatedComponent);
                    }}
                    placeholder='Enter placeholder...'
                />
            </div>}


            <div>
                <SortableWrapper
                    sortableID={props.component.key + 'options'}
                    direction='vertical'
                    onDraggedIdChange={(id) => {
                        setDraggedId(id);
                    }}
                    items={currentItems.map((item, index) => {
                        return {
                            id: item.key || index.toString(),
                        }
                    })}
                    onReorder={(activeIndex, overIndex) => {
                        const newItems = [...currentItems];
                        newItems.splice(overIndex, 0, newItems.splice(activeIndex, 1)[0]);
                        props.onChange({
                            ...props.component,
                            items: newItems,
                        })
                    }}
                    dragOverlayItem={(draggedId && draggedItem) ?
                        <DropdownOptionItem
                            index={-1}
                            optionComp={draggedItem}
                        />
                        : null}
                >
                    <p className='text-sm font-semibold'>
                        Options: <span className='text-muted-foreground'>({currentItems.length})</span>
                    </p>

                    <ol className='gap-4 p-4 flex flex-col items-center border border-border border-dashed rounded-md min-w-full' >
                        {currentItems.map((item, index) => {
                            return <DropdownOptionItem
                                key={item.key || index}
                                index={index}
                                optionComp={item}
                                onChange={(newComp) => {
                                    const newItems = [...currentItems];
                                    newItems[index] = newComp;
                                    props.onChange({
                                        ...props.component,
                                        items: newItems,
                                    })
                                }}
                                onDelete={() => {
                                    const newItems = [...currentItems];
                                    newItems.splice(index, 1);
                                    props.onChange({
                                        ...props.component,
                                        items: newItems,
                                    })
                                }}
                                usedKeys={usedKeys}
                            />
                        })}

                        <AddDropdown
                            options={[
                                { key: 'option', label: 'Option', icon: <Circle className='size-4 text-muted-foreground me-2' /> },
                            ]}
                            onAddItem={(type) => {
                                if (type === 'option') {
                                    const newOption: ItemComponent = {
                                        key: currentItems.length.toString(),
                                        role: 'option',
                                    }
                                    props.onChange({
                                        ...props.component,
                                        items: [...currentItems, newOption],
                                    })
                                }
                            }}
                        />
                    </ol>

                </SortableWrapper>

            </div>
        </div >


    );
};

export default DropdownContentConfig;
