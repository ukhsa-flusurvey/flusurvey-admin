import SortableItem from '@/components/survey-editor/components/general/SortableItem';
import SortableWrapper from '@/components/survey-editor/components/general/SortableWrapper';
import AddDropdown from '@/components/survey-editor/components/general/add-dropdown';
import TabCard from '@/components/survey-editor/components/general/tab-card';
import { SurveyContext } from '@/components/survey-editor/surveyContext';
import { localisedObjectToMap } from '@/components/survey-editor/utils/localeUtils';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { generateLocStrings } from 'case-editor-tools/surveys/utils/simple-generators';
import { ChevronDown, Cog, Columns2, GripVertical, Languages, List, ToggleLeft } from 'lucide-react';
import React, { useContext } from 'react';
import { ItemComponent, ItemGroupComponent, SurveySingleItem } from 'survey-engine/data_types';
import { TabWrapper } from './multiple-choice';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface MatrixProps {
    surveyItem: SurveySingleItem;
    onUpdateSurveyItem: (item: SurveySingleItem) => void;
}

const CellItem = (props: {
    index: number, component: ItemComponent,
    onUpdateComponent: (component: ItemComponent) => void,
    onDeleteComponent: () => void,
    existingKeys?: string[]
}) => {
    const { selectedLanguage } = useContext(SurveyContext);
    const [currentKey, setCurrentKey] = React.useState(props.component.key || '');

    const dropdownOptionItems = (props.component as ItemGroupComponent).items || [];
    const dropdownOptions = dropdownOptionItems.map((item) => localisedObjectToMap(item.content).get(selectedLanguage)).join('\n');

    return (<SortableItem
        id={props.component.key || props.index.toString()}
    >
        <div className='min-w-80'>
            <TabCard
                tabs={[
                    {
                        label: 'Content',
                        icon: <Languages className='me-1 size-3 text-muted-foreground' />,
                        content: <TabWrapper>
                            <KeyAndType
                                compKey={props.component.key}
                                type='DROPDOWN'
                            />

                            <div className=''>
                                <Label
                                    htmlFor={props.component.key + '-dropdown-options'}
                                >
                                    <span>Dropdown options</span>
                                </Label>
                                <Textarea
                                    id={props.component.key + '-dropdown-options'}
                                    className='my-1'
                                    value={dropdownOptions}
                                    placeholder='Enter dropdown options...'
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        const newDropdownOptions = value.split('\n');

                                        const newDropdownOptionItems = newDropdownOptions.map((label, index) => {
                                            const existingDropdownOptionItem = dropdownOptionItems.length < index + 1 ? {
                                                key: index.toString(),
                                                role: 'text',
                                                content: generateLocStrings(new Map([[selectedLanguage, label]]))
                                            } : {
                                                ...dropdownOptionItems[index],
                                            }

                                            const updatedContent = localisedObjectToMap(existingDropdownOptionItem.content);
                                            updatedContent.set(selectedLanguage, label);
                                            existingDropdownOptionItem.content = generateLocStrings(updatedContent);
                                            return existingDropdownOptionItem;
                                        })

                                        props.onUpdateComponent({
                                            ...props.component,
                                            items: newDropdownOptionItems,
                                        })
                                    }}
                                />
                                <p className='text-xs'>
                                    One option label per line.
                                </p>
                            </div>
                        </TabWrapper>
                    },
                    {
                        label: 'Disabled',
                        icon: <ToggleLeft className='me-1 size-3 text-muted-foreground' />,
                        content: <TabWrapper>
                            TODO: disabled condition editor

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
                                    htmlFor={props.component.key + '-key'}
                                >
                                    Key
                                </Label>
                                <div className='flex gap-2'>
                                    <Input
                                        id={props.component.key + '-key'}
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
    </SortableItem>
    )
}

const RowCellEditor = (props: {
    row: ItemGroupComponent,
    onUpdateComponent: (component: ItemComponent) => void,
}) => {
    const { selectedLanguage } = useContext(SurveyContext);
    const [draggedId, setDraggedId] = React.useState<string | null>(null);

    const cells = props.row.items;

    const draggedItem = cells.find(ri => ri.key === draggedId);


    const onAddItem = (type: string) => {
        if (type === 'dropdown') {
            const newDropdown: ItemGroupComponent = {
                key: Math.random().toString(36).substring(9),
                role: 'dropDownGroup',
                // content: ,
                items: [],
                order: {
                    name: 'sequential'
                }
            }
            props.onUpdateComponent({
                ...props.row,
                items: [...props.row.items, newDropdown]
            });
        }
    };


    return (<div>
        <SortableWrapper
            sortableID={props.row.key + 'row-content-editor'}
            direction='horizontal'
            items={cells.map((component, index) => {
                return {
                    id: component.key || index.toString(),
                }
            })}
            onDraggedIdChange={(id) => {
                setDraggedId(id);
            }}
            onReorder={(activeIndex, overIndex) => {
                const newItems = [...cells];
                newItems.splice(overIndex, 0, newItems.splice(activeIndex, 1)[0]);
                props.onUpdateComponent({
                    ...props.row,
                    items: newItems
                });
            }}
            dragOverlayItem={(draggedId && draggedItem) ?
                <CellItem
                    index={-1}
                    component={draggedItem}
                    onDeleteComponent={() => { }}
                    onUpdateComponent={() => { }}
                />
                : null}
        >
            <p className='text-sm font-semibold'>
                Columns: <span className='text-muted-foreground'>({cells.length})</span>
            </p>
            <div className=' my-2 overflow-x-scroll overscroll-x-contain max-w-full'>
                <ol className='flex items-start gap-4 p-4 border border-border border-dashed rounded-md w-fit min-w-full' >

                    {cells.map((component, index) => {
                        return <CellItem
                            index={index}
                            key={component.key || index}
                            component={component}
                            existingKeys={cells.map(c => c.key || '')}
                            onUpdateComponent={(updatedComponent) => {
                                props.onUpdateComponent({
                                    ...props.row,
                                    items: cells.map((c, i) => {
                                        if (c.key === component.key) {
                                            return updatedComponent;
                                        }
                                        return c;
                                    })
                                });
                            }}
                            onDeleteComponent={() => {
                                const newItems = cells.filter(c => c.key !== component.key);
                                props.onUpdateComponent({
                                    ...props.row,
                                    items: newItems
                                });
                            }}
                        />
                    })}

                    <AddDropdown
                        options={[
                            { key: 'dropdown', label: 'Dropdown', icon: <List className='size-4 me-2 text-muted-foreground' /> },
                        ]}
                        onAddItem={onAddItem}
                    />
                </ol>
            </div>
        </SortableWrapper>
    </div>
    )
}


const KeyAndType = (props: { compKey?: string, type: string }) => {
    return <div className='text-xs font-semibold flex justify-between w-full'>
        <Badge className='h-auto py-0'>
            {props.compKey}
        </Badge>
        <span className='text-muted-foreground'>
            {props.type}
        </span>
    </div>
}

export const RowContentTabCollapsible = (props: { compKey?: string, type: string, children: React.ReactNode, defaultOpen: boolean }) => {
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


const RowEditor = (props: {
    index: number, component: ItemComponent,
    onUpdateComponent: (component: ItemComponent) => void,
    onDeleteComponent: () => void,
    existingKeys?: string[]
}) => {
    const { selectedLanguage } = useContext(SurveyContext);
    const [currentKey, setCurrentKey] = React.useState(props.component.key || '');

    const rowLabel = localisedObjectToMap(props.component.content).get(selectedLanguage) || '';

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
                            <RowContentTabCollapsible
                                compKey={props.component.key}
                                type='ROW'
                                defaultOpen={props.index > -1}
                            >
                                <Label
                                    htmlFor={props.component.key + '-row-label'}
                                >
                                    Row label
                                </Label>
                                <Input
                                    id={props.component.key + '-row-label'}
                                    placeholder='Enter label for selected language...'
                                    value={rowLabel}
                                    onChange={(e) => {
                                        const updatedPart = { ...props.component };
                                        const updatedContent = localisedObjectToMap(updatedPart.content);
                                        updatedContent.set(selectedLanguage, e.target.value);
                                        updatedPart.content = generateLocStrings(updatedContent);
                                        props.onUpdateComponent(updatedPart);
                                    }}
                                />

                                <div className='mt-4'>
                                    <RowCellEditor
                                        row={props.component as ItemGroupComponent}
                                        onUpdateComponent={(updatedComponent) => {
                                            props.onUpdateComponent(updatedComponent);
                                        }}
                                    />
                                </div>
                            </RowContentTabCollapsible>
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
    </SortableItem>
    )
}

const Matrix: React.FC<MatrixProps> = (props) => {
    const { selectedLanguage } = useContext(SurveyContext);
    const [draggedId, setDraggedId] = React.useState<string | null>(null);

    const rgIndex = props.surveyItem.components?.items.findIndex(comp => comp.role === 'responseGroup');
    if (rgIndex === undefined || rgIndex === -1) {
        return <p>Response group not found</p>;
    }
    const rg = props.surveyItem.components?.items[rgIndex] as ItemGroupComponent;
    const matrixIndex = rg.items.findIndex(comp => comp.role === 'matrix');
    if (matrixIndex === undefined || matrixIndex === -1) {
        return <p>Matrix not found</p>;
    }

    const matrixDef = (rg.items[matrixIndex] as ItemGroupComponent);

    const updateSurveyItemWithNewRg = (matrixItems: ItemComponent[]) => {
        const newMatrixDef = {
            ...matrixDef,
            items: matrixItems,
        };

        const newRg = {
            ...rg,
            items: rg.items.map(comp => {
                if (comp.role === 'matrix') {
                    return newMatrixDef;
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


    const headerLabelsEditor = () => {
        const headerRowIndex = matrixDef.items.findIndex(comp => comp.role === 'headerRow');
        const headerRow = (headerRowIndex === undefined || headerRowIndex === -1) ? [] : (matrixDef.items[headerRowIndex] as ItemGroupComponent).items;

        const headerColumnLabels = headerRow.map(
            (headerRowItem) => localisedObjectToMap(headerRowItem.content).get(selectedLanguage) || ''
        ).join('\n');

        return <div className=''>
            <Label
                htmlFor='matrix-header-labels'
            >
                <span>Header labels</span>
            </Label>
            <Textarea
                id='matrix-header-labels'
                className='my-1'
                value={headerColumnLabels}
                placeholder='Enter header labels...'
                onChange={(e) => {
                    const value = e.target.value;
                    const headerLabels = value.split('\n');

                    const newHeaderRow = headerLabels.map((label, index) => {
                        const existingHeaderRowItem = headerRow.length < index + 1 ? {
                            key: index.toString(),
                            role: 'text',
                            content: generateLocStrings(new Map([[selectedLanguage, label]]))
                        } : {
                            ...headerRow[index],
                        }

                        const updatedContent = localisedObjectToMap(existingHeaderRowItem.content);
                        updatedContent.set(selectedLanguage, label);
                        existingHeaderRowItem.content = generateLocStrings(updatedContent);
                        return existingHeaderRowItem;
                    })


                    if (headerRowIndex === undefined || headerRowIndex === -1) {
                        matrixDef.items.splice(0, 0, {
                            role: 'headerRow',
                            items: newHeaderRow,
                            order: {
                                name: 'sequential'
                            }
                        });
                    } else {
                        matrixDef.items[headerRowIndex] = {
                            ...matrixDef.items[headerRowIndex],
                            items: newHeaderRow,
                        }
                    }

                    updateSurveyItemWithNewRg(matrixDef.items);
                }}
            />
            <p className='text-xs'>
                One column label per line.
            </p>
        </div>
    }




    const matrixRowsEditor = () => {
        const matrixRows = matrixDef.items.filter(item => item.role !== 'headerRow');
        const usedKeys = matrixRows.map(comp => comp.key || '');

        const draggedItem = matrixRows.find(r => r.key === draggedId);

        const onAddItem = (type: string) => {
            if (type === 'responseRow') {
                const newRow: ItemGroupComponent = {
                    key: Math.random().toString(36).substring(9),
                    role: 'responseRow',
                    items: [],
                    order: {
                        name: 'sequential'
                    }
                }

                const newItems = [...matrixDef.items, newRow];
                updateSurveyItemWithNewRg(newItems);

                return;
            }

            alert(`unsupported row type: ${type}`);
            return;
        }


        return <div className='mt-4'>
            <p className='font-semibold mb-2'>Rows: <span className='text-muted-foreground'>({matrixRows.length})</span></p>
            <SortableWrapper
                sortableID={'response-group-editor'}
                direction='vertical'
                items={matrixRows.map((component, index) => {
                    return {
                        id: component.key || index.toString(),
                    }
                })}
                onDraggedIdChange={(id) => {
                    setDraggedId(id);
                }}
                onReorder={(activeIndex, overIndex) => {
                    const newItems = [...matrixRows];
                    newItems.splice(overIndex, 0, newItems.splice(activeIndex, 1)[0]);

                    // matrixDef.items = newItems;
                    const headerRow = matrixDef.items.find(item => item.role === 'headerRow');
                    if (headerRow) {
                        newItems.splice(0, 0, headerRow);
                    }
                    updateSurveyItemWithNewRg(newItems);
                }}
                dragOverlayItem={(draggedId && draggedItem) ?
                    <RowEditor
                        index={-1}
                        component={draggedItem}
                        onDeleteComponent={() => { }}
                        onUpdateComponent={() => { }}
                    />
                    : null}
            >
                <div className='overflow-y-scroll py-1'>
                    <ol className='flex flex-col gap-4 min-w-full'>
                        {matrixRows.map((component, index) => {
                            return <RowEditor
                                key={component.key || index}
                                index={index}
                                component={component}
                                existingKeys={usedKeys}
                                onDeleteComponent={() => {
                                    const newItems = matrixDef.items.filter(comp => comp.key !== component.key);
                                    updateSurveyItemWithNewRg(newItems);
                                }}
                                onUpdateComponent={(updatedItem) => {
                                    const newItems = matrixDef.items.map((comp => {
                                        if (comp.key === component.key) {
                                            return updatedItem;
                                        }
                                        return comp;
                                    }))
                                    updateSurveyItemWithNewRg(newItems);
                                }}
                            />
                        })}

                        <div className='flex justify-center w-full'>
                            <AddDropdown
                                options={[
                                    { key: 'responseRow', label: 'Row', icon: <Columns2 className='size-4 text-muted-foreground me-2' /> },
                                ]}
                                onAddItem={onAddItem}
                            />
                        </div>
                    </ol>
                </div>

            </SortableWrapper>
        </div>
    }

    return (
        <div className='space-y-4 pt-6'>
            {headerLabelsEditor()}
            {matrixRowsEditor()}
        </div>
    );
};

export default Matrix;
