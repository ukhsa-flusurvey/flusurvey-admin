import { ItemComponentRole } from "@/components/survey-editor/components/types";
import { SurveyContext } from "@/components/survey-editor/surveyContext";
import { getLocalizedString } from '@/utils/localizedStrings';
import { getUniqueRandomKey } from "@/components/survey-editor/utils/new-item-init";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Binary, Calendar, Check, CircleHelp, ClipboardIcon, Clock, CopyIcon, MoveIcon, PanelBottomClose, PanelLeftCloseIcon, PanelRightCloseIcon, PanelTopCloseIcon, SquareChevronDown, TextCursorInput, Type, X, XCircle } from "lucide-react";
import { useContext, useEffect } from "react";
import { ItemComponent, ItemGroupComponent, SurveySingleItem } from "survey-engine/data_types";
import TextInputContentConfig from "./text-input-content-config";
import NumberInputContentConfig from "./number-input-content-config";
import DateInputContentConfig from "./date-input-content-config";
import TimeInputContentConfig from "./time-input-content-config";
import DropdownContentConfig from "./dropdown-content-config";
import React from "react";
import { MatrixCellType, MatrixRowType } from "@/components/survey-renderer/SurveySingleItemView/ResponseComponent/InputTypes/Matrix";
import { SimpleTextViewContentEditor } from "./text-view-content-editor";
import { cn } from "@/lib/utils";
import { ContextMenu, ContextMenuContent, ContextMenuSubContent, ContextMenuGroup, ContextMenuItem, ContextMenuSeparator, ContextMenuSub, ContextMenuSubTrigger, ContextMenuTrigger } from "@/components/ui/context-menu";
import { useCopyToClipboard } from "usehooks-ts";


interface MatrixProps {
    surveyItem: SurveySingleItem;
    onUpdateSurveyItem: (item: SurveySingleItem) => void;
}

type MatrixAction = 'add-row-above' | 'add-row-below' | 'add-column-before' | 'add-column-after' | 'delete-row' | 'delete-column' | 'copy' | 'paste' | 'move-right' | 'move-left' | 'move-up' | 'move-down';

