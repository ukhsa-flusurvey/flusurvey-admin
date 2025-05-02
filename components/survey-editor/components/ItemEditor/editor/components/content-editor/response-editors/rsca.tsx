import SortableItem from '@/components/survey-editor/components/general/SortableItem';
import SortableWrapper from '@/components/survey-editor/components/general/SortableWrapper';
import AddDropdown from '@/components/survey-editor/components/general/add-dropdown';
import TabCard from '@/components/survey-editor/components/general/tab-card';
import { localisedObjectToMap } from '@/components/survey-editor/utils/localeUtils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { generateLocStrings } from 'case-editor-tools/surveys/utils/simple-generators';
import { Circle, Cog, GripVertical, Languages, Rows, ToggleLeft, Trash2 } from 'lucide-react';
import React from 'react';
import { ItemComponent, ItemGroupComponent, SurveySingleItem } from 'survey-engine/data_types';
import { TabWrapper } from "@/components/survey-editor/components/ItemEditor/editor/components/TabWrapper";
import { Separator } from '@/components/ui/separator';
import { useSurveyEditorCtx } from '@/components/survey-editor/surveyEditorContext';
import { PopoverKeyBadge } from '../../KeyBadge';
import { ItemComponentRole } from '@/components/survey-editor/components/types';
import { SimpleTextViewContentEditor } from './text-view-content-editor';
import { StyleClassNameEditor } from './style-class-name-editor';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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

const OptionEditor = (props: {
    option: ItemComponent;
    existingKeys?: string[];
    onChange: (newOption: ItemComponent) => void;
    onDelete: () => void;
    isBeingDragged?: boolean;
    hideLabel?: boolean;
}) => {
    return <SortableItem
        id={props.option.key!}
        className={props.isBeingDragged ? 'opacity-0' : ''}
    >
        <div className='border border-border rounded-md p-2 relative bg-white'>
            <div className='flex items-center gap-2 w-full'>
                <GripVertical className='size-4' />
                <div className='flex items-center basis-1/4'>
                    <PopoverKeyBadge
                        headerText='Option Key'
                        allOtherKeys={props.existingKeys?.filter(k => k !== props.option.key) ?? []}
                        isHighlighted={true}
                        itemKey={props.option.key ?? ''}
                        onKeyChange={(newKey) => {
                            props.onChange({
                                ...props.option,
                                key: newKey
                            })
                        }} />
                </div>
                {!props.hideLabel && <div className='grow'>
                    <SimpleTextViewContentEditor
                        component={props.option}
                        onChange={(updatedComponent) => props.onChange(updatedComponent)}
                        hideLabel={true}
                        placeholder='Enter option label...'
                    />
                </div>}
                {props.hideLabel && <div className='grow' />}
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

export const OptionsEditor = (props: {
    options: ItemComponent[],
    hideLabel?: boolean,
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
                    hideLabel={props.hideLabel}
                />
                : null}
        >

            <ol className='px-1 space-y-2 py-2'>
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
                        isBeingDragged={draggedId === option.key}
                        hideLabel={props.hideLabel}
                    />
                })}
            </ol>
        </SortableWrapper>

        <div className='w-full flex items-center justify-center'>
            <AddDropdown
                options={[
                    { key: ItemComponentRole.Option, label: 'Option', icon: <Circle className='size-4 text-neutral-500 me-2' /> },
                ]}
                onAddItem={(type) => {
                    if (type === ItemComponentRole.Option) {
                        const newOption: ItemComponent = {
                            key: Math.random().toString(36).substring(9),
                            role: ItemComponentRole.Option,
                        }
                        props.onChange([...props.options, newOption]);
                    }
                }}
            />
        </div>
    </div>
}

enum RscaStyleKeys {
    horizontalModeLabelPlacement = 'horizontalModeLabelPlacement',
    horizontalModeClassName = 'horizontalModeClassName',
    verticalModeClassName = 'verticalModeClassName',
    tableModeClassName = 'tableModeClassName',
    verticalModeReverseOrder = 'verticalModeReverseOrder',
}


