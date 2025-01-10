import SortableItem from "@/components/survey-editor/components/general/SortableItem";
import SortableWrapper from "@/components/survey-editor/components/general/SortableWrapper";
import AddDropdown from "@/components/survey-editor/components/general/add-dropdown";
import TabCard from "@/components/survey-editor/components/general/tab-card";
import { ItemComponentRole } from "@/components/survey-editor/components/types";
import { SurveyContext } from "@/components/survey-editor/surveyContext";
import { localisedObjectToMap } from "@/components/survey-editor/utils/localeUtils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { getLocalizedString } from "@/utils/localizedStrings";
import { ResponsiveBipolarLikertArrayVariant } from "case-editor-tools/surveys/types";
import { generateLocStrings } from "case-editor-tools/surveys/utils/simple-generators";
import { Check, Circle, Cog, GripHorizontal, GripVertical, Languages, Rows, ToggleLeft, Trash2, X } from "lucide-react";
import React from "react";
import { useContext } from "react";
import { ItemComponent, ItemGroupComponent, SurveySingleItem } from "survey-engine/data_types";

// TODO: Expected name would collide with existing def. Should be ...EditorProps to avoid conflicts, but wouldn't be consistent with others atm.
interface RblsaProps {
    surveyItem: SurveySingleItem;
    onUpdateSurveyItem: (item: SurveySingleItem) => void;
}

export const TabWrapper = (props: { children: React.ReactNode }) => {
    return (
        <div className='p-4 ps-6 space-y-4 overflow-y-auto'>
            {props.children}
        </div>
    )
}

const StyleClassNameEditor = (props: {
    styles: { key: string, value: string }[],
    styleKey: string,
    label: string,
    onChange: (key: string, value: string | undefined) => void
}) => {
    return <div className="flex items-center gap-2">
        <Label htmlFor={'input-' + props.styleKey} className="text-xs">
            {props.label}
        </Label>
        <Input
            id={'input-' + props.styleKey}
            value={props.styles?.find(st => st.key === props.styleKey)?.value ?? ""}
            onChange={(e) => { props.onChange(props.styleKey, e.target.value) }}
        />
    </div>
}

const ModeSelector = (props: {
    size: string,
    mode?: ResponsiveBipolarLikertArrayVariant | undefined,
    onChange: (size: string, mode: ResponsiveBipolarLikertArrayVariant | undefined) => void
}) => {
    return <div className='flex items-center gap-2'>
        <p className='w-20 font-semibold text-sm'>{props.size}</p>
        <Select value={props.mode || ''}
            onValueChange={(value) => {
                props.onChange(props.size, value == 'default' ? undefined : value as ResponsiveBipolarLikertArrayVariant);
            }}
        >
            <SelectTrigger>
                <SelectValue placeholder="Select a render mode..." />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value='default'>Default</SelectItem>
                <SelectItem value='withLabelRow'>With Label Row</SelectItem>
                <SelectItem value='vertical'>Vertical</SelectItem>
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
            id={'item-key-' + props.currentKey}
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

        <div className="flex justify-center w-full">
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
    </div>
}

