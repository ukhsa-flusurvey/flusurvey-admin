import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarRadioGroup, MenubarRadioItem, MenubarSeparator, MenubarShortcut, MenubarTrigger } from '@/components/ui/menubar';
import React from 'react';
import { EditorMode } from './types';

interface SurveyEditorMenuProps {
    currentEditorMode: EditorMode;
    onChangeMode: (mode: EditorMode) => void;
    onSave: () => void;
    onOpen: () => void;
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
                <MenubarContent>
                    <MenubarRadioGroup value={props.currentEditorMode}>
                        <MenubarRadioItem
                            value='document'
                            onClick={() => props.onChangeMode('document')}
                        >
                            Document <MenubarShortcut>⌘ + 1</MenubarShortcut>
                        </MenubarRadioItem>
                        <MenubarRadioItem
                            value='itemEditor'
                            onClick={() => props.onChangeMode('itemEditor')}
                        >
                            Item Editor <MenubarShortcut>⌘ + 2</MenubarShortcut>
                        </MenubarRadioItem>
                        <MenubarRadioItem
                            value='advanced'
                            onClick={() => props.onChangeMode('advanced')}
                        >
                            Advanced <MenubarShortcut>⌘ + 3</MenubarShortcut>
                        </MenubarRadioItem>
                        <MenubarSeparator />
                        <MenubarRadioItem
                            value='simulator'
                            onClick={() => props.onChangeMode('simulator')}
                        >
                            Simulator <MenubarShortcut>⌘ + 4</MenubarShortcut>
                        </MenubarRadioItem>
                    </MenubarRadioGroup>
                </MenubarContent>
            </MenubarMenu>

            <MenubarMenu>
                <MenubarTrigger>File</MenubarTrigger>
                <MenubarContent>
                    <MenubarItem onClick={props.onOpen}>
                        Open... <MenubarShortcut>⌘ +  O</MenubarShortcut>
                    </MenubarItem>
                    <MenubarItem onClick={props.onSave}>
                        Save <MenubarShortcut>⌘ +  S</MenubarShortcut>
                    </MenubarItem>
                </MenubarContent>
            </MenubarMenu>
        </Menubar>
    );
};

export default SurveyEditorMenu;
