import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarRadioGroup, MenubarRadioItem, MenubarSeparator, MenubarShortcut, MenubarTrigger } from '@/components/ui/menubar';
import React from 'react';
import { EditorMode } from './types';

interface SurveyEditorMenuProps {
    currentEditorMode: EditorMode;
    noSurveyOpen: boolean;
    onChangeMode: (mode: EditorMode) => void;
    onSave: () => void;
    onOpen: () => void;
    onNew: () => void;
}

const SurveyEditorMenu: React.FC<SurveyEditorMenuProps> = (props) => {
    return (
        <Menubar
            className='rounded-none px-6 border-0 border-b border-black/20'
        >
            <MenubarMenu>
                <MenubarTrigger
                    className='font-bold'
                >
                    Survey Editor
                </MenubarTrigger>
            </MenubarMenu>

            <MenubarMenu>
                <MenubarTrigger>File</MenubarTrigger>
                <MenubarContent>
                    <MenubarItem onClick={props.onNew}>
                        New...
                    </MenubarItem>
                    <MenubarSeparator />
                    <MenubarItem onClick={props.onOpen}>
                        Open... <MenubarShortcut>⌘ +  O</MenubarShortcut>
                    </MenubarItem>
                    <MenubarItem
                        onClick={props.onSave}
                        disabled={props.noSurveyOpen}
                    >
                        Save <MenubarShortcut>⌘ +  S</MenubarShortcut>
                    </MenubarItem>
                </MenubarContent>
            </MenubarMenu>

            <MenubarMenu>
                <MenubarTrigger>
                    View
                </MenubarTrigger>
                <MenubarContent>
                    <MenubarRadioGroup value={props.currentEditorMode}>
                        <MenubarRadioItem
                            disabled={props.noSurveyOpen}
                            value='document'
                            onClick={() => props.onChangeMode('document')}
                        >
                            Document <MenubarShortcut>⌘ + 1</MenubarShortcut>
                        </MenubarRadioItem>
                        <MenubarRadioItem
                            disabled={props.noSurveyOpen}
                            value='itemEditor'
                            onClick={() => props.onChangeMode('itemEditor')}
                        >
                            Item Editor <MenubarShortcut>⌘ + 2</MenubarShortcut>
                        </MenubarRadioItem>
                        <MenubarRadioItem
                            disabled={props.noSurveyOpen}
                            value='advanced'
                            onClick={() => props.onChangeMode('advanced')}
                        >
                            Advanced <MenubarShortcut>⌘ + 3</MenubarShortcut>
                        </MenubarRadioItem>
                        <MenubarSeparator />
                        <MenubarRadioItem
                            disabled={props.noSurveyOpen}
                            value='simulator'
                            onClick={() => props.onChangeMode('simulator')}
                        >
                            Simulator <MenubarShortcut>⌘ + 4</MenubarShortcut>
                        </MenubarRadioItem>
                    </MenubarRadioGroup>
                </MenubarContent>
            </MenubarMenu>
        </Menubar>
    );
};

export default SurveyEditorMenu;
