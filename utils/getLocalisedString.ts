import { ExpressionArg, LocalizedObject, LocalizedString } from "survey-engine/data_types";

export const getLocalizedString = (translations: LocalizedObject[] | undefined, code: string): string | undefined => {
    if (!translations) { return; }
    const translation = (translations.find(cont => cont.code === code) as LocalizedString);
    if (!translation) {
        return
    }
    return translation.parts.map(p => (p as ExpressionArg).str).join('');
}

export const updateLocalizedString = (localizedString: LocalizedString[], langCode: string, value: string): LocalizedString[] => {
    if (localizedString == undefined) {
        return [{ code: langCode, parts: [{ str: value }] }];
    }
    const updated = [...localizedString];
    const existing = updated.find(ls => ls.code === langCode);
    if (existing) {
        existing.parts = [{ str: value }];
    } else {
        updated.push({
            code: langCode,
            parts: [{ str: value }]
        });
    }
    return updated;
}
