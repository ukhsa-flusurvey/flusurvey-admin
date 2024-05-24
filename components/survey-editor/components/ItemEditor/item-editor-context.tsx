import { createContext } from "react";

export const ItemEditorContext = createContext<{
    selectedItemKey: string | null,
    setSelectedItemKey: (key: string | null) => void,
    currentPath: string | null,
    setCurrentPath: (path: string | null) => void,

}>({
    selectedItemKey: null,
    setSelectedItemKey: () => { },
    currentPath: null,
    setCurrentPath: () => { },
});
