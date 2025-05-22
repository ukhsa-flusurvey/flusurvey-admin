import { ItemComponent, SurveyItem, SurveySingleItem, ItemGroupComponent, isItemGroupComponent, LocalizedObject, ComponentProperties, SurveyGroupItem, Expression } from "survey-engine/data_types"
import { ItemComponentRole } from "../../../types"
import { ItemTypeKey } from "@/components/survey-editor/utils/utils";
import { generateNewItemForType } from "@/components/survey-editor/utils/new-item-init";

export enum SurveyItemFeatures {
    EditorItemColor = 'editorItemColor',
    ComponentOrdering = 'componentOrdering',
    Title = 'title',
    Subtitle = 'subtitle',
    HelpGroup = 'helpGroup',
    TopContent = 'topContent',
    BottomContent = 'bottomContent',
    Footnote = 'footnote',
    DisplayCondition = 'displayCondition',
    ResponseGroup = 'responseGroup',
    MarkdownTexts = 'markdownTexts',
    ErrorTexts = 'errorTexts',
    WarningTexts = 'warningTexts',
    SimpleTexts = 'simpleTexts',
    ChoiceOptions = 'choiceOptions',
    InputLabel = 'inputLabel',
    InputPlaceholder = 'inputPlaceholder',
    InputProperties = 'inputProperties',
    InputStyling = 'inputStyling',
}

export const surveyItemFeaturesLables: Record<SurveyItemFeatures, string> = {
    [SurveyItemFeatures.Title]: 'Title',
    [SurveyItemFeatures.Subtitle]: 'Subtitle',
    [SurveyItemFeatures.TopContent]: 'Top Content',
    [SurveyItemFeatures.BottomContent]: 'Bottom Content',
    [SurveyItemFeatures.Footnote]: 'Footnote',
    [SurveyItemFeatures.HelpGroup]: 'Help Group',
    [SurveyItemFeatures.EditorItemColor]: 'Editor Item Color',
    [SurveyItemFeatures.ComponentOrdering]: 'Component Ordering',
    [SurveyItemFeatures.DisplayCondition]: 'Display Condition',
    [SurveyItemFeatures.ResponseGroup]: 'Response Options',
    [SurveyItemFeatures.MarkdownTexts]: 'Markdown Text',
    [SurveyItemFeatures.ErrorTexts]: 'Error Texts',
    [SurveyItemFeatures.WarningTexts]: 'Warning Texts',
    [SurveyItemFeatures.SimpleTexts]: 'Simple Texts',
    [SurveyItemFeatures.ChoiceOptions]: "Choice Options",
    [SurveyItemFeatures.InputLabel]: "Input Label",
    [SurveyItemFeatures.InputPlaceholder]: "Input Placeholder",
    [SurveyItemFeatures.InputProperties]: "Input Properties (Min/Max/Step)",
    [SurveyItemFeatures.InputStyling]: "Input Styling (Width)",
}

export const surveyItemFeaturesList: () => Array<SurveyItemFeatures> = () => Object.values(SurveyItemFeatures);

