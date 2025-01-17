import SortableItem from '@/components/survey-editor/components/general/SortableItem';
import SortableWrapper from '@/components/survey-editor/components/general/SortableWrapper';
import AddDropdown from '@/components/survey-editor/components/general/add-dropdown';
import TabCard from '@/components/survey-editor/components/general/tab-card';
import { SurveyContext } from '@/components/survey-editor/surveyContext';
import { localisedObjectToMap } from '@/components/survey-editor/utils/localeUtils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { generateLocStrings } from 'case-editor-tools/surveys/utils/simple-generators';
import { Check, Circle, Cog, GripHorizontal, GripVertical, Languages, Rows, ToggleLeft, Trash2, X } from 'lucide-react';
import React, { useContext } from 'react';
import { ItemComponent, ItemGroupComponent, SurveySingleItem } from 'survey-engine/data_types';
import { TabWrapper } from "@/components/survey-editor/components/ItemEditor/editor/components/TabWrapper";
import { Separator } from '@/components/ui/separator';

interface RscaProps {
    surveyItem: SurveySingleItem;
    onUpdateSurveyItem: (item: SurveySingleItem) => void;
}

const ModeSelector = (props: {
    size: string,
    mode?: string,
    onChange: (size: string, mode: string) => void
}) => {
    return <div className='flex items-center gap-2'>
        <p className='w-20 font-semibold text-sm'>{props.size}</p>
        <Select value={props.mode || ''}
            onValueChange={(value) => {
                props.onChange(props.size, value);
            }}
        >
            <SelectTrigger>
                <SelectValue placeholder="Select a render mode..." />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value='vertical'>Vertical</SelectItem>
                <SelectItem value='horizontal'>Horizontal</SelectItem>
                <SelectItem value='table'>Table</SelectItem>
            </SelectContent>
        </Select>
    </div>
}

const KeyEditor = (props: {
    currentKey: string;
    existingKeys?: string[];
    onChange: (newKey: string) => void;
}) => {
    const [editedKey, setEditedKey] = React.useState<string>(props.currentKey);

    const hasValidKey = (key: string): boolean => {
        if (key.length < 1) {
            return false;
        }
        if (props.existingKeys?.includes(key)) {
            return false;
        }
        return true;
    }


    return <div className='flex items-center gap-2'
        data-no-dnd="true"
    >
        <Label htmlFor={'item-key-' + props.currentKey}>
            Key
        </Label>
        <Input
            id={'validation-key-' + props.currentKey}
            className='w-32'
            value={editedKey}
            onChange={(e) => {
                const value = e.target.value;

                setEditedKey(value);
            }}
        />
        {editedKey !== props.currentKey &&
            <div className='flex items-center'>
                <Button
                    variant='ghost'
                    className='text-destructive'
                    size='icon'
                    onClick={() => {
                        setEditedKey(props.currentKey);
                    }}
                >
                    <X className='size-4' />
                </Button>
                <Button
                    variant='ghost'
                    size='icon'
                    className='text-primary'
                    disabled={!hasValidKey(editedKey)}
                    onClick={() => {
                        props.onChange(editedKey);
                    }}
                >
                    <Check className='size-4' />
                </Button>
            </div>}
    </div>
}