const RowEditor = (props: {
    row: ItemComponent;
    existingKeys?: string[];
    onChange: (newRow: ItemComponent) => void;
    onDelete: () => void;
    isBeingDragged?: boolean;
}) => {
    const horizontalModeLabelPlacement = props.row.style?.find(s => s.key === RscaStyleKeys.horizontalModeLabelPlacement)?.value || 'bottom';

    const onRowStyleChange = (key: string, newValue: string | undefined) => {
        const existingStyles = [...props.row.style || []];
        const index = existingStyles.findIndex(st => st.key === key);
        if (newValue) {
            if (index > -1) {
                existingStyles[index] = { key, value: newValue };
            } else {
                existingStyles.push({ key, value: newValue });
            }
        } else {
            if (index > -1) {
                existingStyles.splice(index, 1);
            }
        }
        props.onChange({ ...props.row, style: existingStyles });
    }

    return <SortableItem
        id={props.row.key!}
        className={props.isBeingDragged ? 'opacity-0' : ''}
    >
        <div className='relative'>
            <div className='absolute left-0 top-1/2 pt-1 pl-2'>
                <GripVertical className='size-4' />
            </div>
            <TabCard
                tabs={[
                    {
                        label: 'General',
                        icon: <Languages className='me-1 size-3 text-muted-foreground' />,
                        content: <TabWrapper>
                            <div className='flex items-center gap-2 w-full'>
                                <div className='flex items-center basis-1/4 pl-2'>
                                    <PopoverKeyBadge
                                        headerText='Row Key'
                                        allOtherKeys={props.existingKeys?.filter(k => k !== props.row.key) ?? []}
                                        isHighlighted={true}
                                        itemKey={props.row.key ?? ''}
                                        onKeyChange={(newKey) => {
                                            props.onChange({
                                                ...props.row,
                                                key: newKey
                                            })
                                        }} />
                                </div>

                                <div className='grow'>
                                    <SimpleTextViewContentEditor
                                        component={props.row}
                                        onChange={(updatedComponent) => props.onChange(updatedComponent)}
                                        hideLabel={true}
                                        placeholder='Enter row label...'
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
                            <div className='flex items-center gap-2'>
                                <Label className='text-xs w-1/3'>Horizontal Mode Label Placement</Label>
                                <Select
                                    value={horizontalModeLabelPlacement}

                                    onValueChange={(value) => {
                                        const existingStyles = [...props.row.style || []];
                                        const index = existingStyles.findIndex(st => st.key === RscaStyleKeys.horizontalModeLabelPlacement);
                                        if (value === 'bottom') {
                                            if (index > -1) {
                                                existingStyles.splice(index, 1);
                                            }
                                        } else {
                                            if (index > -1) {
                                                existingStyles[index] = { key: RscaStyleKeys.horizontalModeLabelPlacement, value };
                                            } else {
                                                existingStyles.push({ key: RscaStyleKeys.horizontalModeLabelPlacement, value });
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
                            <Separator />
                            <StyleClassNameEditor
                                styles={props.row.style || []}
                                styleKey={RscaStyleKeys.horizontalModeClassName}
                                label={"Horizontal Mode Class Name"}
                                onChange={onRowStyleChange} />
                            <Separator />
                            <StyleClassNameEditor
                                styles={props.row.style || []}
                                styleKey={RscaStyleKeys.verticalModeClassName}
                                label={"Vertical Mode Class Name"}
                                onChange={onRowStyleChange} />
                            <Separator />
                            <StyleClassNameEditor
                                styles={props.row.style || []}
                                styleKey={RscaStyleKeys.tableModeClassName}
                                label={"Table Mode Class Name"}
                                onChange={onRowStyleChange} />

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

            <ol className='px-1 space-y-2 py-2'>
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
                        isBeingDragged={draggedId === row.key}
                    />
                })}
            </ol>
        </SortableWrapper>



        <div className='w-full flex items-center justify-center'>
            <AddDropdown
                options={[
                    { key: ItemComponentRole.Row, label: 'Row', icon: <Rows className='size-4 text-neutral-500 me-2' /> },
                ]}
                onAddItem={(type) => {
                    if (type === ItemComponentRole.Row) {
                        const newRow: ItemComponent = {
                            key: Math.random().toString(36).substring(9),
                            role: ItemComponentRole.Row,
                        }
                        props.onChange([...props.rows, newRow]);
                    }
                }}
            />
        </div>
    </div>
}

const Rsca: React.FC<RscaProps> = (props) => {
    const { selectedLanguage } = useSurveyEditorCtx();

    const rgIndex = props.surveyItem.components?.items.findIndex(comp => comp.role === ItemComponentRole.ResponseGroup);
    if (rgIndex === undefined || rgIndex === -1) {
        return <p>Response group not found</p>;
    }
    const rg = props.surveyItem.components?.items[rgIndex] as ItemGroupComponent;
    if (!rg || !rg.items) {
        return <p>Response group not found</p>;
    }

    const rscaGroupIndex = rg.items.findIndex(comp => comp.role === ItemComponentRole.ResponsiveSingleChoiceArray);
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

    const useVerticalModeReverseOrder = styles?.find(st => st.key === RscaStyleKeys.verticalModeReverseOrder)?.value === 'true';

    const options = (rscaGroup.items.find(comp => comp.role === ItemComponentRole.Options) as ItemGroupComponent)?.items || [];
    const rows = (rscaGroup.items.filter(comp => comp.role === ItemComponentRole.Row) as ItemGroupComponent[]) || [];
    const errorHintComp = rscaGroup.items.find(comp => comp.role === ItemComponentRole.RowErrorHint) as ItemComponent;

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

    const triggerClassName = "text-sm data-[state=active]:bg-white data-[state=active]:font-bold data-[state=active]:border data-[state=active]:border-slate-200 data-[state=active]:text-accent-foreground data-[state=active]:[box-shadow:none]";

    return (
        <div className='space-y-4'>
            <Tabs defaultValue="options-rows" className="mt-2">
                <div className="flex flex-row justify-between items-center">
                    <p className='font-semibold'>Responsive Single Choice Array</p>
                    <TabsList className="bg-muted p-0.5 rounded-md border border-neutral-200 gap-1">
                        <TabsTrigger className={triggerClassName} value="options-rows">Options & Rows</TabsTrigger>
                        <TabsTrigger className={triggerClassName} value="extras">Extras</TabsTrigger>
                        {/* Use Badge here to indicate if there are any conditions */}
                    </TabsList>
                </div>
                <TabsContent value="options-rows">
                    <OptionsEditor
                        options={options}
                        onChange={(newOptions) => {
                            const optionsIndex = rscaGroup.items.findIndex(comp => comp.role === ItemComponentRole.Options);
                            if (optionsIndex === -1) {
                                rscaGroup.items.push({
                                    role: ItemComponentRole.Options,
                                    items: newOptions
                                });
                            } else {
                                rscaGroup.items[optionsIndex] = {
                                    role: ItemComponentRole.Options,
                                    items: newOptions
                                };
                            }
                            onChangeRSCA(rscaGroup);
                        }}
                    />
                    <RowsEditor
                        rows={rows}
                        onChange={(r) => {
                            const newRows = rscaGroup.items.filter(comp => comp.role !== ItemComponentRole.Row);
                            newRows.push(...r);
                            rscaGroup.items = newRows;
                            onChangeRSCA(rscaGroup);
                        }}
                    />
                </TabsContent>
                <TabsContent value="extras" className='space-y-4'>
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

                                    const verticalModeReverseOrderKey = RscaStyleKeys.verticalModeReverseOrder;

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
                                        role: ItemComponentRole.RowErrorHint,
                                    };
                                    const updatedContent = localisedObjectToMap(updatedComponent.content);
                                    updatedContent.set(selectedLanguage, e.target.value);
                                    updatedComponent.content = generateLocStrings(updatedContent);


                                    const index = rscaGroup.items.findIndex(comp => comp.role === ItemComponentRole.RowErrorHint);
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
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default Rsca;