export const possibleSurveyItemFeatureConversions: Record<SurveyItemFeatures, SurveyItemFeatures[]> = {
    [SurveyItemFeatures.Title]: [SurveyItemFeatures.Title, SurveyItemFeatures.Subtitle, SurveyItemFeatures.Footnote],
    [SurveyItemFeatures.Subtitle]: [SurveyItemFeatures.Subtitle, SurveyItemFeatures.Title, SurveyItemFeatures.Footnote],
    [SurveyItemFeatures.TopContent]: [SurveyItemFeatures.TopContent, SurveyItemFeatures.BottomContent],
    [SurveyItemFeatures.BottomContent]: [SurveyItemFeatures.BottomContent, SurveyItemFeatures.TopContent],
    [SurveyItemFeatures.Footnote]: [SurveyItemFeatures.Footnote, SurveyItemFeatures.Title, SurveyItemFeatures.Subtitle],
    [SurveyItemFeatures.HelpGroup]: [SurveyItemFeatures.HelpGroup],
    [SurveyItemFeatures.EditorItemColor]: [SurveyItemFeatures.EditorItemColor],
    [SurveyItemFeatures.ComponentOrdering]: [SurveyItemFeatures.ComponentOrdering],
    [SurveyItemFeatures.DisplayCondition]: [SurveyItemFeatures.DisplayCondition],
    [SurveyItemFeatures.ResponseGroup]: [SurveyItemFeatures.ResponseGroup],
    [SurveyItemFeatures.MarkdownTexts]: [SurveyItemFeatures.MarkdownTexts],
    [SurveyItemFeatures.ErrorTexts]: [SurveyItemFeatures.ErrorTexts],
    [SurveyItemFeatures.WarningTexts]: [SurveyItemFeatures.WarningTexts],
    [SurveyItemFeatures.SimpleTexts]: [SurveyItemFeatures.SimpleTexts],
    [SurveyItemFeatures.ChoiceOptions]: [SurveyItemFeatures.ChoiceOptions],
    [SurveyItemFeatures.InputLabel]: [SurveyItemFeatures.InputLabel, SurveyItemFeatures.InputPlaceholder, SurveyItemFeatures.Title, SurveyItemFeatures.Subtitle, SurveyItemFeatures.Footnote],
    [SurveyItemFeatures.InputPlaceholder]: [SurveyItemFeatures.InputPlaceholder, SurveyItemFeatures.InputLabel, SurveyItemFeatures.Title, SurveyItemFeatures.Subtitle, SurveyItemFeatures.Footnote],
    [SurveyItemFeatures.InputProperties]: [SurveyItemFeatures.InputProperties],
    [SurveyItemFeatures.InputStyling]: [SurveyItemFeatures.InputStyling],
}

const commonSurveyItemFeatures = [
    SurveyItemFeatures.Title,
    SurveyItemFeatures.Subtitle,
    SurveyItemFeatures.TopContent,
    SurveyItemFeatures.BottomContent,
    SurveyItemFeatures.Footnote,
    SurveyItemFeatures.HelpGroup,
    SurveyItemFeatures.DisplayCondition,
    SurveyItemFeatures.ResponseGroup,
];

export const supportedSurveyItemFeaturesByType: Record<ItemTypeKey, SurveyItemFeatures[]> = {
    'custom': [],
    'pageBreak': [],
    'surveyEnd': [],
    'group': [SurveyItemFeatures.ComponentOrdering, SurveyItemFeatures.DisplayCondition],
    'display': [SurveyItemFeatures.DisplayCondition, SurveyItemFeatures.MarkdownTexts, SurveyItemFeatures.ErrorTexts, SurveyItemFeatures.WarningTexts, SurveyItemFeatures.SimpleTexts],
    'singleChoice': [...commonSurveyItemFeatures, SurveyItemFeatures.ChoiceOptions],
    'multipleChoice': [...commonSurveyItemFeatures, SurveyItemFeatures.ChoiceOptions],
    'dropdown': [...commonSurveyItemFeatures, SurveyItemFeatures.ChoiceOptions, SurveyItemFeatures.InputLabel, SurveyItemFeatures.InputPlaceholder],
    'textInput': [...commonSurveyItemFeatures, SurveyItemFeatures.InputLabel, SurveyItemFeatures.InputPlaceholder, SurveyItemFeatures.InputStyling],
    'timeInput': [...commonSurveyItemFeatures, SurveyItemFeatures.InputLabel],
    'dateInput': [...commonSurveyItemFeatures, SurveyItemFeatures.InputLabel, SurveyItemFeatures.InputPlaceholder],
    'numericInput': [...commonSurveyItemFeatures, SurveyItemFeatures.InputLabel, SurveyItemFeatures.InputPlaceholder, SurveyItemFeatures.InputProperties, SurveyItemFeatures.InputStyling],
    'sliderNumeric': [...commonSurveyItemFeatures, SurveyItemFeatures.InputLabel, SurveyItemFeatures.InputPlaceholder, SurveyItemFeatures.InputProperties],
    'codeValidator': [...commonSurveyItemFeatures, SurveyItemFeatures.InputLabel],
    'matrix': [...commonSurveyItemFeatures],
    'responsiveMatrix': [...commonSurveyItemFeatures],
    'responsiveBipolarLikertScaleArray': [...commonSurveyItemFeatures, SurveyItemFeatures.ChoiceOptions],
    'responsiveSingleChoiceArray': [...commonSurveyItemFeatures, SurveyItemFeatures.ChoiceOptions],
    'clozeQuestion': [...commonSurveyItemFeatures],
    'consent': [...commonSurveyItemFeatures, SurveyItemFeatures.InputLabel],
    'validatedRandomQuestion': [...commonSurveyItemFeatures],
    'contact': [...commonSurveyItemFeatures, SurveyItemFeatures.InputLabel],
}