const OptionEditor = (props: {
    option: ItemComponent;
    existingKeys?: string[];
    onChange: (newOption: ItemComponent) => void;
    onDelete: () => void;
}) => {
    const { selectedLanguage } = useContext(SurveyContext);

    const optionLabel = localisedObjectToMap(props.option.content).get(selectedLanguage) || '';

    return <SortableItem
        id={props.option.key!}
    >
        <div className='border border-border rounded-md p-2 relative space-y-2 bg-slate-50'>
            <div className='absolute left-1/2 top-0'>
                <GripHorizontal className='size-4' />
            </div>
            <div className='flex items-center gap-2 w-full'>
                <div className='grow'>
                    <KeyEditor
                        currentKey={props.option.key || ''}
                        existingKeys={props.existingKeys}
                        onChange={(newKey) => {
                            props.onChange({
                                ...props.option,
                                key: newKey
                            })
                        }}
                    />
                </div>
                <Button
                    variant='ghost'
                    size='icon'
                    onClick={() => {
                        if (!confirm('Are you sure you want to delete this option?')) {
                            return;
                        }
                        props.onDelete();
                    }}
                >
                    <Trash2 className='size-4' />
                </Button>
            </div>

            <Label
                className='flex items-center gap-2'
                htmlFor={`option-label-${props.option.key}`}
            >
                <span>
                    Label
                </span>
                <Input
                    id={`option-label-${props.option.key}`}
                    className='w-full'
                    value={optionLabel || ''}
                    placeholder='Enter option label...'
                    onChange={(e) => {
                        const updatedComponent = { ...props.option };
                        const updatedContent = localisedObjectToMap(updatedComponent.content);
                        updatedContent.set(selectedLanguage, e.target.value);
                        updatedComponent.content = generateLocStrings(updatedContent);
                        props.onChange(updatedComponent)
                    }}
                />
            </Label>


        </div>

    </SortableItem>
}

const OptionsEditor = (props: {
    options: ItemComponent[],
    onChange: (newOptions: ItemComponent[]) => void
}) => {
    const [draggedId, setDraggedId] = React.useState<string | null>(null);

    const draggedItem = props.options.find(option => option.key === draggedId);

    return <div>
        <p className='font-semibold'>
            Options ({props.options.length})
        </p>
        <p className='text-sm text-muted-foreground'>
            These options will be used for each row
            (drag and drop to reorder)
        </p>

        <SortableWrapper
            sortableID={`options-for-rsca`}
            items={props.options.map((option, index) => {
                return {
                    id: option.key || index.toString(),
                }
            })}
            onDraggedIdChange={(id) => {
                setDraggedId(id);
            }}
            onReorder={(activeIndex, overIndex) => {
                const newItems = [...props.options];
                newItems.splice(activeIndex, 1);
                newItems.splice(overIndex, 0, props.options[activeIndex]);
                props.onChange(newItems);

            }}
            dragOverlayItem={(draggedId && draggedItem) ?
                <OptionEditor
                    option={draggedItem}
                    onChange={() => { }}
                    onDelete={() => { }}
                />
                : null}
        >

            <ol className='px-1 space-y-2 py-4'>
                {props.options.length === 0 && <p className='text-sm text-primary'>
                    No options defined.
                </p>}
                {props.options.map((option, index) => {
                    return <OptionEditor
                        key={option.key || index}
                        option={option}
                        existingKeys={props.options.map(o => o.key || index.toString())}
                        onChange={(newOption) => {
                            const newOptions = props.options.map((o) => {
                                if (o.key === option.key) {
                                    return newOption;
                                }
                                return o;
                            });
                            props.onChange(newOptions);
                        }}
                        onDelete={() => {
                            const newOptions = props.options.filter((o) => {
                                return o.key !== option.key;
                            });
                            props.onChange(newOptions);
                        }}
                    />
                })}
            </ol>
        </SortableWrapper>

        <AddDropdown
            options={[
                { key: 'option', label: 'Option', icon: <Circle className='size-4 text-neutral-500 me-2' /> },
            ]}
            onAddItem={(type) => {
                if (type === 'option') {
                    const newOption: ItemComponent = {
                        key: Math.random().toString(36).substring(9),
                        role: 'option',
                    }
                    props.onChange([...props.options, newOption]);
                }
            }}
        />
    </div>
}

