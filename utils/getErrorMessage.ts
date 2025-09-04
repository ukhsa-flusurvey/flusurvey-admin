export const getErrorMessage = (error: unknown): string => {
    if (error instanceof Error) {
        return error.message || 'Unknown error';
    }
    if (typeof error === 'string') {
        return error;
    }
    if (error && typeof error === 'object') {
        const maybeMessage = (error as { message?: unknown }).message;
        if (typeof maybeMessage === 'string' && maybeMessage.length > 0) {
            return maybeMessage;
        }
        try {
            return JSON.stringify(error);
        } catch {
            return 'Unknown error';
        }
    }
    return 'Unknown error';
};

export default getErrorMessage;

