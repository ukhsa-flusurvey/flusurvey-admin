export const dateToUtcDayTimestamp = (date: Date): number => {
    return Math.floor(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 1000);
};

export const utcDayTimestampToLocalDate = (value?: string | number): Date | undefined => {
    if (value === undefined || value === null || value === '') {
        return undefined;
    }

    const seconds = typeof value === 'number' ? value : Number(value);
    if (!Number.isFinite(seconds)) {
        return undefined;
    }

    const date = new Date(seconds * 1000);
    if (isNaN(date.getTime())) {
        return undefined;
    }

    return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
};

export const createLocalDate = (year: number, month = 0, day = 1): Date => {
    return new Date(year, month, day);
};
