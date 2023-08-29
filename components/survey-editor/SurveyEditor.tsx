'use client';

import React from 'react';
import { Sidebar, SidebarItem } from '../Sidebar';
import { BsArrowLeft, BsBoxArrowLeft, BsCardHeading, BsCloudUpload, BsFilePlay, BsFolder, BsGit, BsList, BsListUl } from 'react-icons/bs';
import { Divider } from '@nextui-org/react';

interface SurveyEditorProps {
}

const editorModes = [
    'file',
    'props',
    'items',
    'preview',
    'publish',
];

const SurveyEditor: React.FC<SurveyEditorProps> = (props) => {
    const [mode, setMode] = React.useState(editorModes[0]);


    const onExit = () => {
        if (confirm('Unsaved, unexported or unpublished content will be lost. Are you sure you want to exit the survey editor?')) {
            console.log('todo: call onExit callback')
        }
    }


    return (
        <div className='relative'>
            <div className='fixed inset-y-0'>
                <Sidebar>
                    <SidebarItem
                        tooltip='File import/export'
                        isActive={mode === editorModes[0]}
                        onPress={() => {
                            setMode(editorModes[0]);
                        }}
                    >
                        <BsFolder />
                    </SidebarItem>
                    <SidebarItem
                        tooltip='Survey properties'
                        isActive={mode === editorModes[1]}
                        onPress={() => {
                            setMode(editorModes[1]);
                        }}
                    >
                        <BsCardHeading />
                    </SidebarItem>

                    <SidebarItem
                        tooltip='Survey items'
                        isActive={mode === editorModes[2]}
                        onPress={() => {
                            setMode(editorModes[2]);
                        }}
                    >
                        <BsListUl />
                    </SidebarItem>

                    <SidebarItem
                        tooltip='Preview'
                        isActive={mode === editorModes[3]}
                        onPress={() => {
                            setMode(editorModes[3]);
                        }}
                    >
                        <BsFilePlay />
                    </SidebarItem>

                    <SidebarItem
                        tooltip='Publish'
                        isActive={mode === editorModes[4]}
                        onPress={() => {
                            setMode(editorModes[4]);
                        }}
                    >
                        <BsCloudUpload />
                    </SidebarItem>

                    <span className='grow'></span>
                    <Divider />
                    <SidebarItem
                        tooltip='Exit Survey Editor'
                        onPress={() => {
                            onExit();
                        }}
                    >
                        <BsBoxArrowLeft className='text-secondary' />
                    </SidebarItem>

                </Sidebar>
            </div>
            <div className='pl-14'>
                <p>Editor</p>
                <div className='h-80 bg-content2'></div>
                <div className='h-80 bg-content3'></div>
                <div className='h-80 bg-content1'></div>
                <div className='h-80 bg-content2'></div>
            </div>

        </div>
    );
};

export default SurveyEditor;
