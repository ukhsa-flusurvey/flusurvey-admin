import LanguageSelector from '@/components/LanguageSelector';
import SurveySingleItemView from '@/components/survey-viewer/survey-renderer/SurveySingleItemView/SurveySingleItemView';
import React, { useState } from 'react';
import { ItemGroupComponent, LocalizedObject, LocalizedString, SurveyItem, SurveySingleItem, isItemGroupComponent } from 'survey-engine/data_types';


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
                    // properties: resolveComponentProperties(comp.properties),
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
                    return p.dtype === 'exp' ? '<dynamic value>' : p.str
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

const ItemPreview: React.FC<ItemPreviewProps> = (props) => {
    const [selectedLanguage, setSelectedLanguage] = useState(process.env.NEXT_PUBLIC_DEFAULT_LANGUAGE ?? 'en');

    return (
        <div>
            <LanguageSelector onLanguageChange={setSelectedLanguage} />

            <div className='border border-neutral-30 p-4 bg-white infectieradar-nl'>
                <SurveySingleItemView
                    renderItem={dummyResolveItem(props.surveyItem as any)}
                    languageCode={selectedLanguage}
                    responseChanged={() => { }}
                    invalidWarning={''}
                />
            </div>
        </div>

    );
};

export default ItemPreview;
