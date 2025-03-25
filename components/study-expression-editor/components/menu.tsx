import React from 'react';
import { useStudyExpressionEditor } from '../study-expression-editor-context';
import { Menubar, MenubarContent, MenubarItem, MenubarLabel, MenubarMenu, MenubarRadioGroup, MenubarRadioItem, MenubarSeparator, MenubarShortcut, MenubarSub, MenubarSubContent, MenubarSubTrigger, MenubarTrigger } from '@/components/ui/menubar';
import { toast } from 'sonner';

interface MenuProps {
    onExit: () => void;
}

const Menu: React.FC<MenuProps> = (props) => {
    const {
        mode,
        view,
        sessionId,
        changeMode,
        changeView,
        initNewSession,
        updateCurrentStudyContext,
        sessions,
        saveRulesToDisk,
    } = useStudyExpressionEditor();

    const recentContexts = sessions.map(s => {
        return {
            id: s.id,
            name: s.name,
            lastModified: s.lastModified,
            studyContext: s.studyContext,
        }
    });

    const hasActiveSession = sessionId !== undefined && sessionId !== '';

    const hasRecentContexts = recentContexts.length > 0;

    return (
        <Menubar
            className='rounded-none border-0 border-b px-6'
        >
            <MenubarMenu>
                <MenubarTrigger
                    className='font-bold min-w-[159px] justify-center'
                >
                    Study {mode === 'study-rules' ? 'Rules' : 'Action'} Editor
                </MenubarTrigger>
                <MenubarContent>
                    <MenubarLabel>
                        Editor mode:
                    </MenubarLabel>
                    <MenubarRadioGroup value={mode}>
                        <MenubarRadioItem
                            value={'action'}
                            onClick={() => changeMode('action')}
                        >
                            Study Action
                        </MenubarRadioItem>
                        <MenubarRadioItem
                            value={'study-rules'}
                            onClick={() => changeMode('study-rules')}
                        >
                            Study Rules
                        </MenubarRadioItem>
                    </MenubarRadioGroup>
                </MenubarContent>
            </MenubarMenu>

            <MenubarMenu>
                <MenubarTrigger
                >
                    File
                </MenubarTrigger>
                <MenubarContent>
                    <MenubarItem
                        onClick={() => {
                            if (sessionId) {
                                if (!confirm('Are you sure you want to create a new session? All unsaved changes will be lost.')) {
                                    return;
                                }
                            }
                            initNewSession();
                            changeView('expression-editor');
                        }}
                    >
                        New
                    </MenubarItem>

                    <MenubarSeparator />

                    <MenubarItem
                        onClick={() => {
                            if (sessionId) {
                                if (!confirm('Are you sure you want to open a new session? All unsaved changes will be lost.')) {
                                    return;
                                }
                            }
                            changeView('load-rules-from-disk');
                        }}
                    >
                        Open rules...
                    </MenubarItem>

                    <MenubarItem
                        disabled={!hasActiveSession}
                        onClick={() => {
                            saveRulesToDisk();
                        }}
                    >
                        Save rules to disk <MenubarShortcut>⌘ +  S</MenubarShortcut>
                    </MenubarItem>


                    <MenubarSeparator />

                    <MenubarItem
                        onClick={props.onExit}
                    >
                        Exit editor
                    </MenubarItem>

                </MenubarContent>
            </MenubarMenu>

            {hasActiveSession && <MenubarMenu>
                <MenubarTrigger>
                    Context
                </MenubarTrigger>
                <MenubarContent>
                    {view !== 'context-editor' && <MenubarItem onClick={() => changeView('context-editor')} >
                        Open Context Editor
                    </MenubarItem>}
                    {view === 'context-editor' && <MenubarItem onClick={() => changeView('expression-editor')} >
                        Exit Context Editor
                    </MenubarItem>}
                    <MenubarSeparator />

                    <MenubarSub>
                        <MenubarSubTrigger>Use recent context</MenubarSubTrigger>
                        <MenubarSubContent
                            className='max-h-[300px] overflow-y-auto divide-y '
                        >
                            {!hasRecentContexts && <MenubarItem disabled>No recent contexts</MenubarItem>}
                            {hasRecentContexts && recentContexts.map(s => {
                                return <MenubarItem
                                    className='min-w-[159px]'
                                    key={s.id}
                                    onClick={() => {
                                        updateCurrentStudyContext(s.studyContext);
                                        toast(`Context replaced`);
                                    }}
                                >
                                    <div className='flex flex-col gap-1 w-full'>
                                        <span>
                                            {s.name ? s.name : '(no name)'}
                                        </span>
                                        <span className='text-xs text-muted-foreground text-end'>
                                            {s.lastModified && new Date(s.lastModified).toLocaleString()}
                                        </span>
                                    </div>
                                </MenubarItem>
                            })}
                        </MenubarSubContent>
                    </MenubarSub>

                </MenubarContent>
            </MenubarMenu>}
        </Menubar>
    );
};

export default Menu;