const RowEditor = (props: {
    row: ItemComponent;
    existingKeys?: string[];
    onChange: (newRow: ItemComponent) => void;
    onDelete: () => void;
}) => {
    const { selectedLanguage } = useContext(SurveyContext);

    const rowLabel = localisedObjectToMap(props.row.content).get(selectedLanguage) || '';

    const horizontalModeLabelPlacement = props.row.style?.find(s => s.key === 'horizontalModeLabelPlacement')?.value || 'bottom';
    const horizontalModeClassName = props.row.style?.find(s => s.key === 'horizontalModeClassName')?.value;
    const verticalModeClassName = props.row.style?.find(s => s.key === 'verticalModeClassName')?.value;
    const tableModeClassName = props.row.style?.find(s => s.key === 'tableModeClassName')?.value;

    return <SortableItem
        id={props.row.key!}
    >
        <div className='relative'>
            <div className='absolute left-0 top-1/2'>
                <GripVertical className='size-4' />
            </div>
            <TabCard
                tabs={[
                    {
                        label: 'General',
                        icon: <Languages className='me-1 size-3 text-muted-foreground' />,
                        content: <TabWrapper>
                            <div className='flex justify-between gap-2 items-center'>
                                <KeyEditor
                                    currentKey={props.row.key || ''}
                                    existingKeys={props.existingKeys}
                                    onChange={(newKey) => {
                                        props.onChange({
                                            ...props.row,
                                            key: newKey
                                        })
                                    }}
                                />
                                <Button
                                    variant='ghost'
                                    size='sm'
                                    onClick={() => {
                                        if (!confirm('Are you sure you want to delete this row?')) {
                                            return;
                                        }
                                        props.onDelete();
                                    }}
                                >
                                    <Trash2 className='size-4' />
                                </Button>
                            </div>
                            <div
                                data-no-dnd="true"
                                className='flex items-center gap-2'
                            >
                                <Label
                                    htmlFor={`row-label-${props.row.key}`}
                                >
                                    Label
                                </Label>
                                <Input
                                    id={`row-label-${props.row.key}`}
                                    className='w-full'
                                    value={rowLabel || ''}
                                    placeholder='Enter row label...'
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        const updatedComponent = { ...props.row };
                                        const updatedContent = localisedObjectToMap(updatedComponent.content);
                                        updatedContent.set(selectedLanguage, value);
                                        updatedComponent.content = generateLocStrings(updatedContent);
                                        props.onChange(updatedComponent);
                                    }}
                                />
                            </div>
                        </TabWrapper>
                    },
                    {
                        label: 'Condition',
                        icon: <ToggleLeft className='me-1 size-3 text-muted-foreground' />,
                        content: <TabWrapper>
                            TODO: condition editor
                        </TabWrapper>
                    },
                    {
                        label: 'Extras',
                        icon: <Cog className='me-1 size-3 text-muted-foreground' />,
                        content: <TabWrapper>
                            <div>
                                <p className='font-semibold text-sm mb-1.5'>Option label placement in horizontal mode:</p>
                                <Select
                                    value={horizontalModeLabelPlacement}
                                    onValueChange={(value) => {
                                        const existingStyles = [...props.row.style || []];
                                        const index = existingStyles.findIndex(st => st.key === 'horizontalModeLabelPlacement');
                                        if (value === 'bottom') {
                                            if (index > -1) {
                                                existingStyles.splice(index, 1);
                                            }
                                        } else {
                                            if (index > -1) {
                                                existingStyles[index] = { key: 'horizontalModeLabelPlacement', value };
                                            } else {
                                                existingStyles.push({ key: 'horizontalModeLabelPlacement', value });
                                            }
                                        }

                                        props.onChange({
                                            ...props.row,
                                            style: existingStyles
                                        })
                                    }}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a label placement..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value='bottom'>Bottom</SelectItem>
                                        <SelectItem value='top'>Top</SelectItem>
                                        <SelectItem value='none'>Hidden</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <p className='font-semibold text-sm mb-1.5'>Row class name in horizontal mode:</p>
                                <Input
                                    value={horizontalModeClassName}
                                    onChange={(event) => {
                                        const value = event.target.value;
                                        const existingStyles = [...props.row.style || []];
                                        const index = existingStyles.findIndex(st => st.key === 'horizontalModeClassName');
                                        if (value === '') {
                                            if (index > -1) {
                                                existingStyles.splice(index, 1);
                                            }
                                        } else {
                                            if (index > -1) {
                                                existingStyles[index] = { key: 'horizontalModeClassName', value };
                                            } else {
                                                existingStyles.push({ key: 'horizontalModeClassName', value });
                                            }
                                        }

                                        props.onChange({
                                            ...props.row,
                                            style: existingStyles
                                        })
                                    }}
                                />
                            </div>
                            <Separator />
                            <div>
                                <p className='font-semibold text-sm mb-1.5'>Row class name in vertical mode:</p>
                                <Input
                                    value={verticalModeClassName}
                                    onChange={(event) => {
                                        const value = event.target.value;
                                        const existingStyles = [...props.row.style || []];
                                        const index = existingStyles.findIndex(st => st.key === 'verticalModeClassName');
                                        if (value === '') {
                                            if (index > -1) {
                                                existingStyles.splice(index, 1);
                                            }
                                        } else {
                                            if (index > -1) {
                                                existingStyles[index] = { key: 'verticalModeClassName', value };
                                            } else {
                                                existingStyles.push({ key: 'verticalModeClassName', value });
                                            }
                                        }

                                        props.onChange({
                                            ...props.row,
                                            style: existingStyles
                                        })
                                    }}
                                />
                            </div>
                            <Separator />

                            <div>
                                <p className='font-semibold text-sm mb-1.5'>Row class name in table mode:</p>
                                <Input
                                    value={tableModeClassName}
                                    onChange={(event) => {
                                        const value = event.target.value;
                                        const existingStyles = [...props.row.style || []];
                                        const index = existingStyles.findIndex(st => st.key === 'tableModeClassName');
                                        if (value === '') {
                                            if (index > -1) {
                                                existingStyles.splice(index, 1);
                                            }
                                        } else {
                                            if (index > -1) {
                                                existingStyles[index] = { key: 'tableModeClassName', value };
                                            } else {
                                                existingStyles.push({ key: 'tableModeClassName', value });
                                            }
                                        }

                                        props.onChange({
                                            ...props.row,
                                            style: existingStyles
                                        })
                                    }}
                                />
                            </div>

                        </TabWrapper>
                    }
                ]}
            />

        </div>
    </SortableItem>
}

