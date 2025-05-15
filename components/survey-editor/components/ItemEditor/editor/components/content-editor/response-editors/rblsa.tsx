import SortableItem from "@/components/survey-editor/components/general/SortableItem";
import SortableWrapper from "@/components/survey-editor/components/general/SortableWrapper";
import AddDropdown from "@/components/survey-editor/components/general/add-dropdown";
import TabCard from "@/components/survey-editor/components/general/tab-card";
import { ItemComponentRole } from "@/components/survey-editor/components/types";
import { localisedObjectToMap } from "@/components/survey-editor/utils/localeUtils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ResponsiveBipolarLikertArrayVariant } from "case-editor-tools/surveys/types";
import { generateLocStrings } from "case-editor-tools/surveys/utils/simple-generators";
import { Cog, GripVertical, Languages, Rows, ToggleLeft, Trash2 } from "lucide-react";
import { ItemGroupComponent, SurveySingleItem } from "survey-engine/data_types";
import { TabWrapper } from "@/components/survey-editor/components/ItemEditor/editor/components/TabWrapper";
import { useSurveyEditorCtx } from "@/components/survey-editor/surveyEditorContext";
import { PopoverKeyBadge } from "../../KeyBadge";
import { StyleClassNameEditor } from "./style-class-name-editor";
import { OptionsEditor } from "./rsca";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React from "react";

// TODO: Expected name would collide with existing def. Should be ...EditorProps to avoid conflicts, but wouldn't be consistent with others atm.
interface RblsaProps {
    surveyItem: SurveySingleItem;
    onUpdateSurveyItem: (item: SurveySingleItem) => void;
}

enum RblsaStyleKeys {
    tableModeClassName = 'tableModeClassName',
    labelRowModeClassName = 'withLabelRowModeClassName',
    verticalModeClassName = 'verticalModeClassName',
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

const RowEditor = (props: {
    row: ItemGroupComponent;
    existingKeys?: string[];
    onChange: (newRow: ItemGroupComponent) => void;
    onDelete: () => void;
    isBeingDragged?: boolean;
    preSelectedTab?: string;
    onTabSelect?: (tabLabel: string) => void;
}) => {
    const { selectedLanguage } = useSurveyEditorCtx();
    const rowStartLabelItem = props.row.items.find(comp => comp.role == ItemComponentRole.StartLabel);
    const rowStartLabel = localisedObjectToMap(rowStartLabelItem?.content).get(selectedLanguage) || '';
    const rowEndLabelItem = props.row.items.find(comp => comp.role == ItemComponentRole.EndLabel);
    const rowEndLabel = localisedObjectToMap(rowEndLabelItem?.content).get(selectedLanguage) || '';


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
        className={props.isBeingDragged ? 'invisible' : ''}
    >
        <div className='relative'>
            <div className='absolute left-0 top-1/2'>
                <GripVertical className='size-4' />
            </div>
            <TabCard
                selectedTab={props.preSelectedTab ?? 'General'}
                onTabSelect={(label) => props.onTabSelect?.(label)}
                tabs={[
                    {
                        label: 'General',
                        icon: <Languages className='me-1 size-3 text-muted-foreground' />,
                        content: <TabWrapper>
                            <div className='flex justify-between gap-2 items-center'>
                                <PopoverKeyBadge
                                    headerText="Row Key"
                                    allOtherKeys={props.existingKeys?.filter(k => k !== props.row.key) ?? []}
                                    isHighlighted={true}
                                    itemKey={props.row.key ?? ''}
                                    onKeyChange={(newKey) => {
                                        props.onChange({
                                            ...props.row,
                                            key: newKey
                                        })
                                    }} />
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
                                        const newStartLabelItem = { ...rowStartLabelItem, content: generateLocStrings(localisedObjectToMap(rowStartLabelItem?.content).set(selectedLanguage, value)), role: ItemComponentRole.StartLabel };
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
                        content:
                            <TabWrapper>
                                <StyleClassNameEditor
                                    styles={props.row.style || []}
                                    styleKey={RblsaStyleKeys.tableModeClassName}
                                    label={"Table Mode Class Name"}
                                    onChange={onRowStyleChange} />
                                <Separator />
                                <StyleClassNameEditor
                                    styles={props.row.style || []}
                                    styleKey={RblsaStyleKeys.labelRowModeClassName}
                                    label={"Label Row Mode Class Name"}
                                    onChange={onRowStyleChange} />
                                <Separator />
                                <StyleClassNameEditor
                                    styles={props.row.style || []}
                                    styleKey={RblsaStyleKeys.verticalModeClassName}
                                    label={"Vertical Mode Class Name"}
                                    onChange={onRowStyleChange} />
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
    const [selectedTabsMap, setSelectedTabsMap] = React.useState<Record<string, string>>({});

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
                    preSelectedTab={selectedTabsMap[draggedId]}
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
                        isBeingDragged={draggedId === row.key}
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
                        onTabSelect={(tabLabel) => {
                            const newSelectedTabsMap = { ...selectedTabsMap };
                            newSelectedTabsMap[row.key || index.toString()] = tabLabel;
                            setSelectedTabsMap(newSelectedTabsMap);
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
                        const newRow: ItemGroupComponent = {
                            key: Math.random().toString(36).substring(9),
                            role: 'row',
                            items: [{ role: ItemComponentRole.StartLabel, content: [] }, { role: ItemComponentRole.EndLabel, content: [] }]
                        }
                        props.onChange([...props.rows as ItemGroupComponent[], newRow as ItemGroupComponent]);
                    }
                }}
            />
        </div>
    </div>
}

const Rblsa: React.FC<RblsaProps> = (props) => {
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

    //console.log('rblsaGroup', rblsaGroup);

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

    const triggerClassName = "text-sm data-[state=active]:bg-white data-[state=active]:font-bold data-[state=active]:border data-[state=active]:border-slate-200 data-[state=active]:text-accent-foreground data-[state=active]:[box-shadow:none]";

    return (
        <div className="space-y-4">
            <Tabs defaultValue="options-rows" className="mt-2">
                <div className="flex flex-row justify-end items-center">
                    <TabsList className="bg-muted p-0.5 rounded-md border border-neutral-200 gap-1">
                        <TabsTrigger className={triggerClassName} value="options-rows">Options & Rows</TabsTrigger>
                        <TabsTrigger className={triggerClassName} value="extras">Extras</TabsTrigger>
                        {/* Use Badge here to indicate if there are any conditions */}
                    </TabsList>
                </div>
                <TabsContent value="options-rows">
                    <OptionsEditor
                        options={options}
                        hideLabel={true}
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
                </TabsContent>
            </Tabs>


        </div>

    );
};

export default Rblsa;
