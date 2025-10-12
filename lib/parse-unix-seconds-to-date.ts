export const parseUnixSecondsToDate = (value?: string): Date | undefined => {
    if (!value) return undefined;
    const seconds = Number(value);
    if (!Number.isFinite(seconds)) return undefined;
    const date = new Date(seconds * 1000);
    if (isNaN(date.getTime())) return undefined;
    return date;
}
