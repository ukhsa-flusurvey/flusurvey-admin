import SortableWrapper from '@/components/survey-editor/components/general/SortableWrapper';
import AddDropdown from '@/components/survey-editor/components/general/add-dropdown';
import { SurveyContext } from '@/components/survey-editor/surveyContext';
import { localisedObjectToMap } from '@/components/survey-editor/utils/localeUtils';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { generateLocStrings } from 'case-editor-tools/surveys/utils/simple-generators';
import { Columns2 } from 'lucide-react';
import React, { useContext } from 'react';
import { ItemComponent, ItemGroupComponent, SurveySingleItem } from 'survey-engine/data_types';

interface MatrixProps {
    surveyItem: SurveySingleItem;
    onUpdateSurveyItem: (item: SurveySingleItem) => void;
}

const RowEditor = (props: {}) => {
    return <div>
        <p>
            each row: key editor, row label, sortable columns, delete row
        </p>
    </div>
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

                    // updateSurveyItemWithNewOptions(newItems);
                }}
                dragOverlayItem={(draggedId && draggedItem) ?
                    <RowEditor
                    /*index={-1}
                    component={draggedItem}
                    onDeleteComponent={() => { }}
                    onUpdateComponent={() => { }}*/
                    />
                    : null}
            >
                <div className='overflow-y-scroll py-1'>
                    <ol className='flex flex-col gap-4 min-w-full'>
                        {matrixRows.map((component, index) => {
                            return <RowEditor
                                key={component.key || index}
                            // index={index}
                            // component={component}
                            // existingKeys={usedKeys}
                            /*onDeleteComponent={() => {
                                const newItems = responseItems.filter(comp => comp.key !== component.key);
                                updateSurveyItemWithNewOptions(newItems);
                            }}
                            onUpdateComponent={(updatedItem) => {
                                const newItems = responseItems.map((comp => {
                                    if (comp.key === component.key) {
                                        return updatedItem;
                                    }
                                    return comp;
                                }))
                                updateSurveyItemWithNewOptions(newItems);
                            }}*/
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
