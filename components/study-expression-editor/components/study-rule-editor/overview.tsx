import React from 'react';
import { useStudyExpressionEditor } from '../../study-expression-editor-context';
import { Card } from '@/components/ui/card';
import SessionNameEditor from '../session-name-editor';
import NoContextHint from '../no-context-hint';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { DownloadIcon, MoreVerticalIcon, UploadIcon } from 'lucide-react';
import LoadRulesFromDisk from './load-rules-from-disk';
import SectionCard from './section-card';

const Overview: React.FC = () => {
    const [openLoadRulesDialog, setOpenLoadRulesDialog] = React.useState(false);
    const {
        currentRules,
        saveRulesToDisk,
        currentStudyContext,
    } = useStudyExpressionEditor();

    return (
        <div className='p-6 space-y-6 overflow-y-auto @container'>
            <Card className='p-4 space-y-4'>
                <h3 className='font-bold text-sm flex justify-between gap-4'>
                    <span>General</span>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant={'outline'}
                                size={'sm'}
                            >
                                <span>Options</span>
                                <MoreVerticalIcon className='size-4' />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align='end'>
                            <DropdownMenuItem
                                disabled={!currentRules}
                                onClick={saveRulesToDisk}
                            >
                                <DownloadIcon className='mr-2 size-4' />
                                Export study rules to file
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={() => setOpenLoadRulesDialog(true)}
                            >
                                <UploadIcon className='mr-2 size-4' />
                                Open study rules from file
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </h3>
                <SessionNameEditor />
                <NoContextHint />
            </Card>

            <div className='grid grid-cols-1 gap-4 @2xl:grid-cols-2 @6xl:grid-cols-2 pb-12'>
                <SectionCard
                    title='Entry event handler'
                    description='Rules applied when a participant enters the study'
                />

                <SectionCard
                    title='Survey submission handlers'
                    description='Rules applied when a participant submits a survey'
                    count={1}

                    keySuggestions={currentStudyContext?.surveyKeys ?? []}
                    usedKeys={[]}
                    onAddNewEntry={() => { }}
                />

                <SectionCard
                    title='Custom event handlers'
                    description='Rules applied when a custom study event is triggered'
                    count={1}

                    keySuggestions={currentStudyContext?.customEventKeys ?? []}
                    usedKeys={[]}
                    onAddNewEntry={(key?: string) => {
                        console.log(key)
                    }}
                />

                <SectionCard
                    title='Timer event handlers'
                    description='Rules executed on study timer event'
                    count={1}

                    keySuggestions={[]}
                    usedKeys={[]}
                    addWithoutKey={true}
                    onAddNewEntry={() => { }}
                />

                <SectionCard
                    title='Merge event handler'
                    description='Rules for when a temporary participant is merged into an active participant'
                />
            </div>

            <LoadRulesFromDisk
                open={openLoadRulesDialog}
                onClose={() => setOpenLoadRulesDialog(false)}
            />
        </div>
    );
};

export default Overview;