const OverviewMatrixCellContent: React.FC<{
    cell: ItemComponent,
    isSelected: boolean,
    hideKey?: boolean,
    highlightKey?: boolean,
    hideIcon?: boolean,
    context: 'header' | 'row' | 'cell',
    onAction: (action: MatrixAction) => void,
}> = ({ cell, isSelected, hideKey, highlightKey, hideIcon, context, onAction }) => {
    const { selectedLanguage } = useContext(SurveyContext);
    const icon = (cell: ItemComponent) => {
        switch (cell.role) {
            case MatrixCellType.Dropdown:
                return <SquareChevronDown size={16} />;
            case MatrixRowType.ResponseRow:
            case MatrixCellType.Text:
                return <Type size={16} />;
            case MatrixCellType.TextInput:
                return <TextCursorInput size={16} />;
            case MatrixCellType.NumberInput:
                return <Binary size={16} />;
            case MatrixCellType.DateInput:
                return <Calendar size={16} />;
            case MatrixCellType.TimeInput:
                return <Clock size={16} />;
            case MatrixCellType.Checkbox:
                return <Check size={16} />;
            default:
                return <CircleHelp size={16} />;
        }
    }
    return (
        <ContextMenu>
            <ContextMenuTrigger>
                <div className={cn(
                    "flex flex-row items-center gap-2 h-5 box-content",
                    'p-2 hover:bg-gray-100 cursor-pointer overflow-ellipsis whitespace-nowrap overflow-hidden',
                    {
                        'bg-secondary ring ring-primary ring-inset': isSelected,
                    }
                )}>
                    {!hideIcon && <span className="text-muted-foreground">{icon(cell)}</span>}
                    {!hideKey && <Badge variant={(isSelected || highlightKey) ? 'default' : 'outline'} className='h-auto border-2 py-0'>{cell.key}</Badge>}
                    <p className="text-sm">{getLocalizedString(cell.content, selectedLanguage)}</p>
                </div>
            </ContextMenuTrigger>
            <ContextMenuContent>
                {context !== 'cell' && <>
                    <ContextMenuSub>
                        <ContextMenuSubTrigger>
                            <span className="text-muted-foreground mr-2" ><MoveIcon size={16} /></span>
                            Move
                        </ContextMenuSubTrigger>
                        <ContextMenuSubContent>
                            {context === 'header' && <>
                                <ContextMenuItem onClick={() => { onAction('move-right') }}>
                                    <span className="text-muted-foreground mr-2" ><ArrowRight size={16} /></span>
                                    Right
                                </ContextMenuItem>
                                <ContextMenuItem onClick={() => { onAction('move-left') }}>
                                    <span className="text-muted-foreground mr-2" ><ArrowLeft size={16} /></span>
                                    Left
                                </ContextMenuItem>
                            </>}
                            {context === 'row' && <>
                                <ContextMenuItem onClick={() => { onAction('move-up') }}>
                                    <span className="text-muted-foreground mr-2" ><ArrowUp size={16} /></span>
                                    Up
                                </ContextMenuItem>
                                <ContextMenuItem onClick={() => { onAction('move-down') }}>
                                    <span className="text-muted-foreground mr-2" ><ArrowDown size={16} /></span>
                                    Down
                                </ContextMenuItem>
                            </>}
                        </ContextMenuSubContent>
                    </ContextMenuSub>
                    <ContextMenuSeparator />
                </>}

                {context === 'header' && <ContextMenuGroup >
                    <ContextMenuItem onClick={() => { onAction('add-column-before') }}>
                        <span className="text-muted-foreground mr-2" ><PanelLeftCloseIcon size={16} /></span>
                        Add column before
                    </ContextMenuItem>
                    <ContextMenuItem onClick={() => { onAction('add-column-after') }}>
                        <span className="text-muted-foreground mr-2" ><PanelRightCloseIcon size={16} /></span>
                        Add column after
                    </ContextMenuItem>
                    <ContextMenuItem onClick={() => { onAction('delete-column') }}>
                        <span className="text-muted-foreground mr-2" ><XCircle size={16} /></span>
                        Delete column
                    </ContextMenuItem>
                    <ContextMenuSeparator />
                </ContextMenuGroup>}

                {context === 'row' && <ContextMenuGroup >
                    <ContextMenuItem onClick={() => { onAction('add-row-above') }}>
                        <span className="text-muted-foreground mr-2" ><PanelTopCloseIcon size={16} /></span>
                        Add row above
                    </ContextMenuItem>
                    <ContextMenuItem onClick={() => { onAction('add-row-below') }}>
                        <span className="text-muted-foreground mr-2" ><PanelBottomClose size={16} /></span>
                        Add row below
                    </ContextMenuItem>
                    <ContextMenuItem onClick={() => { onAction('delete-row') }}>
                        <span className="text-muted-foreground mr-2" ><XCircle size={16} /></span>
                        Delete row
                    </ContextMenuItem>
                    <ContextMenuSeparator />
                </ContextMenuGroup>}


                <ContextMenuGroup>
                    <ContextMenuItem onClick={() => { onAction('copy') }}>
                        <span className="text-muted-foreground mr-2" ><CopyIcon size={16} /></span>
                        Copy content
                    </ContextMenuItem>
                    <ContextMenuItem onClick={() => { onAction('paste') }}>
                        <span className="text-muted-foreground mr-2" ><ClipboardIcon size={16} /></span>
                        Paste
                    </ContextMenuItem>
                </ContextMenuGroup>
            </ContextMenuContent>
        </ContextMenu>
    );
}

interface Selection {
    rowIndex: number;
    colIndex: number;
}

