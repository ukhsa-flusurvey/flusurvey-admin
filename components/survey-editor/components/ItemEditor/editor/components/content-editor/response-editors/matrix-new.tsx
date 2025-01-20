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
import { Binary, Calendar, Check, CircleHelp, Clock, SquareChevronDown, TextCursorInput, Type, X } from "lucide-react";
import { useContext, useEffect } from "react";
import { ItemComponent, ItemGroupComponent, SurveySingleItem } from "survey-engine/data_types";
import TextInputContentConfig from "./text-input-content-config";
import NumberInputContentConfig from "./number-input-content-config";
import DateInputContentConfig from "./date-input-content-config";
import TimeInputContentConfig from "./time-input-content-config";
import DropdownContentConfig from "./dropdown-content-config";
import React from "react";
import { MatrixCellType, MatrixRowType } from "@/components/survey-viewer/survey-renderer/SurveySingleItemView/ResponseComponent/InputTypes/Matrix";
import { SimpleTextViewContentEditor } from "./text-view-content-editor";

interface MatrixProps {
    surveyItem: SurveySingleItem;
    onUpdateSurveyItem: (item: SurveySingleItem) => void;
}

const cellClassname = 'border border-gray-300 p-2 hover:bg-gray-100 cursor-pointer overflow-ellipsis whitespace-nowrap overflow-hidden';
const cellClassnameSelected = 'border border-gray-300 p-2 bg-gray-200 cursor-pointer overflow-ellipsis whitespace-nowrap overflow-hidden';

