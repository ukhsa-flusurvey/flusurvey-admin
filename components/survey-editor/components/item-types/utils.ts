import { ExpressionArg, LocalizedString } from "survey-engine/data_types";

export const localisedStringToMap = (loc?: LocalizedString[]): Map<string, string> => {
    const map = new Map<string, string>();
    if (!loc) return map;
    loc.forEach((item) => {
        map.set(item.code, item.parts.map(p => (p as ExpressionArg).str).join(''));
    });
    return map;
}
