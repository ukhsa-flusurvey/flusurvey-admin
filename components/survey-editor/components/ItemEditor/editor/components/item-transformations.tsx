import { ItemComponent, SurveyItem, SurveySingleItem, isSurveyGroupItem, ItemGroupComponent, isItemGroupComponent } from "survey-engine/data_types"
import { ItemComponentRole } from "../../../types"
import { Expression } from "fuse.js";

export const enum SurveyItemFeatures {
    EditorItemColor = 'editorItemColor',
    ItemKey = 'itemKey',
    ComponentOrdering = 'componentOrdering',
    Title = 'title',
    Subtitle = 'subtitle',
    HelpGroup = 'helpGroup',
    TopContent = 'topContent',
    BottomContent = 'bottomContent',
    Footnote = 'footnote',
    DisplayCondition = 'displayCondition',
    ResponseGroup = 'responseGroup',
    MarkdownText = 'markdownText',
}

export const PossibleSurveyItemFeatureConversions: Record<SurveyItemFeatures, SurveyItemFeatures[]> = {
    [SurveyItemFeatures.Title]: [SurveyItemFeatures.Title, SurveyItemFeatures.Subtitle, SurveyItemFeatures.Footnote],
    [SurveyItemFeatures.Subtitle]: [SurveyItemFeatures.Subtitle, SurveyItemFeatures.Title, SurveyItemFeatures.Footnote],
    [SurveyItemFeatures.TopContent]: [SurveyItemFeatures.TopContent, SurveyItemFeatures.BottomContent],
    [SurveyItemFeatures.BottomContent]: [SurveyItemFeatures.BottomContent, SurveyItemFeatures.TopContent],
    [SurveyItemFeatures.Footnote]: [SurveyItemFeatures.Footnote, SurveyItemFeatures.Title, SurveyItemFeatures.Subtitle],
    [SurveyItemFeatures.HelpGroup]: [SurveyItemFeatures.HelpGroup],
    [SurveyItemFeatures.EditorItemColor]: [SurveyItemFeatures.EditorItemColor],
    [SurveyItemFeatures.ItemKey]: [SurveyItemFeatures.ItemKey],
    [SurveyItemFeatures.ComponentOrdering]: [SurveyItemFeatures.ComponentOrdering],
    [SurveyItemFeatures.DisplayCondition]: [SurveyItemFeatures.DisplayCondition],
    [SurveyItemFeatures.ResponseGroup]: [SurveyItemFeatures.ResponseGroup],
    [SurveyItemFeatures.MarkdownText]: [SurveyItemFeatures.MarkdownText]
}

declare const isSurveySingleItem: (item: SurveyItem) => item is SurveySingleItem;


const surveySingleItemFindItemComponentWithRole = (surveyItem: SurveyItem, role: ItemComponentRole): ItemComponent | undefined => {
    if (isSurveySingleItem(surveyItem) && surveyItem.components !== undefined && surveyItem.components.items.length > 0) {
        return surveyItem.components.items.find(item => {
            return item.role === role;
        });
    } else {
        return undefined;
    }
}

const singleSurveyItemFindTextContent = (surveyItem: SurveyItem, textType: SurveyItemFeatures.TopContent | SurveyItemFeatures.BottomContent): ItemComponent | undefined => {
    if (isSurveySingleItem(surveyItem) && surveyItem.components !== undefined && surveyItem.components.items.length > 0) {
        const rgIndex = surveyItem.components.items.findIndex(item => {
            return item.role === ItemComponentRole.ResponseGroup;
        });
        const beforeResponseGroup = surveyItem.components.items.slice(0, rgIndex);
        const afterResponseGroup = surveyItem.components.items.slice(rgIndex + 1);
        const relevantGroupSlice = textType === SurveyItemFeatures.TopContent ? beforeResponseGroup : afterResponseGroup;
        return relevantGroupSlice.find(item => {
            return item.role === ItemComponentRole.TextContent;
        });
    } else {
        return undefined;
    }
}

const singleSurveyItemFindComponentGroup = (surveyItem: SurveyItem): ItemGroupComponent | undefined => {
    if (isSurveySingleItem(surveyItem) && surveyItem.components !== undefined && isItemGroupComponent(surveyItem.components)) {
        return surveyItem.components;
    } else {
        return undefined;
    }
}

export const surveyItemFeatureLookup: Record<SurveyItemFeatures, (surveyItem: SurveyItem) => ItemComponent | ItemGroupComponent | string | Expression | undefined> = {
    [SurveyItemFeatures.Title]: (surveyItem: SurveyItem) => surveySingleItemFindItemComponentWithRole(surveyItem, ItemComponentRole.Title),
    [SurveyItemFeatures.Subtitle]: (surveyItem: SurveyItem) => surveySingleItemFindItemComponentWithRole(surveyItem, ItemComponentRole.Subtitle),
    [SurveyItemFeatures.TopContent]: (surveyItem: SurveyItem) => singleSurveyItemFindTextContent(surveyItem, SurveyItemFeatures.TopContent),
    [SurveyItemFeatures.BottomContent]: (surveyItem: SurveyItem) => singleSurveyItemFindTextContent(surveyItem, SurveyItemFeatures.BottomContent),
    [SurveyItemFeatures.Footnote]: (surveyItem: SurveyItem) => surveySingleItemFindItemComponentWithRole(surveyItem, ItemComponentRole.Footnote),
    [SurveyItemFeatures.HelpGroup]: (surveyItem: SurveyItem) => surveySingleItemFindItemComponentWithRole(surveyItem, ItemComponentRole.HelpGroup),
    [SurveyItemFeatures.EditorItemColor]: (surveyItem: SurveyItem) => surveyItem.metadata?.editorItemColor,
    [SurveyItemFeatures.ItemKey]: (surveyItem: SurveyItem) => surveyItem.key,
    [SurveyItemFeatures.ComponentOrdering]: (surveyItem: SurveyItem) => singleSurveyItemFindComponentGroup(surveyItem)?.order as Expression | undefined,
    [SurveyItemFeatures.DisplayCondition]: (surveyItem: SurveyItem) => surveyItem.condition as Expression || undefined,
    [SurveyItemFeatures.ResponseGroup]: (surveyItem: SurveyItem) => surveySingleItemFindItemComponentWithRole(surveyItem, ItemComponentRole.ResponseGroup),
    [SurveyItemFeatures.MarkdownText]: (surveyItem: SurveyItem) => surveySingleItemFindItemComponentWithRole(surveyItem, ItemComponentRole.Markdown),
}