import React from 'react';
import GenericQuestionPropEditor from '../GenericQuestionPropEditor';
import { SurveyItems } from 'case-editor-tools/surveys/survey-items';
import { BsBraces } from 'react-icons/bs';
import { ItemComponent, ItemGroupComponent, LocalizedString, SurveySingleItem, isItemGroupComponent } from 'survey-engine/data_types';
import { DateDisplayComponentProp, ExpressionDisplayProp, GenericQuestionProps, StyledTextComponentProp } from 'case-editor-tools/surveys/types';
import { localisedStringToMap } from '../utils';

interface SingleChoiceAttributeEditorProps {
    surveyItem: SurveySingleItem;
    onItemChange: (item: SurveySingleItem) => void;
}


const surveyItemToGenericProps = (surveyItem: SurveySingleItem): GenericQuestionProps => {
    const keyParts = surveyItem.key.split('.');
    const itemKey = keyParts.pop() || '';
    const parentKey = keyParts.join('.');

    let questionText: Map<string, string> | Array<StyledTextComponentProp | DateDisplayComponentProp | ExpressionDisplayProp> = new Map([]);
    const titleComp = surveyItem.components?.items.find(i => i.role === 'title');
    if (titleComp) {
        if ((titleComp as ItemGroupComponent).items !== undefined) {
            // map items to styled text components and date display components
            questionText = (titleComp as ItemGroupComponent).items.map((i: any) => {
                const className = i.style?.find((s: any) => s.key === 'className')?.value;
                if (i.content === undefined
                    || i.content.length === 0
                    || i.content[0].parts === undefined
                    || i.content[0].parts.length === 0
                ) {
                    return {
                        className: className,
                        content: new Map([]),
                    }
                }

                if (i.role === 'text') {
                    // check if expression
                    if (i.content[0].parts[0].dtype === 'exp') {
                        return {
                            className: className,
                            expression: i.content[0].parts[0].exp,
                            languageCodes: i.content.map((c: any) => c.code),
                        }
                    }
                    // if not, then assume simple formatted text
                    return {
                        className: className,
                        content: localisedStringToMap(i.content as LocalizedString[])
                    }
                } else if (i.role === 'dateDisplay') {
                    return {
                        className: className,
                        date: i.content[0].parts[0].exp,
                        dateFormat: i.style?.find((s: any) => s.key === 'dateFormat')?.value,
                        languageCodes: i.content.map((c: any) => c.code),
                    }
                }
                return i;
            });
        } else {
            questionText = localisedStringToMap(titleComp.content as LocalizedString[]);
        }
    }

    const subTitle = localisedStringToMap(titleComp?.description as LocalizedString[]);
    const titleClassName = titleComp?.style?.find(s => s.key === 'className')?.value;

    const helpgroup = (surveyItem.components?.items.find(i => i.role === 'helpGroup') as ItemGroupComponent)?.items?.map((i: any) => {
        return {
            content: localisedStringToMap(i.content as LocalizedString[]),
            style: i.style,
        }
    });

    const footNoteComp = surveyItem.components?.items.find(i => i.role === 'footnote')

    const responseGroupIndex = surveyItem.components?.items.findIndex(i => i.role === 'responseGroup') || 0;

    let topDisplayCompoments: ItemComponent[] | undefined = [];
    let bottomDisplayCompoments: ItemComponent[] | undefined = [];
    const ignoreRoles = ['responseGroup', 'title', 'helpGroup', 'footnote'];
    surveyItem.components?.items.forEach((comp, index) => {
        if (ignoreRoles.includes(comp.role)) {
            return;
        }
        if (index < responseGroupIndex) {
            topDisplayCompoments?.push(comp);
        }
        if (index > responseGroupIndex) {
            bottomDisplayCompoments?.push(comp);
        }
    });

    if (topDisplayCompoments.length === 0) {
        topDisplayCompoments = undefined;
    }
    if (bottomDisplayCompoments.length === 0) {
        bottomDisplayCompoments = undefined;
    }



    // TODO: get condition
    // TODO: isRequired
    // TODO: validation
    // TODO: condition
    // TODO: confidential mode
    // TODO: metadata

    const itemProps: GenericQuestionProps = {
        parentKey: parentKey,
        itemKey: itemKey,
        questionText: questionText,
        questionSubText: subTitle,
        titleClassName: titleClassName,
        helpGroupContent: helpgroup,
        footnoteText: footNoteComp ? localisedStringToMap(footNoteComp.content as LocalizedString[]) : undefined,
        topDisplayCompoments: topDisplayCompoments,
        bottomDisplayCompoments: bottomDisplayCompoments,
    };

    return itemProps;
}


const SingleChoiceAttributeEditor: React.FC<SingleChoiceAttributeEditorProps> = ({
    surveyItem,
    onItemChange,
}) => {

    // console.log(surveyItem)
    const itemProps = surveyItemToGenericProps(surveyItem);
    // console.log(itemProps);

    return (<>
        <p className='font-bold py-2 my-2'>
            <span className='me-1 font-normal text-tiny block'>
                Type:
            </span>
            Single choice
        </p>
        <GenericQuestionPropEditor
            genericProps={
                itemProps
            }
            specificEditGroup={
                {
                    key: 'body',
                    title: 'Response options',
                    icon: <BsBraces />,
                    content: (
                        <div>todo</div>
                    )
                }
            }
            onChange={(newProps) => {

                const newItem = SurveyItems.singleChoice({
                    ...newProps,
                    responseOptions: []
                });
                onItemChange(newItem);
            }}
        />
    </>
    );
};

export default SingleChoiceAttributeEditor;
