import { Editor } from '@monaco-editor/react';
import React from 'react';

interface ContentEditorProps {
    content: string;
    onChange: (newContent: string) => void;
}


const ContentEditor: React.FC<ContentEditorProps> = (props) => {


    return (
        <div className='p-3 flex flex-col gap-3  h-[700px] '>
            <Editor
                className='grow border border-neutral-300 rounded-lg overflow-hidden '
                defaultLanguage="html"
                value={props.content}
                options={{
                    minimap: {
                        enabled: false,
                    },
                    roundedSelection: true,
                }}
                language='html'
                onChange={(e) => {
                    props.onChange(e || '');
                }}
            />
        </div>
    );
};

export default ContentEditor;
