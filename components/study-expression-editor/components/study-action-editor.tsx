import React from 'react';
import SessionNameEditor from './session-name-editor';
import NoContextHint from './no-context-hint';
import { Card } from '@/components/ui/card';
import LoadRulesFromDisk from './study-rule-editor/load-rules-from-disk';
import { Button } from '@/components/ui/button';

const StudyActionEditor: React.FC = () => {
    const [openLoadContextDialog, setOpenLoadContextDialog] = React.useState(false);

    return (
        <div className='p-6'>
            <Card className='p-4 space-y-4'>
                <h3 className='font-bold text-sm'>General</h3>
                <SessionNameEditor />
                <NoContextHint />
            </Card>

            <Button
                onClick={() => setOpenLoadContextDialog(true)}
            >
                Load rules from disk
            </Button>

            <LoadRulesFromDisk
                open={openLoadContextDialog}
                onClose={() => setOpenLoadContextDialog(false)}
            />
        </div>
    );
};

export default StudyActionEditor;
