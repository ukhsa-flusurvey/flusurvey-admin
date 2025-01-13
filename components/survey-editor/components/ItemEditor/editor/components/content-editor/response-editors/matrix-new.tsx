import { ItemComponentRole } from "@/components/survey-editor/components/types";
import { SurveyContext } from "@/components/survey-editor/surveyContext";
import { getLocalizedString } from "@/components/survey-editor/utils/localizedStrings";
import { getUniqueRandomKey } from "@/components/survey-editor/utils/new-item-init";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { SquareChevronDown, Type } from "lucide-react";
import React, { useEffect } from "react";
import { useContext } from "react";
import { ItemComponent, ItemGroupComponent, SurveySingleItem } from "survey-engine/data_types";

interface MatrixProps {
    surveyItem: SurveySingleItem;
    onUpdateSurveyItem: (item: SurveySingleItem) => void;
}

const cellClassname = 'border border-gray-300 p-2 hover:bg-gray-100 cursor-pointer';
const cellClassnameSelected = 'border border-gray-300 p-2 bg-gray-200 cursor-pointer';

const OverviewMatrixCellContent: React.FC<{ cell: ItemComponent }> = ({ cell }) => {
    return (
        <>
            {cell.role === ItemComponentRole.DropdownGroup ? <div className="flex flex-row items-center gap-2"><SquareChevronDown size={16} /><Badge className='h-auto py-0'>{cell.key}</Badge></div> : `Cell`}
        </>
    );
}

const NewMatrix: React.FC<MatrixProps> = (props) => {
    const { selectedLanguage } = useContext(SurveyContext);
    //const [draggedId, setDraggedId] = React.useState<string | null>(null);
    const [selectedElement, setSelectedElement] = React.useState<ItemComponent | undefined>(undefined);

    useEffect(() => {
        console.log('Selected element:', selectedElement);
    }, [selectedElement]);

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
    const numCols = (matrixDef.items.find(comp => comp.role === ItemComponentRole.HeaderRow) as ItemGroupComponent).items.length || 0;
    const numRows = (matrixDef.items.filter(comp => comp.role === ItemComponentRole.ResponseRow) as ItemGroupComponent[]).length || 0;

    const rowKeys = matrixDef.items.filter(comp => comp.role === ItemComponentRole.ResponseRow).map(comp => comp.key);
    const colKeys = (matrixDef.items.find(comp => comp.role === ItemComponentRole.HeaderRow) as ItemGroupComponent).items.map(comp => comp.key);
    const cellKeys = matrixDef.items.filter(comp => comp.role === ItemComponentRole.ResponseRow).map(comp => (comp as ItemGroupComponent).items.map(cell => cell.key)).flat();
    const allKeys = [...rowKeys, ...colKeys, ...cellKeys];

    //console.log(matrixDef);

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

    const changeCols = (newNumCols: number) => {
        const newMatrixItems = matrixDef.items.map(comp => {
            if (comp.role === ItemComponentRole.HeaderRow) {
                const headerRow = comp as ItemGroupComponent;
                const newHeaderRow = {
                    ...comp,
                    items: Array.from({ length: newNumCols }).map((_v, i) => {
                        if (headerRow.items[i]) {
                            return headerRow.items[i];
                        } else {
                            return {
                                key: getUniqueRandomKey(allKeys as string[], comp.key ?? ""),
                                role: ItemComponentRole.Text,
                            }
                        }
                    })
                };
                return newHeaderRow;
            }
            if (comp.role === ItemComponentRole.ResponseRow) {
                const responseRow = comp as ItemGroupComponent;

                const newResponseRow = {
                    ...comp,
                    items: Array.from({ length: newNumCols }).map((_v, i) => {
                        if (responseRow.items[i]) {
                            return responseRow.items[i];
                        } else {
                            return {
                                key: getUniqueRandomKey(allKeys as string[], comp.key ?? ""),
                                role: ItemComponentRole.DropdownGroup,
                                items: [],
                                order: {
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
        const headerRow = (matrixDef.items.find(comp => comp.role === ItemComponentRole.HeaderRow));
        if (!headerRow) return;

        const oldRows = (matrixDef.items.filter(comp => comp.role === ItemComponentRole.ResponseRow) as ItemGroupComponent[]);
        const newRows = Array.from({ length: newNumRows }).map((_v, i) => {
            if (oldRows[i]) {
                return oldRows[i];
            } else {
                return {
                    key: getUniqueRandomKey(allKeys as string[], ""),
                    role: ItemComponentRole.ResponseRow,
                    items: Array.from({ length: numCols }).map(() => {
                        return {
                            key: getUniqueRandomKey(allKeys as string[], ""),
                            role: ItemComponentRole.DropdownGroup,
                            items: [],
                            order: {
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


    function generateTableOverview(matrixDef: ItemGroupComponent): React.ReactNode {
        const textElement = (item: ItemComponent) => {
            if (item.role === ItemComponentRole.Text || item.role === ItemComponentRole.ResponseRow) {
                const hasTranslation = getLocalizedString(item.content, selectedLanguage) !== undefined && getLocalizedString(item.content, selectedLanguage) !== '';
                console.log('Has translation:', hasTranslation);
                if (hasTranslation) {
                    return <div className="flex flex-row items-center gap-2"><Type size={16} /><p>{getLocalizedString(item.content, selectedLanguage)}</p></div>;
                } else {
                    return <div className="flex flex-row items-center gap-2"><Type size={16} /><Badge className='h-auto py-0'>{item.key}</Badge></div>;
                }
            }
        }

        return (
            <table className="table-auto w-full">
                <thead>
                    <tr>
                        <th className="border-none"></th>
                        {(matrixDef.items.find(comp => comp.role === ItemComponentRole.HeaderRow) as ItemGroupComponent).items.map((header) => {
                            return (
                                <th key={header.key} className={selectedElement?.key == header.key ? cellClassnameSelected : cellClassname} onClick={() => setSelectedElement(header)}>
                                    {textElement(header)}
                                </th>
                            );
                        })}
                    </tr>
                </thead>
                <tbody>
                    {matrixDef.items.filter(comp => comp.role === ItemComponentRole.ResponseRow).map((row) => (
                        <tr key={row.key}>
                            <th className={selectedElement?.key == row.key ? cellClassnameSelected : cellClassname} onClick={() => setSelectedElement(row)}>
                                {textElement(row)}
                            </th>
                            {(row as ItemGroupComponent).items.map((cell) => (
                                <td key={cell.key} className={selectedElement?.key == cell.key ? cellClassnameSelected : cellClassname} onClick={() => setSelectedElement(cell)}>
                                    {/* Render cell content or a placeholder */}
                                    {OverviewMatrixCellContent({ cell })}
                                    { /* cell.role === ItemComponentRole.DropdownGroup ? 'Dropdown' : `Cell ${rowIndex + 1}-${colIndex + 1}` */}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    }

    return (
        <div className="space-y-4">
            <div className='space-y-1.5'>
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
                    placeholder='Define the nuber of columns...'
                />
            </div>
            <div className='space-y-1.5'>
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
                    placeholder='Define the nuber of rows...'
                />
            </div>

            <Separator orientation='horizontal' />


            <div className='space-y-4'>
                <p>Overview (select cell to edit)</p>
                {generateTableOverview(matrixDef)}
            </div>
        </div>

    );
}

export default NewMatrix;