const OverviewTable: React.FC<{
    matrixDef: ItemGroupComponent,
    selectedElement: Selection | undefined,
    headerColKeys: string[],
    onSelectionChange(selection: Selection | undefined): void,
    onAction: (action: MatrixAction, position: Selection) => void,
}> = ({ matrixDef, selectedElement, headerColKeys, onSelectionChange, onAction }) => {

    const responseRows = matrixDef.items.filter(comp => comp.role === MatrixRowType.ResponseRow) as ItemGroupComponent[];
    return (
        <table className="w-full table-fixed">
            <thead>
                <tr>
                    <th className="border-none"></th>
                    {(matrixDef.items.find(comp => comp.role === MatrixRowType.HeaderRow) as ItemGroupComponent).items.map((header, colIndex) => {
                        const isColSelected = selectedElement?.colIndex === colIndex;
                        const isSelected = selectedElement?.rowIndex === -1 && isColSelected;
                        return (
                            <th
                                key={header.key}
                                className={cn(
                                    "p-0 border border-border",
                                    {
                                        'bg-secondary': isColSelected,
                                    })}
                                onClick={() => onSelectionChange({ rowIndex: -1, colIndex })}
                            >
                                <OverviewMatrixCellContent
                                    cell={header}
                                    isSelected={isSelected}
                                    highlightKey={isColSelected}
                                    context="header"
                                    onAction={(action) => { onAction(action, { rowIndex: -1, colIndex }) }}
                                />
                            </th>
                        );
                    })}
                </tr>
            </thead>
            <tbody>
                {responseRows.map((row, rowIndex) => {
                    const isRowSelected = selectedElement?.rowIndex === rowIndex;
                    return <tr key={row.key}
                        className={cn({
                            'bg-secondary': isRowSelected,
                        })}
                    >
                        <th
                            className="p-0 border border-border"
                            onClick={() => onSelectionChange({
                                rowIndex,
                                colIndex: -1
                            })}
                        >
                            <OverviewMatrixCellContent cell={row}
                                isSelected={isRowSelected && selectedElement?.colIndex === -1}
                                highlightKey={isRowSelected}
                                context="row"
                                onAction={(action) => { onAction(action, { rowIndex: rowIndex, colIndex: -1 }) }}
                            />
                        </th>
                        {(row as ItemGroupComponent).items.map((cell, colIndex) => {
                            const isSelected = selectedElement?.rowIndex === rowIndex && selectedElement?.colIndex === colIndex;
                            return (
                                <td key={cell.key}
                                    className="p-0 border border-border bg-white"
                                    onClick={() => onSelectionChange({
                                        rowIndex,
                                        colIndex
                                    })}
                                >
                                    <OverviewMatrixCellContent
                                        cell={cell}
                                        isSelected={isSelected}
                                        hideKey={headerColKeys[colIndex] === cell.key}
                                        context="cell"
                                        onAction={(action) => { onAction(action, { rowIndex: rowIndex, colIndex }) }}
                                    />
                                </td>
                            )
                        })}
                    </tr>
                })}
            </tbody>
        </table>
    );
}


const CellEditor: React.FC<{ selectedElement: ItemComponent, onChange(key: string, item: ItemComponent): void }> = ({ selectedElement, onChange }) => {
    switch (selectedElement.role) {
        case MatrixCellType.Dropdown:
            return <DropdownContentConfig component={selectedElement} onChange={(n) => onChange(selectedElement.key!, n)} />
        case MatrixRowType.ResponseRow:
        case MatrixCellType.Checkbox:
        case MatrixCellType.Text:
            return <SimpleTextViewContentEditor component={selectedElement} onChange={(newComp) => { onChange(selectedElement.key!, newComp); }} hideStyling={true} />;
        case MatrixCellType.TextInput:
            return <TextInputContentConfig component={selectedElement} onChange={(n) => onChange(selectedElement.key!, n)} allowMultipleLines={false} />
        case MatrixCellType.NumberInput:
            return <NumberInputContentConfig component={selectedElement} onChange={(n) => onChange(selectedElement.key!, n)} />
        case MatrixCellType.DateInput:
            return <DateInputContentConfig component={selectedElement} onChange={(n) => onChange(selectedElement.key!, n)} />
        case MatrixCellType.TimeInput:
            return <TimeInputContentConfig component={selectedElement} onChange={(n) => onChange(selectedElement.key!, n)} />
        default:
            return null;
    }
}

