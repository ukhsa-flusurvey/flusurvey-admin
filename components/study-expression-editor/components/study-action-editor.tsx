import React from 'react';
import SessionNameEditor from './session-name-editor';
import NoContextHint from './no-context-hint';
import { Card } from '@/components/ui/card';

const StudyActionEditor: React.FC = () => {
    return (
        <div className='p-6'>
            <Card className='p-4 space-y-4'>
                <h3 className='font-bold text-sm'>General</h3>
                <SessionNameEditor />
                <NoContextHint />
            </Card>

        </div>
    );
};

export default StudyActionEditor;
