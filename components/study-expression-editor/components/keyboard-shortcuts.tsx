import React, { useEffect } from 'react';
import { useStudyExpressionEditor } from '../study-expression-editor-context';


const KeyboardShortcuts: React.FC = () => {
    const {
        saveRulesToDisk
    } = useStudyExpressionEditor();

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            // Check if Cmd (metaKey) or Ctrl is pressed along with 'S'
            if ((event.metaKey || event.ctrlKey)) {
                switch (event.key) {
                    case 's':
                        event.preventDefault();
                        saveRulesToDisk()
                        break;
                }

            }
        };

        // Attach the event listener
        document.addEventListener('keydown', handleKeyDown);

        // Cleanup the event listener
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [saveRulesToDisk]);

    return null;
};

export default KeyboardShortcuts;