const OverviewMatrixCellContent: React.FC<{ cell: ItemComponent }> = ({ cell }) => {
    const { selectedLanguage } = useContext(SurveyContext);
    const hasTranslation = getLocalizedString(cell.content, selectedLanguage) !== undefined && getLocalizedString(cell.content, selectedLanguage) !== '';
    const icon = (cell: ItemComponent) => {
        switch (cell.role) {
            case MatrixCellType.Dropdown:
                return <SquareChevronDown size={16} />;
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
    const content = hasTranslation ? <p className="text-sm">{getLocalizedString(cell.content, selectedLanguage)}</p> : <Badge className='h-auto py-0'>{cell.key}</Badge>;
    return (
        <>
            <div className="flex flex-row items-center gap-2">{icon(cell)}{content}</div>
        </>
    );
}

const OverviewTable: React.FC<{ matrixDef: ItemGroupComponent, selectedElement: ItemComponent | undefined, onClick(i: ItemComponent): void }> = ({ matrixDef, selectedElement, onClick }) => {
    const { selectedLanguage } = useContext(SurveyContext);

    const textElement = (item: ItemComponent) => {
        if (item.role === MatrixCellType.Text || item.role === MatrixRowType.ResponseRow) {
            const hasTranslation = getLocalizedString(item.content, selectedLanguage) !== undefined && getLocalizedString(item.content, selectedLanguage) !== '';
            if (hasTranslation) {
                return <div className="flex flex-row items-center gap-2"><Type size={16} /><p className="text-sm">{getLocalizedString(item.content, selectedLanguage)}</p></div>;
            } else {
                return <div className="flex flex-row items-center gap-2"><Type size={16} /><Badge className='h-auto py-0'>{item.key}</Badge></div>;
            }
        }
    }

    return (
        <table className="w-full table-fixed">
            <thead>
                <tr>
                    <th className="border-none"></th>
                    {(matrixDef.items.find(comp => comp.role === MatrixRowType.HeaderRow) as ItemGroupComponent).items.map((header) => {
                        return (
                            <th key={header.key} className={selectedElement?.key == header.key ? cellClassnameSelected : cellClassname} onClick={() => onClick(header)}>
                                {textElement(header)}
                            </th>
                        );
                    })}
                </tr>
            </thead>
            <tbody>
                {matrixDef.items.filter(comp => comp.role === MatrixRowType.ResponseRow).map((row) => (
                    <tr key={row.key}>
                        <th className={selectedElement?.key == row.key ? cellClassnameSelected : cellClassname} onClick={() => onClick(row)}>
                            {textElement(row)}
                        </th>
                        {(row as ItemGroupComponent).items.map((cell) => (
                            <td key={cell.key} className={selectedElement?.key == cell.key ? cellClassnameSelected : cellClassname} onClick={() => onClick(cell)}>
                                <OverviewMatrixCellContent cell={cell} />
                            </td>
                        ))}
                    </tr>
                ))}
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

const EditSection: React.FC<{ selectedElement: ItemComponent, allKeys: string[], cellKeys: string[], onChange(key: string, item: ItemComponent): void }> = ({ selectedElement, allKeys, cellKeys, onChange }) => {

    return <div className='space-y-4'>
        <Separator orientation='horizontal' />
        {selectedElement && <p className='font-semibold mb-2'>Selected Element: </p>}
        {selectedElement && <div className='space-y-4'>
            <KeyEditor
                currentKey={selectedElement.key ?? ''}
                existingKeys={allKeys.filter((key): key is string => key !== undefined)}
                onChange={(newKey) => {
                    if (selectedElement.key) {
                        onChange(selectedElement.key, { ...selectedElement, key: newKey });
                    }
                }}
            />

            <div className='flex items-center gap-2'
                data-no-dnd="true"
            >
                <p className='w-32 font-semibold text-sm'>Cell type</p>
                <Select
                    value={selectedElement.role || ''}
                    disabled={cellKeys.indexOf(selectedElement.key!) < 0}
                    onValueChange={(value) => {
                        if (value != selectedElement.role && selectedElement.key) {
                            // Cleanup all contents if the type is changed, except the key
                            onChange(selectedElement.key, { role: value, key: selectedElement.key });
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
                    onChange(key, item);
                }} />


        </div>
        }
    </div>
}

const NewMatrix: React.FC<MatrixProps> = (props) => {
    const [selectedElement, setSelectedElement] = React.useState<ItemComponent | undefined>(undefined);

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
    const numRows = (matrixDef.items.filter(comp => comp.role === MatrixRowType.ResponseRow) as ItemGroupComponent[]).length || 0;

    const rowKeys = matrixDef.items.filter(comp => comp.role === MatrixRowType.ResponseRow).map(comp => comp.key) as string[];
    const colKeys = headerRow.items.map(comp => comp.key) as string[];
    const cellKeys = matrixDef.items.filter(comp => comp.role === MatrixRowType.ResponseRow).map(comp => (comp as ItemGroupComponent).items.map(cell => cell.key)).flat() as string[];
    const allKeys = [...rowKeys, ...colKeys, ...cellKeys];


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

    const selectedElementUpdated = (key: string, updatedElement: ItemComponent) => {
        if (!selectedElement) return;
        const newMatrixItems = matrixDef.items.map(comp => {
            if (comp.key === key) {
                return updatedElement;
            }
            if ((comp as ItemGroupComponent).items.length > 0) {
                (comp as ItemGroupComponent).items = (comp as ItemGroupComponent).items.map(cell => {
                    if (cell.key === key) {
                        return updatedElement;
                    }
                    return cell;
                });
            }
            return comp;
        });
        setSelectedElement(updatedElement);
        updateSurveyItemWithNewRg(newMatrixItems);
    }

    const changeCols = (newNumCols: number) => {
        const newMatrixItems = matrixDef.items.map(comp => {
            if (comp.role === MatrixRowType.HeaderRow) {
                const headerRow = comp as ItemGroupComponent;
                const newHeaderRow = {
                    ...comp,
                    items: Array.from({ length: newNumCols }).map((_v, i) => {
                        if (headerRow.items[i]) {
                            return headerRow.items[i];
                        } else {
                            return {
                                key: getUniqueRandomKey(allKeys as string[], comp.key ?? ""),
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
                        if (responseRow.items[i]) {
                            return responseRow.items[i];
                        } else {
                            return {
                                key: getUniqueRandomKey(allKeys as string[], comp.key ?? ""),
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

    const changeRows = (newNumRows: number) => {
        const headerRow = (matrixDef.items.find(comp => comp.role === MatrixRowType.HeaderRow))!;
        const oldRows = (matrixDef.items.filter(comp => comp.role === MatrixRowType.ResponseRow) as ItemGroupComponent[]);
        const newRows = Array.from({ length: newNumRows }).map((_v, i) => {
            if (oldRows[i]) {
                return oldRows[i];
            } else {
                return {
                    key: getUniqueRandomKey(allKeys as string[], ""),
                    role: MatrixRowType.ResponseRow,
                    items: Array.from({ length: numCols }).map(() => {
                        return {
                            key: getUniqueRandomKey(allKeys as string[], ""),
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
                <OverviewTable matrixDef={matrixDef} selectedElement={selectedElement}
                    onClick={function (i: ItemComponent): void {
                        setSelectedElement(i);
                    }} />
            </div>}
            {selectedElement &&
                <EditSection selectedElement={selectedElement} allKeys={allKeys} cellKeys={cellKeys} onChange={function (key: string, item: ItemComponent): void {
                    selectedElementUpdated(key, item);
                }} />}

        </div>

    );
}

export default NewMatrix;
