export type ClipboardEnvelope<TType extends string, TData> = {
    createdAt: string;
    type: TType;
    version: 1;
    data: TData;
};

export const createEnvelope = <TType extends string, TData>(type: TType, data: TData): ClipboardEnvelope<TType, TData> => {
    return {
        createdAt: new Date().toISOString(),
        type,
        version: 1,
        data,
    };
};

export const isEnvelope = (value: unknown): value is ClipboardEnvelope<string, unknown> => {
    if (!value || typeof value !== 'object') return false;
    const v = value as Record<string, unknown>;
    return v.__caseClipboard === true && typeof v.type === 'string' && v.version === 1 && 'data' in v;
};

export const decodeEnvelope = <TType extends string, TData>(text: string, expectedType: TType): TData | null => {
    try {
        const parsed = JSON.parse(text);
        if (!isEnvelope(parsed)) return null;
        if (parsed.type !== expectedType) return null;
        return parsed.data as TData;
    } catch {
        return null;
    }
};