const RowsEditor = (props: {
    rows: ItemComponent[],
    onChange: (newRows: ItemComponent[]) => void
}) => {
    const [draggedId, setDraggedId] = React.useState<string | null>(null);

    const draggedItem = props.rows.find(row => row.key === draggedId);


    return <div>
        <p className='font-semibold'>
            Rows ({props.rows.length})
        </p>
        <p className='text-sm text-muted-foreground'>
            (drag to reorder)
        </p>

        <SortableWrapper
            sortableID={`rows-for-rsca`}
            items={props.rows.map((option, index) => {
                return {
                    id: option.key || index.toString(),
                }
            })}
            onDraggedIdChange={(id) => {
                setDraggedId(id);
            }}
            onReorder={(activeIndex, overIndex) => {
                const newItems = [...props.rows];
                newItems.splice(activeIndex, 1);
                newItems.splice(overIndex, 0, props.rows[activeIndex]);
                props.onChange(newItems);

            }}
            dragOverlayItem={(draggedId && draggedItem) ?
                <RowEditor
                    row={draggedItem}
                    onChange={() => { }}
                    onDelete={() => { }}
                />
                : null}
        >

            <ol className='px-1 space-y-2 py-4'>
                {props.rows.length === 0 && <p className='text-sm text-primary'>
                    No rows defined.
                </p>}
                {props.rows.map((row, index) => {
                    return <RowEditor
                        key={row.key || index}
                        row={row}
                        existingKeys={props.rows.map(o => o.key || index.toString())}
                        onChange={(newRow) => {
                            const newOptions = props.rows.map((o) => {
                                if (o.key === row.key) {
                                    return newRow;
                                }
                                return o;
                            });
                            props.onChange(newOptions);
                        }}
                        onDelete={() => {
                            const newOptions = props.rows.filter((o) => {
                                return o.key !== row.key;
                            });
                            props.onChange(newOptions);
                        }}
                    />
                })}
            </ol>
        </SortableWrapper>



        <AddDropdown
            options={[
                { key: 'row', label: 'New row', icon: <Rows className='size-4 text-neutral-500 me-2' /> },
            ]}
            onAddItem={(type) => {
                if (type === 'row') {
                    const newRow: ItemComponent = {
                        key: Math.random().toString(36).substring(9),
                        role: 'row',
                    }
                    props.onChange([...props.rows, newRow]);
                }
            }}
        />
    </div>
}