const RowEditor = (props: {
    row: ItemGroupComponent;
    existingKeys?: string[];
    onChange: (newRow: ItemGroupComponent) => void;
    onDelete: () => void;
}) => {
    const { selectedLanguage } = useContext(SurveyContext);
    const rowStartLabelItem = props.row.items.find(comp => comp.role == ItemComponentRole.StartLabel);
    const rowStartLabel = localisedObjectToMap(rowStartLabelItem?.content).get(selectedLanguage) || ''
    const rowEndLabelItem = props.row.items.find(comp => comp.role == ItemComponentRole.EndLabel);
    const rowEndLabel = localisedObjectToMap(rowEndLabelItem?.content).get(selectedLanguage) || ''

    const tableModeClassName = props.row.style?.find(st => st.key === 'tableModeClassName')?.value || '';
    const withLabelRowModeClassName = props.row.style?.find(st => st.key === 'withLabelRowModeClassName')?.value || '';
    const verticalModeClassName = props.row.style?.find(st => st.key === 'verticalModeClassName')?.value


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
                            <div className='flex justify-between gap-2 items-center space-y-4'>
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
                                className='flex gap-2 items-center'
                            >
                                <Label className="min-w-[100px]" htmlFor={`row-startlabel-${props.row.key}`}>
                                    Start Label
                                </Label>
                                <Input
                                    id={`row-startlabel-${props.row.key}`}
                                    className='w-full'
                                    value={rowStartLabel || ''}
                                    placeholder='Enter row start label...'
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        const rowStartLabelItem = props.row.items.find(comp => comp.role == ItemComponentRole.StartLabel);
                                        const newStartLabelItem = { ...rowStartLabelItem, content: generateLocStrings(localisedObjectToMap(rowStartLabelItem?.content).set(selectedLanguage, value)) };
                                        const updatedComponent = { ...props.row, items: props.row.items.map(comp => comp.role == ItemComponentRole.StartLabel ? newStartLabelItem : comp) } as ItemGroupComponent;
                                        props.onChange(updatedComponent);
                                    }}
                                />
                            </div>
                            <div
                                data-no-dnd="true"
                                className='flex gap-2 items-center'
                            >
                                <Label className="min-w-[100px]" htmlFor={`row-endlabel-${props.row.key}`}>
                                    End Label
                                </Label>
                                <Input
                                    id={`row-endlabel-${props.row.key}`}
                                    className='w-full'
                                    value={rowEndLabel || ''}
                                    placeholder='Enter row end label...'
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        const rowEndLabelItem = props.row.items.find(comp => comp.role == ItemComponentRole.EndLabel);
                                        const newEndLabelItem = { ...rowEndLabelItem, content: generateLocStrings(localisedObjectToMap(rowEndLabelItem?.content).set(selectedLanguage, value)) };
                                        const updatedComponent = { ...props.row, items: props.row.items.map(comp => comp.role == ItemComponentRole.EndLabel ? newEndLabelItem : comp) } as ItemGroupComponent;
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
                                <p className='font-semibold text-sm mb-1.5'>tableModeClassName:</p>
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
                            <Separator />
                            <div>
                                <p className='font-semibold text-sm mb-1.5'>withLabelRowModeClassName:</p>
                                <Input
                                    value={withLabelRowModeClassName}
                                    onChange={(event) => {
                                        const value = event.target.value;
                                        const existingStyles = [...props.row.style || []];
                                        const index = existingStyles.findIndex(st => st.key === 'withLabelRowModeClassName');
                                        if (value === '') {
                                            if (index > -1) {
                                                existingStyles.splice(index, 1);
                                            }
                                        } else {
                                            if (index > -1) {
                                                existingStyles[index] = { key: 'withLabelRowModeClassName', value };
                                            } else {
                                                existingStyles.push({ key: 'withLabelRowModeClassName', value });
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
                                <p className='font-semibold text-sm mb-1.5'>verticalModeClassName:</p>
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
                        </TabWrapper>
                    }
                ]}
            />

        </div>
    </SortableItem>
}

const RowsEditor = (props: {
    rows: ItemGroupComponent[],
    onChange: (newRows: ItemGroupComponent[]) => void
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


        <div className="flex justify-center w-full">
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
                        props.onChange([...props.rows as ItemGroupComponent[], newRow as ItemGroupComponent]);
                    }
                }}
            />
        </div>
    </div>
}

