import { useCallback, useEffect, useState } from "react";

export const useClipboardValue = (): [string | null, () => void, Date | null] => {
    const [clipboardValue, setClipboardValue] = useState<string | null>(null);
    const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

    useEffect(() => {
        const readClipboard = async () => {
            try {
                const text = await navigator.clipboard.readText();
                setClipboardValue(text);
            } catch {
                setClipboardValue(null);
            }
        }
        readClipboard();
    }, [lastUpdate]);

    const updateValue = useCallback(() => {
        setLastUpdate(new Date());
    }, []);

    return [clipboardValue, updateValue, lastUpdate];
}
