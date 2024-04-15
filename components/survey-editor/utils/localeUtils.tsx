import { getLocalizedString } from "@/utils/getLocalisedString";
import { ExpressionArg, ItemComponent, ItemGroupComponent, LocalizedObject, LocalizedString, Survey, SurveyGroupItem, SurveyItem, SurveySingleItem } from "survey-engine/data_types";

export const getLocStringLocales = (locString?: LocalizedObject[]): string[] => {
    if (!locString) return [];
    return locString.reduce((acc, cur) => {
        acc.push(cur.code);
        return acc;
    }, [] as string[]);
}

export const checkMissingTranslations = (locString?: LocalizedObject[]): string[] => {
    const expectedLanguages = process.env.NEXT_PUBLIC_SUPPORTED_LOCALES ? process.env.NEXT_PUBLIC_SUPPORTED_LOCALES.split(',') : ['en'];
    const canidateLanguages = getLocStringLocales(locString);
    const availableLangauges = canidateLanguages.filter(lang => {
        const currentLocaleContent = getLocalizedString(locString, lang);
        return currentLocaleContent !== undefined && currentLocaleContent !== '';
    });
    const missingLanguages = expectedLanguages.filter(lang => {
        const t = availableLangauges.includes(lang);
        return !t;
    });
    return missingLanguages;
}


const removeLocaleFromLocString = (locString: LocalizedObject[], localesToRemove: string[]): LocalizedObject[] => {
    return locString.filter((ls) => {
        return !localesToRemove.includes(ls.code);
    });
}

const findLocalesInItemComponent = (component: ItemComponent): string[] => {
    const locales: string[] = [];

    if (component.content) {
        locales.push(...getLocStringLocales(component.content));
    }
    if (component.description) {
        locales.push(...getLocStringLocales(component.description));
    }

    if ((component as ItemGroupComponent).items !== undefined) {
        // process group item
        const groupItem = component as ItemGroupComponent;

        groupItem.items.forEach(item => {
            locales.push(...findLocalesInItemComponent(item));
        });
        return locales;
    }
    return locales;
}

const removeLocalesInItemComponent = (component: ItemComponent, localesToRemove: string[]): ItemComponent => {
    if (component.content) {
        component.content = removeLocaleFromLocString(component.content, localesToRemove);
    }
    if (component.description) {
        component.description = removeLocaleFromLocString(component.description, localesToRemove);
    }

    if ((component as ItemGroupComponent).items !== undefined) {
        // process group item
        const groupItem = component as ItemGroupComponent;

        groupItem.items.map(item => {
            return removeLocalesInItemComponent(item, localesToRemove);
        });
    }
    return component;
}

const findLocalesInSurveyItem = (item: SurveyItem): string[] => {
    if ((item as SurveyGroupItem).items !== undefined) {
        // process group item
        const groupItem = item as SurveyGroupItem;
        const locales: string[] = [];
        groupItem.items.forEach(item => {
            locales.push(...findLocalesInSurveyItem(item));
        });
        return locales;
    } else {
        // process single item
        const locales: string[] = [];

        const singeItem = item as SurveySingleItem;
        if (singeItem.components) {
            locales.push(...findLocalesInItemComponent(singeItem.components));
        }
        return locales;
    }
}

const removeLocalesInSurveyItem = (item: SurveyItem, localesToRemove: string[]): SurveyItem => {
    if ((item as SurveyGroupItem).items !== undefined) {
        // process group item
        const groupItem = item as SurveyGroupItem;
        groupItem.items.map(item => removeLocalesInSurveyItem(item, localesToRemove));
        return groupItem;
    } else {
        // process single item
        const singeItem = item as SurveySingleItem;
        if (singeItem.components) {
            singeItem.components = removeLocalesInItemComponent(singeItem.components, localesToRemove) as ItemGroupComponent;
        }
        return singeItem;
    }
}


export const findAllLocales = (survey: Survey): string[] => {
    const locales: string[] = [];

    const nameLocales = getLocStringLocales(survey.props?.name || []);
    const descriptionLocales = getLocStringLocales(survey.props?.description || []);
    const typicalDurationLocales = getLocStringLocales(survey.props?.typicalDuration || []);

    if (nameLocales.length > 0) {
        locales.push(...nameLocales);
    }
    if (descriptionLocales.length > 0) {
        locales.push(...descriptionLocales);
    }
    if (typicalDurationLocales.length > 0) {
        locales.push(...typicalDurationLocales);
    }

    locales.push(...findLocalesInSurveyItem(survey.surveyDefinition));

    // make unique
    const uniqueLocales = new Set(locales);
    // make list
    return Array.from(uniqueLocales);
}


export const removeLocales = (survey: Survey, locales: string[]): Survey => {
    const newSurvey = { ...survey };

    if (newSurvey.props?.name) {
        newSurvey.props.name = removeLocaleFromLocString(newSurvey.props.name, locales);
    }
    if (newSurvey.props?.description) {
        newSurvey.props.description = removeLocaleFromLocString(newSurvey.props.description, locales);
    }
    if (newSurvey.props?.typicalDuration) {
        newSurvey.props.typicalDuration = removeLocaleFromLocString(newSurvey.props.typicalDuration, locales);
    }

    newSurvey.surveyDefinition = removeLocalesInSurveyItem(newSurvey.surveyDefinition, locales) as SurveyGroupItem;
    return newSurvey;
}


export const renameLocales = (survey: Survey, oldLoc: string, newLoc: string): Survey => {
    const surveyJSON = JSON.stringify(survey);
    const newSurveyJSON = surveyJSON.replaceAll(
        `"${oldLoc}"`,
        `"${newLoc}"`
    );
    const newSurvey = JSON.parse(newSurveyJSON) as Survey;
    return newSurvey;
}

export const localisedObjectToMap = (loc?: LocalizedObject[]): Map<string, string> => {
    const map = new Map<string, string>();
    if (!loc) return map;
    loc.forEach((item) => {
        map.set(item.code, (item as LocalizedString).parts.map(p => (p as ExpressionArg).str).join(''));
    });
    return map;
}
