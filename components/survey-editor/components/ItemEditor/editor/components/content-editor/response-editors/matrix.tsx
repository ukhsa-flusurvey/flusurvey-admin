import { SurveyContext } from '@/components/survey-editor/surveyContext';
import { localisedObjectToMap } from '@/components/survey-editor/utils/localeUtils';
import { getItemComponentByRole } from '@/components/survey-viewer/survey-renderer/SurveySingleItemView/utils';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { generateLocStrings } from 'case-editor-tools/surveys/utils/simple-generators';
import React, { useContext } from 'react';
import { ItemComponent, ItemGroupComponent, SurveySingleItem } from 'survey-engine/data_types';

interface MatrixProps {
    surveyItem: SurveySingleItem;
    onUpdateSurveyItem: (item: SurveySingleItem) => void;
}

const Matrix: React.FC<MatrixProps> = (props) => {
    const { selectedLanguage } = useContext(SurveyContext);

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
    const headerRowIndex = matrixDef.items.findIndex(comp => comp.role === 'headerRow');
    const headerRow = (headerRowIndex === undefined || headerRowIndex === -1) ? [] : (matrixDef.items[headerRowIndex] as ItemGroupComponent).items;

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


    const headerColumnLabels = headerRow.map(
        (headerRowItem) => localisedObjectToMap(headerRowItem.content).get(selectedLanguage) || ''
    ).join('\n');

    return (
        <div className='space-y-4 pt-6'>
            <div className=''>
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
                            matrixDef.items.push({
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


            <p>
                sortable rows
            </p>
            <p>
                each row: key editor, row label, sortable columns
            </p>
        </div>
    );
};

export default Matrix;