const Rsca: React.FC<RscaProps> = (props) => {
    const { selectedLanguage } = useContext(SurveyContext);

    const rgIndex = props.surveyItem.components?.items.findIndex(comp => comp.role === 'responseGroup');
    if (rgIndex === undefined || rgIndex === -1) {
        return <p>Response group not found</p>;
    }
    const rg = props.surveyItem.components?.items[rgIndex] as ItemGroupComponent;
    if (!rg || !rg.items) {
        return <p>Response group not found</p>;
    }

    const rscaGroupIndex = rg.items.findIndex(comp => comp.role === 'responsiveSingleChoiceArray');
    if (rscaGroupIndex === undefined || rscaGroupIndex === -1) {
        return <p>Responsive single choice array not found</p>;
    }
    const rscaGroup = rg.items[rscaGroupIndex] as ItemGroupComponent;
    if (!rscaGroup || !rscaGroup.items) {
        return <p>Single choice group not found</p>;
    }

    const styles = rscaGroup.style || [];

    const defaultMode = styles?.find(st => st.key === 'defaultMode')?.value;
    const smMode = styles?.find(st => st.key === 'smMode')?.value;
    const mdMode = styles?.find(st => st.key === 'mdMode')?.value;
    const lgMode = styles?.find(st => st.key === 'lgMode')?.value;
    const xlMode = styles?.find(st => st.key === 'xlMode')?.value;

    const useVerticalModeReverseOrder = styles?.find(st => st.key === 'verticalModeReverseOrder')?.value === 'true';

    const options = (rscaGroup.items.find(comp => comp.role === 'options') as ItemGroupComponent)?.items || [];
    const rows = (rscaGroup.items.filter(comp => comp.role === 'row') as ItemGroupComponent[]) || [];
    const errorHintComp = rscaGroup.items.find(comp => comp.role === 'rowErrorHint');

    const onChangeRSCA = (newRSCA: ItemGroupComponent) => {
        const existingItems = props.surveyItem.components?.items || [];
        (existingItems[rgIndex] as ItemGroupComponent).items[rscaGroupIndex] = newRSCA;
        props.onUpdateSurveyItem({
            ...props.surveyItem,
            components: {
                role: props.surveyItem.components!.role,
                ...props.surveyItem.components,
                items: existingItems,
            }
        });
    };

    const onModeChange = (size: string, mode: string) => {
        const existingStyles = [...styles];
        const modeKey = `${size}Mode`;

        const index = existingStyles.findIndex(st => st.key === modeKey);
        if (index > -1) {
            existingStyles[index] = { key: modeKey, value: mode };
        } else {
            existingStyles.push({ key: modeKey, value: mode });
        }

        rscaGroup.style = existingStyles;
        onChangeRSCA(rscaGroup);
    }

    return (
        <div className='space-y-4'>
            <OptionsEditor
                options={options}
                onChange={(newOptions) => {
                    const optionsIndex = rscaGroup.items.findIndex(comp => comp.role === 'options');
                    if (optionsIndex === -1) {
                        rscaGroup.items.push({
                            role: 'options',
                            items: newOptions
                        });
                    } else {
                        rscaGroup.items[optionsIndex] = {
                            role: 'options',
                            items: newOptions
                        };
                    }
                    onChangeRSCA(rscaGroup);
                }}
            />

            <RowsEditor
                rows={rows}
                onChange={(r) => {
                    const newRows = rscaGroup.items.filter(comp => comp.role !== 'row');
                    newRows.push(...r);
                    rscaGroup.items = newRows;
                    onChangeRSCA(rscaGroup);
                }}
            />

            <div className='space-y-2'>
                <p className='font-semibold'>
                    Render mode for screen sizes:
                </p>
                <ModeSelector
                    size='default'
                    mode={defaultMode}
                    onChange={onModeChange}
                />

                <ModeSelector
                    size='sm'
                    mode={smMode}
                    onChange={onModeChange}
                />

                <ModeSelector
                    size='md'
                    mode={mdMode}
                    onChange={onModeChange}
                />

                <ModeSelector
                    size='lg'
                    mode={lgMode}
                    onChange={onModeChange}
                />

                <ModeSelector
                    size='xl'
                    mode={xlMode}
                    onChange={onModeChange}
                />
            </div>

            <div className='space-y-2'>
                <p className='font-semibold'>
                    Reverse option order in vertical mode:
                </p>

                <Label
                    className='flex items-center gap-2'
                    htmlFor='vertical-mode-reverse-order'
                >
                    <Switch
                        id='vertical-mode-reverse-order'
                        checked={useVerticalModeReverseOrder}
                        onCheckedChange={(checked) => {
                            let existingStyles = [...styles];

                            const verticalModeReverseOrderKey = 'verticalModeReverseOrder';

                            if (checked) {
                                const index = existingStyles.findIndex(st => st.key === verticalModeReverseOrderKey);

                                if (index > -1) {
                                    existingStyles[index] = { key: verticalModeReverseOrderKey, value: 'true' };
                                } else {
                                    existingStyles.push({ key: verticalModeReverseOrderKey, value: 'true' });
                                }
                            } else {
                                existingStyles = existingStyles.filter(st => st.key !== verticalModeReverseOrderKey);
                            }

                            rscaGroup.style = existingStyles;
                            onChangeRSCA(rscaGroup);
                        }}
                    />

                    <span>
                        {useVerticalModeReverseOrder ? 'Yes' : 'No'}
                    </span>
                </Label>

            </div>

            <div className='space-y-2'>

                <Label
                    htmlFor='row-error-hint'
                    className='space-y-1.5'
                >
                    <span className='font-semibold text-base'>
                        Error message if row is empty:
                    </span>

                    <Input
                        id='row-error-hint'
                        className='w-full'
                        value={errorHintComp ? localisedObjectToMap(errorHintComp.content).get(selectedLanguage) || '' : ''}
                        onChange={(e) => {
                            const updatedComponent = errorHintComp ? { ...errorHintComp } : {
                                key: Math.random().toString(36).substring(9),
                                role: 'rowErrorHint',
                            };
                            const updatedContent = localisedObjectToMap(updatedComponent.content);
                            updatedContent.set(selectedLanguage, e.target.value);
                            updatedComponent.content = generateLocStrings(updatedContent);


                            const index = rscaGroup.items.findIndex(comp => comp.role === 'rowErrorHint');
                            if (index === -1) {
                                rscaGroup.items.push(updatedComponent);
                            } else {
                                rscaGroup.items[index] = updatedComponent;
                            }
                            onChangeRSCA(rscaGroup);
                        }}
                        placeholder='Enter error message...'
                    />
                </Label>

            </div>
        </div>
    );
};

export default Rsca;
