import { ExpressionArg, LocalizedObject, LocalizedString } from "survey-engine/data_types";

export const getLocalizedString = (translations: LocalizedObject[] | undefined, code: string): string | undefined => {
    if (!translations) { return; }
    const translation = (translations.find(cont => cont.code === code) as LocalizedString);
    if (!translation) {
        return
    }
    return translation.parts.map(p => (p as ExpressionArg).str).join('');
}

export const updateLocalizedString = (localizedString: LocalizedString[], langCode: string, value: string | string[]): LocalizedString[] => {
    const lStringItem = Array.isArray(value) ? { code: langCode, parts: value.map(v => ({ str: v })) } : { code: langCode, parts: [{ str: value }] };
    if (localizedString == undefined) return [lStringItem];
    const updated = [...localizedString];
    const existing = updated.find(ls => ls.code === langCode);
    return existing ? updated.map(ls => ls.code === langCode ? lStringItem : ls) : [...updated, lStringItem];
}