const findItemComponentsWithRole = (surveyItem: SurveySingleItem, role: ItemComponentRole): ItemComponent[] => {
    if (surveyItem.components !== undefined && surveyItem.components.items.length > 0) {
        const matches = surveyItem.components.items.filter(item => {
            return item.role === role;
        });
        return matches;
    } else {
        return [];
    }
}

const applyItemComponentByRole = (surveyItem: SurveySingleItem, role: ItemComponentRole, newComponent: ItemComponent) => {
    if (surveyItem.components !== undefined && surveyItem.components.items.length > 0) {
        surveyItem.components.items = surveyItem.components.items.map(item => {
            if (item.role === role) {
                return newComponent;
            } else {
                return item;
            }
        });
    } else {
        surveyItem.components = {
            items: [newComponent],
            role: ItemComponentRole.Root,
        };
    }
    return surveyItem;
}

const findTextContent = (surveyItem: SurveySingleItem, textType: SurveyItemFeatures.TopContent | SurveyItemFeatures.BottomContent): ItemComponent | undefined => {
    if (surveyItem.components !== undefined && surveyItem.components.items.length > 0) {
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

const findComponentGroup = (surveyItem: SurveySingleItem): ItemGroupComponent | undefined => {
    if (surveyItem.components !== undefined && isItemGroupComponent(surveyItem.components)) {
        return surveyItem.components;
    } else {
        return undefined;
    }
}

const findSCMCOptions = (surveyItem: SurveySingleItem): ItemComponent[] | ItemComponent | undefined => {
    const rg = findItemComponentsWithRole(surveyItem, ItemComponentRole.ResponseGroup);
    const firstRg = rg != undefined ? (Array.isArray(rg) ? rg[0] : rg) as ItemGroupComponent : undefined;
    if (firstRg !== undefined && firstRg.items !== undefined && firstRg.items.length > 0) {
        const cg = firstRg.items.find(item => {
            return item.role === ItemComponentRole.SingleChoiceGroup || item.role === ItemComponentRole.MultipleChoiceGroup || ItemComponentRole.DropdownGroup;
        });
        if (cg != undefined && isItemGroupComponent(cg)) {
            return cg.items;
        }
    }
    return undefined;
}

const findInputLabel = (surveyItem: SurveySingleItem): LocalizedObject[] | undefined => {
    const rgs = findItemComponentsWithRole(surveyItem, ItemComponentRole.ResponseGroup);
    for (const rg of rgs) {
        if (isItemGroupComponent(rg) && rg.items.some((i) => i.content != undefined)) {
            return rg.items.find(i => i.content != undefined)?.content;
        }
    }
    return undefined;
}

const findInputPlaceholder = (surveyItem: SurveySingleItem): LocalizedObject[] | undefined => {
    const rgs = findItemComponentsWithRole(surveyItem, ItemComponentRole.ResponseGroup);
    for (const rg of rgs) {
        if (isItemGroupComponent(rg) && rg.items.some((i) => i.description != undefined)) {
            return rg.items.find(i => i.description != undefined)?.description;
        }
    }
    return undefined;
}

const findInputProperties = (surveyItem: SurveySingleItem): ComponentProperties | undefined => {
    const rgs = findItemComponentsWithRole(surveyItem, ItemComponentRole.ResponseGroup);
    for (const rg of rgs) {
        if (isItemGroupComponent(rg) && rg.items.some((i) => i.properties != undefined)) {
            return rg.items.find(i => i.properties != undefined)?.properties;
        }
    }
    return undefined;
}

const findInputStyling = (surveyItem: SurveySingleItem) => {
    const rgs = findItemComponentsWithRole(surveyItem, ItemComponentRole.ResponseGroup);
    for (const rg of rgs) {
        if (isItemGroupComponent(rg) && rg.items.some((i) => i.style != undefined)) {
            return rg.items.find(i => i.style != undefined)?.style;
        }
    }
    return undefined;
}

export const surveyItemFeatureLookup: Record<SurveyItemFeatures, (surveyItem: SurveyItem) => LocalizedObject[] | ItemComponent[] | Array<{ key: string; value: string; }> | ComponentProperties | ItemComponent | ItemGroupComponent | string | Expression | undefined> = {
    [SurveyItemFeatures.Title]: (surveyItem: SurveyItem) => findItemComponentsWithRole(surveyItem, ItemComponentRole.Title),
    [SurveyItemFeatures.Subtitle]: (surveyItem: SurveyItem) => findItemComponentsWithRole(surveyItem, ItemComponentRole.Subtitle),
    [SurveyItemFeatures.TopContent]: (surveyItem: SurveyItem) => findTextContent(surveyItem, SurveyItemFeatures.TopContent),
    [SurveyItemFeatures.BottomContent]: (surveyItem: SurveyItem) => findTextContent(surveyItem, SurveyItemFeatures.BottomContent),
    [SurveyItemFeatures.Footnote]: (surveyItem: SurveyItem) => findItemComponentsWithRole(surveyItem, ItemComponentRole.Footnote),
    [SurveyItemFeatures.HelpGroup]: (surveyItem: SurveyItem) => findItemComponentsWithRole(surveyItem, ItemComponentRole.HelpGroup),
    [SurveyItemFeatures.EditorItemColor]: (surveyItem: SurveyItem) => surveyItem.metadata?.editorItemColor,
    [SurveyItemFeatures.ComponentOrdering]: (surveyItem: SurveyItem) => findComponentGroup(surveyItem)?.order as Expression | undefined,
    [SurveyItemFeatures.DisplayCondition]: (surveyItem: SurveyItem) => surveyItem.condition as Expression || undefined,
    [SurveyItemFeatures.ResponseGroup]: (surveyItem: SurveyItem) => findItemComponentsWithRole(surveyItem, ItemComponentRole.ResponseGroup),
    [SurveyItemFeatures.MarkdownTexts]: (surveyItem: SurveyItem) => findItemComponentsWithRole(surveyItem, ItemComponentRole.Markdown),
    [SurveyItemFeatures.ErrorTexts]: (surveyItem: SurveyItem) => findItemComponentsWithRole(surveyItem, ItemComponentRole.Error),
    [SurveyItemFeatures.WarningTexts]: (surveyItem: SurveyItem) => findItemComponentsWithRole(surveyItem, ItemComponentRole.Warning),
    [SurveyItemFeatures.SimpleTexts]: (surveyItem: SurveyItem) => findItemComponentsWithRole(surveyItem, ItemComponentRole.TextContent),
    [SurveyItemFeatures.ChoiceOptions]: (surveyItem: SurveyItem) => findSCMCOptions(surveyItem),
    [SurveyItemFeatures.InputLabel]: (surveyItem: SurveyItem) => findInputLabel(surveyItem),
    [SurveyItemFeatures.InputPlaceholder]: (surveyItem: SurveyItem) => findInputPlaceholder(surveyItem),
    [SurveyItemFeatures.InputProperties]: (surveyItem: SurveyItem) => findInputProperties(surveyItem),
    [SurveyItemFeatures.InputStyling]: (surveyItem: SurveyItem) => findInputStyling(surveyItem),
}

export const applySurveyItemFeature: Record<SurveyItemFeatures, (newSurveyItem: SurveyItem, sourceItem: SurveyItem) => SurveyItem> = {
    [SurveyItemFeatures.Title]: (surveyItem: SurveyItem, sourceItem: SurveyItem) => applyItemComponentByRole(surveyItem, ItemComponentRole.Title, surveyItemFeatureLookup[SurveyItemFeatures.Title](sourceItem) as ItemComponent),
    [SurveyItemFeatures.Subtitle]: (surveyItem: SurveyItem, sourceItem: SurveyItem) => applyItemComponentByRole(surveyItem, ItemComponentRole.Subtitle, surveyItemFeatureLookup[SurveyItemFeatures.Subtitle](sourceItem) as ItemComponent),
    [SurveyItemFeatures.TopContent]: (surveyItem: SurveyItem, sourceItem: SurveyItem) => applyItemComponentByRole(surveyItem, ItemComponentRole.TextContent, surveyItemFeatureLookup[SurveyItemFeatures.TopContent](sourceItem) as ItemComponent),
    [SurveyItemFeatures.BottomContent]: (surveyItem: SurveyItem, sourceItem: SurveyItem) => applyItemComponentByRole(surveyItem, ItemComponentRole.TextContent, surveyItemFeatureLookup[SurveyItemFeatures.BottomContent](sourceItem) as ItemComponent),
    [SurveyItemFeatures.Footnote]: (surveyItem: SurveyItem, sourceItem: SurveyItem) => applyItemComponentByRole(surveyItem, ItemComponentRole.Footnote, surveyItemFeatureLookup[SurveyItemFeatures.Footnote](sourceItem) as ItemComponent),
    [SurveyItemFeatures.HelpGroup]: (surveyItem: SurveyItem, sourceItem: SurveyItem) => applyItemComponentByRole(surveyItem, ItemComponentRole.HelpGroup, surveyItemFeatureLookup[SurveyItemFeatures.HelpGroup](sourceItem) as ItemComponent),
    [SurveyItemFeatures.EditorItemColor]: (surveyItem: SurveyItem, sourceItem: SurveyItem) => {
        surveyItem.metadata = {
            ...surveyItem.metadata,
            editorItemColor: surveyItemFeatureLookup[SurveyItemFeatures.EditorItemColor](sourceItem) as string,
        }
        return sourceItem;
    },
    [SurveyItemFeatures.ComponentOrdering]: (surveyItem: SurveySingleItem, sourceItem: SurveyItem) => {
        if (surveyItem.components !== undefined && isItemGroupComponent(surveyItem.components)) {
            const order = surveyItemFeatureLookup[SurveyItemFeatures.ComponentOrdering](sourceItem) as Expression;
            surveyItem.components.order = order;
            return surveyItem;
        } else {
            return surveyItem;
        }
    },
    [SurveyItemFeatures.DisplayCondition]: (surveyItem: SurveySingleItem, sourceItem: SurveyItem) => {
        surveyItem.condition = surveyItemFeatureLookup[SurveyItemFeatures.DisplayCondition](sourceItem) as Expression;
        return surveyItem;
    },
    [SurveyItemFeatures.ResponseGroup]: (surveyItem: SurveySingleItem, sourceItem: SurveyItem) => applyItemComponentByRole(surveyItem, ItemComponentRole.ResponseGroup, (surveyItemFeatureLookup[SurveyItemFeatures.ResponseGroup](sourceItem) as ItemComponent[])[0]),
    [SurveyItemFeatures.MarkdownTexts]: (surveyItem: SurveySingleItem, sourceItem: SurveyItem) => {
        const markdown = surveyItemFeatureLookup[SurveyItemFeatures.MarkdownTexts](sourceItem) as ItemComponent[];
        if (surveyItem.components !== undefined && isItemGroupComponent(surveyItem.components)) {
            surveyItem.components.items = surveyItem.components.items.filter(item => item.role !== ItemComponentRole.Markdown);
            surveyItem.components.items.push(...markdown);
        }
        return surveyItem;
    },
    [SurveyItemFeatures.ErrorTexts]: (surveyItem: SurveySingleItem, sourceItem: SurveyItem) => {
        const error = surveyItemFeatureLookup[SurveyItemFeatures.ErrorTexts](sourceItem) as ItemComponent[];
        if (surveyItem.components !== undefined && isItemGroupComponent(surveyItem.components)) {
            surveyItem.components.items = surveyItem.components.items.filter(item => item.role !== ItemComponentRole.Error);
            surveyItem.components.items.push(...error);
        }
        return surveyItem;
    },
    [SurveyItemFeatures.WarningTexts]: (surveyItem: SurveySingleItem, sourceItem: SurveyItem) => {
        const warning = surveyItemFeatureLookup[SurveyItemFeatures.WarningTexts](sourceItem) as ItemComponent[];
        if (surveyItem.components !== undefined && isItemGroupComponent(surveyItem.components)) {
            surveyItem.components.items = surveyItem.components.items.filter(item => item.role !== ItemComponentRole.Warning);
            surveyItem.components.items.push(...warning);
        }
        return surveyItem;
    },
    [SurveyItemFeatures.SimpleTexts]: (surveyItem: SurveySingleItem, sourceItem: SurveyItem) => {
        const simpleText = surveyItemFeatureLookup[SurveyItemFeatures.SimpleTexts](sourceItem) as ItemComponent[];
        if (surveyItem.components !== undefined && isItemGroupComponent(surveyItem.components)) {
            surveyItem.components.items = surveyItem.components.items.filter(item => item.role !== ItemComponentRole.TextContent);
            surveyItem.components.items.push(...simpleText);
        }
        return surveyItem;
    },
    [SurveyItemFeatures.ChoiceOptions]: (surveyItem: SurveySingleItem, sourceItem: SurveyItem) => {
        const options = surveyItemFeatureLookup[SurveyItemFeatures.ChoiceOptions](sourceItem) as ItemComponent[];
        if (surveyItem.components !== undefined && isItemGroupComponent(surveyItem.components)) {
            surveyItem.components.items = surveyItem.components.items.map(item => {
                if (item.role === ItemComponentRole.ResponseGroup) {
                    const rg = item as ItemGroupComponent;
                    rg.items = rg.items.map(i => {
                        if (i.role === ItemComponentRole.SingleChoiceGroup || i.role === ItemComponentRole.MultipleChoiceGroup || i.role === ItemComponentRole.DropdownGroup) {
                            const cg = i as ItemGroupComponent;
                            cg.items = options;
                            return cg;
                        } else {
                            return i;
                        }
                    });
                    return rg;
                } else {
                    return item;
                }
            });
        }
        return surveyItem;
    },
    [SurveyItemFeatures.InputLabel]: (surveyItem: SurveySingleItem, sourceItem: SurveyItem) => {
        const label = surveyItemFeatureLookup[SurveyItemFeatures.InputLabel](sourceItem) as LocalizedObject[];
        if (surveyItem.components !== undefined && isItemGroupComponent(surveyItem.components)) {
            surveyItem.components.items = surveyItem.components.items.map(item => {
                if (item.role === ItemComponentRole.ResponseGroup) {
                    const rg = item as ItemGroupComponent;
                    rg.items = rg.items.map(i => {
                        i.content = label;
                        return i;
                    });
                    return rg;
                } else {
                    return item;
                }
            });
        }
        return surveyItem;
    },
    [SurveyItemFeatures.InputPlaceholder]: (surveyItem: SurveySingleItem, sourceItem: SurveyItem) => {
        const placeholder = surveyItemFeatureLookup[SurveyItemFeatures.InputPlaceholder](sourceItem) as LocalizedObject[];
        if (surveyItem.components !== undefined && isItemGroupComponent(surveyItem.components)) {
            surveyItem.components.items = surveyItem.components.items.map(item => {
                if (item.role === ItemComponentRole.ResponseGroup) {
                    const rg = item as ItemGroupComponent;
                    rg.items = rg.items.map(i => {
                        i.description = placeholder;
                        return i;
                    });
                    return rg;
                } else {
                    return item;
                }
            });
        }
        return surveyItem;
    },
    [SurveyItemFeatures.InputProperties]: (surveyItem: SurveySingleItem, sourceItem: SurveyItem) => {
        const properties = surveyItemFeatureLookup[SurveyItemFeatures.InputProperties](sourceItem) as ComponentProperties;
        if (surveyItem.components !== undefined && isItemGroupComponent(surveyItem.components)) {
            surveyItem.components.items = surveyItem.components.items.map(item => {
                if (item.role === ItemComponentRole.ResponseGroup) {
                    const rg = item as ItemGroupComponent;
                    rg.items = rg.items.map(i => {
                        i.properties = properties;
                        return i;
                    });
                    return rg;
                } else {
                    return item;
                }
            });
        }
        return surveyItem;
    },
    [SurveyItemFeatures.InputStyling]: (surveyItem: SurveySingleItem, sourceItem: SurveyItem) => {
        const styling = surveyItemFeatureLookup[SurveyItemFeatures.InputStyling](sourceItem) as Array<{ key: string; value: string; }>;
        if (surveyItem.components !== undefined && isItemGroupComponent(surveyItem.components)) {
            surveyItem.components.items = surveyItem.components.items.map(item => {
                if (item.role === ItemComponentRole.ResponseGroup) {
                    const rg = item as ItemGroupComponent;
                    rg.items = rg.items.map(i => {
                        i.style = styling;
                        return i;
                    });
                    return rg;
                } else {
                    return item;
                }
            });
        }
        return surveyItem;
    }
}

export const createAndApplyFeatures = (parentGroup: SurveyGroupItem, sourceItem: SurveyItem, featuresToApply: SurveyItemFeatures[], targetType: ItemTypeKey, targetKey: string) => {
    let newItem = generateNewItemForType({
        itemType: targetType,
        parentGroup: parentGroup,
    });

    if (newItem) {
        // Apply Key
        newItem.key = targetKey;
        // Apply Features
        for (const feature of featuresToApply) {
            newItem = applySurveyItemFeature[feature](newItem, sourceItem);
        }
    }
}