const Rblsa: React.FC<RblsaProps> = (props) => {
    const { selectedLanguage } = useContext(SurveyContext);

    const rgIndex = props.surveyItem.components?.items.findIndex(comp => comp.role === ItemComponentRole.ResponseGroup);
    if (rgIndex === undefined || rgIndex === -1) {
        return <p>Response group not found</p>;
    }
    const rg = props.surveyItem.components?.items[rgIndex] as ItemGroupComponent;
    if (!rg || !rg.items) {
        return <p>Response group not found</p>;
    }

    const rblsaGroupIndex = rg.items.findIndex(comp => comp.role === ItemComponentRole.ResponsiveBipolarLikertScaleArray);
    if (rblsaGroupIndex === undefined || rblsaGroupIndex === -1) {
        return <p>Responsive bipolar likert scale array not found</p>;
    }
    const rblsaGroup = rg.items[rblsaGroupIndex] as ItemGroupComponent;
    if (!rblsaGroup || !rblsaGroup.items) {
        return <p>Responsive bipolar likert scale array group not found or has no items</p>;
    }

    const styles = rblsaGroup.style || [];

    console.log('rblsaGroup', rblsaGroup);

    const defaultMode = styles?.find(st => st.key === 'defaultMode')?.value as ResponsiveBipolarLikertArrayVariant | undefined;
    const smMode = styles?.find(st => st.key === 'smMode')?.value as ResponsiveBipolarLikertArrayVariant | undefined;
    const mdMode = styles?.find(st => st.key === 'mdMode')?.value as ResponsiveBipolarLikertArrayVariant | undefined;
    const lgMode = styles?.find(st => st.key === 'lgMode')?.value as ResponsiveBipolarLikertArrayVariant | undefined;
    const xlMode = styles?.find(st => st.key === 'xlMode')?.value as ResponsiveBipolarLikertArrayVariant | undefined;

    const options = (rblsaGroup.items.find(comp => comp.role === ItemComponentRole.Options) as ItemGroupComponent)?.items || [];
    const rows = (rblsaGroup.items.filter(comp => comp.role === ItemComponentRole.Row) as ItemGroupComponent[]) || [];

    const onChangeRBLSA = (newRBLSA: ItemGroupComponent) => {
        const existingItems = props.surveyItem.components?.items || [];
        (existingItems[rgIndex] as ItemGroupComponent).items[rblsaGroupIndex] = newRBLSA;
        props.onUpdateSurveyItem({
            ...props.surveyItem,
            components: {
                role: props.surveyItem.components!.role,
                ...props.surveyItem.components,
                items: existingItems,
            }
        });
    };

    const onModeChange = (size: string, mode: ResponsiveBipolarLikertArrayVariant | undefined) => {
        const existingStyles = [...styles];
        const modeKey = `${size}Mode`;

        if (mode) {
            const index = existingStyles.findIndex(st => st.key === modeKey);
            if (index > -1) {
                existingStyles[index] = { key: modeKey, value: mode ?? '' };
            } else {
                existingStyles.push({ key: modeKey, value: mode });
            }
        } else {
            const index = existingStyles.findIndex(st => st.key === modeKey);
            if (index > -1) {
                existingStyles.splice(index, 1);
            }
        }

        rblsaGroup.style = existingStyles;
        onChangeRBLSA(rblsaGroup);
    }

    const onStyleChange = (key: string, value: string | undefined) => {
        if (!key) {
            return;
        }
        const existingStyles = [...styles];
        const index = existingStyles.findIndex(st => st.key === key);
        if (value) {
            if (index > -1) {
                existingStyles[index] = { key, value };
            } else {
                existingStyles.push({ key, value });
            }
        } else {
            if (index > -1) {
                existingStyles.splice(index, 1);
            }
        }

        rblsaGroup.style = existingStyles;
        onChangeRBLSA(rblsaGroup);
    }

    return (
        <div className="space-y-4">
            <OptionsEditor
                options={options}
                onChange={(newOptions) => {
                    const optionsIndex = rblsaGroup.items.findIndex(comp => comp.role === ItemComponentRole.Options);
                    if (optionsIndex === -1) {
                        rblsaGroup.items.push({
                            role: ItemComponentRole.Options,
                            items: newOptions
                        });
                    } else {
                        rblsaGroup.items[optionsIndex] = {
                            role: ItemComponentRole.Options,
                            items: newOptions
                        };
                    }
                    onChangeRBLSA(rblsaGroup);
                }}
            />
            <RowsEditor
                rows={rows}
                onChange={(r) => {
                    const newRows = rblsaGroup.items.filter(comp => comp.role !== ItemComponentRole.Row);
                    newRows.push(...r);
                    rblsaGroup.items = newRows;
                    onChangeRBLSA(rblsaGroup);
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
                    Styling attributes:
                </p>
                <StyleClassNameEditor
                    styles={styles}
                    styleKey="labelRowPosition"
                    label="labelRowPosition"
                    onChange={(key, newValue) => onStyleChange(key, newValue)} />
                <StyleClassNameEditor
                    styles={styles}
                    styleKey="labelRowMaxLabelWidth"
                    label="labelRowMaxLabelWidth"
                    onChange={(key, newValue) => onStyleChange(key, newValue)} />
                <StyleClassNameEditor
                    styles={styles}
                    styleKey="tableModeLayout"
                    label="tableModeLayout"
                    onChange={(key, newValue) => onStyleChange(key, newValue)} />
                <StyleClassNameEditor
                    styles={styles}
                    styleKey="tableModeLabelColWidth"
                    label="tableModeLabelColWidth"
                    onChange={(key, newValue) => onStyleChange(key, newValue)} />
                <StyleClassNameEditor
                    styles={styles}
                    styleKey="tableModeClassName"
                    label="tableModeClassName"
                    onChange={(key, newValue) => onStyleChange(key, newValue)} />
            </div>
        </div>

    );
};

export default Rblsa;
