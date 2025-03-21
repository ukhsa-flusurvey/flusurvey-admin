import React from 'react';
import { useStudyExpressionEditor } from '../study-expression-editor-context';

const MainContent: React.FC = () => {
    const { view, mode, sessionId } = useStudyExpressionEditor();

    if (!sessionId) {
        return <p>init new session: new vs open</p>
    }

    switch (view) {
        case 'expression-editor':
            if (mode === 'study-rules') {
                return <p>study rule editor</p>
            } else if (mode === 'action') {
                return <p>study action editor</p>
            }
            return <p>unknown editor mode</p>
        case 'context-editor':
            return <p>ContextEditor</p>
        case 'load-rules-from-disk':
            return <p>Load rules from disk</p>
        default:
            return <p>unknown view</p>
    }

};

export default MainContent;