const KeyEditor = (props: {
    currentKey: string;
    existingKeys?: string[];
    onChange: (newKey: string) => void;
}) => {
    const [editedKey, setEditedKey] = React.useState<string>(props.currentKey);

    // Ensure the edited key is updated when the key changes (selection changes)
    useEffect(() => {
        setEditedKey(props.currentKey);
    }, [props.currentKey]);

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
        <Label htmlFor={'item-key-' + props.currentKey} className="w-32">
            Key
        </Label>
        <Input
            id={'item-key-' + props.currentKey}
            className='w-full'
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

const EditSection: React.FC<{
    selectedElement: ItemComponent,
    isHeaderCell?: boolean,
    usedKeys: string[],
    onChange(item: ItemComponent): void
}> = ({ selectedElement, isHeaderCell, usedKeys, onChange }) => {

    return <div className='space-y-4'>
        <Separator orientation='horizontal' />
        {selectedElement && <p className='font-semibold mb-2'>Selected Element: </p>}
        {selectedElement && <div className='space-y-4'>
            {isHeaderCell && <KeyEditor
                currentKey={selectedElement.key ?? ''}
                existingKeys={usedKeys.filter((key): key is string => key !== undefined)}
                onChange={(newKey) => {
                    if (selectedElement.key) {
                        onChange({ ...selectedElement, key: newKey });
                    }
                }}
            />}

            <div className='flex items-center gap-2'
                data-no-dnd="true"
            >
                <p className='w-32 font-semibold text-sm'>Cell type</p>
                <Select
                    value={selectedElement.role || ''}
                    disabled={isHeaderCell}
                    onValueChange={(value) => {
                        if (value != selectedElement.role && selectedElement.key) {
                            // Cleanup all contents if the type is changed, except the key
                            onChange({ role: value, key: selectedElement.key });
                        }
                    }}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select a type..." />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value={MatrixCellType.Dropdown}>Dropdown</SelectItem>
                        <SelectItem value={MatrixCellType.Text}>Display text / Placeholder</SelectItem>
                        <SelectItem value={MatrixCellType.TextInput}>Text input</SelectItem>
                        <SelectItem value={MatrixCellType.NumberInput}>Number input</SelectItem>
                        <SelectItem value={MatrixCellType.DateInput}>Date input</SelectItem>
                        <SelectItem value={MatrixCellType.TimeInput}>Time input</SelectItem>
                        <SelectItem value={MatrixCellType.Checkbox}>Checkbox</SelectItem>
                        <SelectItem disabled={true} hidden={true} value={MatrixRowType.ResponseRow}>Response row (text)</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <Separator orientation='horizontal' />

            <CellEditor
                selectedElement={selectedElement}
                onChange={function (key: string, item: ItemComponent): void {
                    onChange(item);
                }} />


        </div>
        }
    </div>
}

const MatrixEditor: React.FC<MatrixProps> = (props) => {
    const [selectedElement, setSelectedElement] = React.useState<Selection | undefined>(undefined);
    const [copiedValue, copyToClipboard] = useCopyToClipboard();

    const rgIndex = props.surveyItem.components?.items.findIndex(comp => comp.role === ItemComponentRole.ResponseGroup);
    if (rgIndex === undefined || rgIndex === -1) {
        return <p>Response group not found</p>;
    }
    const rg = props.surveyItem.components?.items[rgIndex] as ItemGroupComponent;
    const matrixIndex = rg.items.findIndex(comp => comp.role === ItemComponentRole.Matrix);
    if (matrixIndex === undefined || matrixIndex === -1) {
        return <p>Matrix not found</p>;
    }

    const matrixDef = (rg.items[matrixIndex] as ItemGroupComponent);
    let headerRow = matrixDef.items.find(comp => comp.role === MatrixRowType.HeaderRow) as ItemGroupComponent;
    if (!headerRow) {
        headerRow = { items: new Array<ItemComponent>, role: MatrixRowType.HeaderRow } as ItemGroupComponent
        matrixDef.items.push(headerRow);
    }
    const numCols = headerRow.items.length || 0;

    const responseRows = matrixDef.items.filter(comp => comp.role === MatrixRowType.ResponseRow) as ItemGroupComponent[];
    const numRows = responseRows.length || 0;

    const rowKeys = responseRows.map(comp => comp.key) as string[];
    const headerColKeys = headerRow.items.map(comp => comp.key) as string[];


    const updateSurveyItemWithNewRg = (matrixItems: ItemComponent[]) => {
        const newMatrixDef = {
            ...matrixDef,
            items: matrixItems,
        };

        const newRg = {
            ...rg,
            items: rg.items.map(comp => {
                if (comp.role === ItemComponentRole.Matrix) {
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

    const updateTargetComp = (updatedElement: ItemComponent, targetPosition?: Selection) => {
        if (!targetPosition) return;

        if (targetPosition.rowIndex === -1 && targetPosition.colIndex === -1) {
            return;
        }

        let newMatrixItems: ItemComponent[] = [];
        if (targetPosition.rowIndex === -1) {
            let updateColKey: {
                from: string,
                to: string
            } | undefined = undefined;

            newMatrixItems = matrixDef.items.map((comp) => {
                // update header row
                if (comp.role === MatrixRowType.HeaderRow) {
                    return {
                        ...comp,
                        items: (comp as ItemGroupComponent).items.map((item, colIndex) => {
                            if (colIndex === targetPosition.colIndex) {
                                if (item.key !== updatedElement.key) {
                                    // column key changed, update key for all cells in the column with same key
                                    updateColKey = {
                                        from: item.key ?? '',
                                        to: updatedElement.key ?? ''
                                    };
                                }
                                return updatedElement;
                            }
                            return item;
                        })
                    }
                }
                return comp;
            })

            if (updateColKey) {
                newMatrixItems = newMatrixItems.map((comp) => {
                    if (comp.role === MatrixRowType.ResponseRow) {
                        const row = comp as ItemGroupComponent;
                        if (row.items[targetPosition.colIndex].key === updateColKey?.from) {
                            row.items[targetPosition.colIndex].key = updateColKey?.to;
                        }
                        return row;
                    }
                    return comp;
                })
            }
            updateSurveyItemWithNewRg(newMatrixItems);
            return;
        }


        const responseRows = matrixDef.items.filter(comp => comp.role === MatrixRowType.ResponseRow) as ItemGroupComponent[];
        const headerRow = matrixDef.items.find(comp => comp.role === MatrixRowType.HeaderRow) as ItemGroupComponent;

        newMatrixItems = [headerRow, ...responseRows.map((row, rowIndex) => {
            if (targetPosition.rowIndex !== rowIndex) {
                return row;
            }
            if (targetPosition.colIndex === -1) {
                return {
                    ...updatedElement,
                    items: row.items,
                };
            }
            return {
                ...row,
                items: row.items.map((cell, colIndex) => {
                    if (colIndex === targetPosition.colIndex) {
                        return updatedElement;
                    }
                    return cell;
                })
            }
        })];
        updateSurveyItemWithNewRg(newMatrixItems);
    }

    const changeCols = (newNumCols: number) => {
        if (selectedElement !== undefined && selectedElement?.colIndex > newNumCols - 1) {
            setSelectedElement(undefined);
        }

        const newHeaderRowKeys = [...headerColKeys];
        for (let i = headerColKeys.length; i < newNumCols; i++) {
            newHeaderRowKeys.push(getUniqueRandomKey(newHeaderRowKeys, ""));
        }

        const newMatrixItems = matrixDef.items.map(comp => {
            if (comp.role === MatrixRowType.HeaderRow) {
                const headerRow = comp as ItemGroupComponent;
                const newHeaderRow = {
                    ...comp,
                    items: Array.from({ length: newNumCols }).map((_v, i) => {
                        if (i < headerRow.items.length) {
                            return headerRow.items[i];
                        } else {
                            return {
                                key: newHeaderRowKeys[i],
                                role: MatrixCellType.Text,
                            }
                        }
                    })
                };
                return newHeaderRow;
            }

            if (comp.role === MatrixRowType.ResponseRow) {
                const responseRow = comp as ItemGroupComponent;

                const newResponseRow = {
                    ...comp,
                    items: Array.from({ length: newNumCols }).map((_v, i) => {
                        if (i < responseRow.items.length) {
                            return responseRow.items[i];
                        } else {
                            return {
                                key: newHeaderRowKeys[i],
                                role: MatrixCellType.Dropdown,
                                items: [],
                                order: {
                                    //TODO: avoid magic strings
                                    name: 'sequential'
                                }
                            }

                        }
                    })
                };
                return newResponseRow;
            }
            return comp;
        });
        updateSurveyItemWithNewRg(newMatrixItems);
    }

    const addColAt = (targetColIndex: number) => {
        const newColKey = getUniqueRandomKey(headerColKeys, "");
        const newHeaderRowKeys = [...headerColKeys];

        newHeaderRowKeys.splice(targetColIndex, 0, newColKey);

        const newNumCols = newHeaderRowKeys.length;

        const newMatrixItems = matrixDef.items.map(comp => {
            if (comp.role === MatrixRowType.HeaderRow) {
                const headerRow = comp as ItemGroupComponent;
                const newHeaderRow = {
                    ...comp,
                    items: Array.from({ length: newNumCols }).map((_v, i) => {
                        if (newColKey === newHeaderRowKeys[i]) {
                            return {
                                key: newHeaderRowKeys[i],
                                role: MatrixCellType.Text,
                            }
                        } else {
                            return headerRow.items.find(item => item.key === newHeaderRowKeys[i]);
                        }
                    })
                };
                return newHeaderRow;
            }

            if (comp.role === MatrixRowType.ResponseRow) {
                const responseRow = comp as ItemGroupComponent;

                const newResponseRow = {
                    ...comp,
                    items: Array.from({ length: newNumCols }).map((_v, i) => {
                        if (newColKey === newHeaderRowKeys[i]) {
                            return {
                                key: newHeaderRowKeys[i],
                                role: MatrixCellType.Dropdown,
                                items: [],
                                order: {
                                    //TODO: avoid magic strings
                                    name: 'sequential'
                                }
                            }
                        } else {
                            return responseRow.items.find(item => item.key === newHeaderRowKeys[i]);
                        }
                    })
                };
                return newResponseRow;
            }
            return comp;
        });
        updateSurveyItemWithNewRg(newMatrixItems);
    }

    const deleteColAt = (targetColIndex: number) => {
        if (!confirm('Are you sure you want to delete this column?')) {
            return;
        }
        const newHeaderRowKeys = [...headerColKeys];
        newHeaderRowKeys.splice(targetColIndex, 1);

        const newMatrixItems = matrixDef.items.map(comp => {
            if (comp.role === MatrixRowType.HeaderRow) {
                const headerRow = comp as ItemGroupComponent;
                headerRow.items.splice(targetColIndex, 1);
                const newHeaderRow = {
                    ...headerRow,

                };
                return newHeaderRow;
            }

            if (comp.role === MatrixRowType.ResponseRow) {
                const responseRow = comp as ItemGroupComponent;
                responseRow.items.splice(targetColIndex, 1);
                const newResponseRow = {
                    ...responseRow
                };
                return newResponseRow;
            }
            return comp;
        });
        updateSurveyItemWithNewRg(newMatrixItems);
    }

    const changeRows = (newNumRows: number) => {
        if (selectedElement !== undefined && selectedElement?.rowIndex > newNumRows - 1) {
            setSelectedElement(undefined);
        }

        const headerRow = (matrixDef.items.find(comp => comp.role === MatrixRowType.HeaderRow))!;
        const oldRows = (matrixDef.items.filter(comp => comp.role === MatrixRowType.ResponseRow) as ItemGroupComponent[]);

        const newRowKeys = [...rowKeys];
        for (let i = rowKeys.length; i < newNumRows; i++) {
            newRowKeys.push(getUniqueRandomKey(newRowKeys, ""));
        }
        const newRows = Array.from({ length: newNumRows }).map((_v, i) => {
            if (i < oldRows.length) {
                return oldRows[i];
            } else {
                return {
                    key: newRowKeys[i],
                    role: MatrixRowType.ResponseRow,
                    items: Array.from({ length: numCols }).map((_, j) => {
                        return {
                            key: headerColKeys[j],
                            role: MatrixCellType.Dropdown,
                            items: [],
                            order: {
                                //TODO: avoid magic strings
                                name: 'sequential'
                            },
                        }
                    })
                }
            }
        });

        const newMatrixItems: ItemComponent[] = [headerRow, ...newRows];
        updateSurveyItemWithNewRg(newMatrixItems);
    }



    const getItemAt = (position?: Selection): ItemComponent | undefined => {
        if (position === undefined) {
            return undefined;
        }

        if (position.rowIndex === -1 && position.colIndex === -1) {
            return undefined;
        }

        if (position.rowIndex === -1) {
            return headerRow.items[position.colIndex];
        }

        if (position.colIndex === -1) {
            return responseRows[position.rowIndex];
        }

        return responseRows[position.rowIndex].items[position.colIndex];
    }
    const selectedItemComp = getItemAt(selectedElement);
    const getUsedKeys = (): string[] => {
        if (selectedItemComp === undefined) {
            return [];
        }
        if (selectedItemComp.role === MatrixRowType.HeaderRow) {
            return headerColKeys;
        }
        if (selectedItemComp.role === MatrixRowType.ResponseRow) {
            return rowKeys;
        }
        if (selectedElement && selectedElement?.rowIndex > -1) {
            return responseRows[selectedElement.rowIndex].items.map(cell => cell.key!);
        }
        return headerColKeys
    }

    const handleCellAction = async (action: MatrixAction, position: Selection) => {
        if (selectedElement === undefined) {
            return;
        }
        switch (action) {
            case 'copy':
                await copyToClipboard(JSON.stringify(getItemAt(position)));
                return;
            case 'paste':
                if (copiedValue === null) {
                    return;
                }
                const pastedItem = JSON.parse(copiedValue);
                if (pastedItem === null) {
                    return;
                }
                const targetItem = getItemAt(position);
                if (targetItem === undefined) {
                    return;
                }
                if (
                    position.rowIndex === -1 || position.colIndex === -1 ||
                    targetItem.role === MatrixRowType.ResponseRow || targetItem.role === MatrixRowType.HeaderRow ||
                    pastedItem.role === MatrixRowType.ResponseRow || pastedItem.role === MatrixRowType.HeaderRow
                ) {
                    const newItem = { ...targetItem };
                    newItem.content = pastedItem.content;
                    updateTargetComp(newItem, position);
                    return;
                }
                const newItem = { ...pastedItem };
                newItem.key = targetItem.key;
                updateTargetComp(newItem, position);
                return;
            case 'add-column-after':
                addColAt((position?.colIndex || 0) + 1);
                return;
            case 'add-column-before':
                addColAt(position?.colIndex || 0);
                return;
            case 'delete-column':
                deleteColAt(position?.colIndex || 0);
                return;
            /*case 'add-row-above':
                addRowAt(position?.rowIndex || 0 + 1);
                return;
            case 'add-row-below':
                addRowAt(position?.rowIndex || 0);
                return;

            case 'delete-row':
                deleteRowAt(position?.rowIndex || 0);
                return;*/
            default:
                console.warn('Unknown action: ', action);
                return;
        }
    }

    return (
        <div className="space-y-4">
            <p className='font-semibold mb-2'>Rows and Columns: </p>
            <div className="flex flex-row gap-4 w-full">
                <div className='space-y-1.5 flex-1'>
                    <Label
                        htmlFor={matrixDef.key + '-numCols'}
                    >
                        Number of columns (excl. labels)
                    </Label>
                    <Input
                        id={matrixDef.key + '-numCols'}
                        value={numCols || '0'}
                        type='number'
                        onChange={(e) => { changeCols(parseInt(e.target.value)) }}
                        placeholder='Define the number of columns...'
                    />
                </div>
                <div className='space-y-1.5 flex-1'>
                    <Label
                        htmlFor={matrixDef.key + '-numRows'}
                    >
                        Number of rows (excl. labels)
                    </Label>
                    <Input
                        id={matrixDef.key + '-numRows'}
                        value={numRows || '0'}
                        type='number'
                        onChange={(e) => { changeRows(parseInt(e.target.value)) }}
                        placeholder='Define the number of rows...'
                    />
                </div>
            </div>
            {matrixDef.items.length > 0 && <div className='space-y-4'>
                <p className='font-semibold mb-2'>Overview: </p>
                <OverviewTable
                    matrixDef={matrixDef}
                    selectedElement={selectedElement}
                    onSelectionChange={setSelectedElement}
                    headerColKeys={headerColKeys}
                    onAction={handleCellAction}
                />
            </div>}
            {selectedItemComp &&
                <EditSection
                    selectedElement={selectedItemComp}
                    usedKeys={getUsedKeys()}
                    isHeaderCell={selectedElement !== undefined && (selectedElement.rowIndex === -1 || selectedElement.colIndex === -1)}
                    onChange={(item: ItemComponent) => {
                        updateTargetComp(item, selectedElement);
                    }}
                />}

        </div>

    );
}

export default MatrixEditor;
