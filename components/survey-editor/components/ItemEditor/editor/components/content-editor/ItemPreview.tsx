import SurveySingleItemView from '@/components/survey-renderer/SurveySingleItemView/SurveySingleItemView';
import React from 'react';
import { ComponentProperties, Expression, ExpressionArg, ItemGroupComponent, LocalizedObject, LocalizedString, SurveyItem, SurveySingleItem, isItemGroupComponent } from 'survey-engine/data_types';
import SurveyLanguageToggle from '../../../../general/SurveyLanguageToggle';
import { nl } from 'date-fns/locale';
import { SurveyContextProvider } from '@/components/survey-renderer/survey-context';
import { useSurveyEditorCtx } from '@/components/survey-editor/surveyEditorContext';


interface ItemPreviewProps {
    surveyItem: SurveyItem;
}

const dummyResolveItem = (item: SurveySingleItem): SurveySingleItem => {
    const resolvedItem = { ...item };

    resolvedItem.components = resolveComponentGroup(resolvedItem, resolvedItem.components as ItemGroupComponent, false);
    return resolvedItem;
}

const resolveComponentGroup = (parentItem: SurveySingleItem, group?: ItemGroupComponent, rerender?: boolean): ItemGroupComponent => {
    if (!group) {
        return { role: '', items: [] }
    }

    if (!group.order || group.order.name === 'sequential') {
        if (!group.items) {
            console.warn(`this should not be a component group, items is missing or empty: ${parentItem.key} -> ${group.key}/${group.role} `);
            return {
                ...group,
                content: resolveContent(group.content),
                description: resolveContent(group.description),
                displayCondition: undefined // group.displayCondition ? this.evalConditions(group.displayCondition as Expression, parentItem) : undefined,
            }
        }
        return {
            ...group,
            content: resolveContent(group.content),
            description: resolveContent(group.description),
            displayCondition: undefined, // group.displayCondition ? this.evalConditions(group.displayCondition as Expression, parentItem) : undefined,
            items: group.items.map(comp => {
                if (isItemGroupComponent(comp)) {
                    return resolveComponentGroup(parentItem, comp);
                }
                return {
                    ...comp,
                    disabled: undefined, // comp.disabled ? this.evalConditions(comp.disabled as Expression, parentItem) : undefined,
                    displayCondition: undefined, // comp.displayCondition ? this.evalConditions(comp.displayCondition as Expression, parentItem) : undefined,
                    content: resolveContent(comp.content),
                    description: resolveContent(comp.description),
                    properties: resolveComponentProperties(comp.properties),
                }
            }),
        }
    }
    if (rerender) {
        console.error('define how to deal with rerendering - order should not change');
    }
    console.error('order type not implemented: ', group.order.name);
    return {
        ...group
    }
}

const resolveContent = (contents: LocalizedObject[] | undefined): LocalizedObject[] | undefined => {
    if (!contents) { return; }

    return contents.map(cont => {
        if ((cont as LocalizedString).parts && (cont as LocalizedString).parts.length > 0) {
            const resolvedContents = (cont as LocalizedString).parts.map(
                p => {
                    if (typeof (p) === 'string' || typeof (p) === "number") {
                        // should not happen - only after resolved content is generated
                        return p
                    }
                    switch (p.dtype) {
                        case 'exp':
                            return '<dynamic value>';
                        case 'num':
                            return p.num;
                        default:
                            return p.str;
                    }
                }
            );
            return {
                code: cont.code,
                parts: resolvedContents,
                resolvedText: resolvedContents.join(''),
            }
        }
        return {
            ...cont
        }
    })
}

const resolveComponentProperties = (props: ComponentProperties | undefined): ComponentProperties | undefined => {
    if (!props) { return; }

    const resolvedProps = { ...props };
    if (resolvedProps.min) {
        const arg = expressionArgParser(resolvedProps.min as ExpressionArg);
        resolvedProps.min = isExpression(arg) ? undefined : arg as number;
    } if (resolvedProps.max) {
        const arg = expressionArgParser(resolvedProps.max as ExpressionArg);
        resolvedProps.max = isExpression(arg) ? undefined : arg as number;
    }
    if (resolvedProps.stepSize) {
        const arg = expressionArgParser(resolvedProps.stepSize as ExpressionArg);
        resolvedProps.stepSize = isExpression(arg) ? undefined : arg as number;
    }
    if (resolvedProps.dateInputMode) {
        const arg = expressionArgParser(resolvedProps.dateInputMode as ExpressionArg);
        resolvedProps.dateInputMode = isExpression(arg) ? 'exp' : arg as string;
    }
    return resolvedProps;
}

const isExpression = (value: unknown): value is Expression => {
    return typeof (value) === 'object' && (value as Expression).name !== undefined && (value as Expression).name.length > 0;
}

export const expressionArgParser = (arg: ExpressionArg): number | string | Expression => {
    switch (arg.dtype) {
        case 'num':
            return arg.num !== undefined ? arg.num : 0;
        case 'str':
            return arg.str || '';
        case 'exp':
            return arg.exp || {
                name: 'unknown',
                data: []
            };
        default:
            return arg.str || '';
    }
}

const ItemPreview: React.FC<ItemPreviewProps> = (props) => {
    const { selectedLanguage } = useSurveyEditorCtx();

    return (
        <div className='max-w-[832px] mx-auto py-4 space-y-4 survey'>
            <div className='flex justify-end'>
                <SurveyLanguageToggle />
            </div>

            <div className='border border-neutral-200 p-4 bg-white shadow-md rounded-sm'>
                <SurveyContextProvider
                    onRunExternalHandler={undefined}
                >
                    <SurveySingleItemView
                        renderItem={dummyResolveItem(props.surveyItem as SurveySingleItem)}
                        languageCode={selectedLanguage}
                        responseChanged={() => { }}
                        invalidWarning={'invalid warning'}
                        showInvalid={false}
                        showKeys={false}
                        dateLocales={[{
                            code: 'nl', locale: nl, format: 'PPP'
                        }]}
                    />
                </SurveyContextProvider>
            </div>
        </div>

    );
};

export default ItemPreview;
