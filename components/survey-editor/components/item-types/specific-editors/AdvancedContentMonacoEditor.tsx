import React from 'react';
import { Editor } from '@monaco-editor/react';
import { Button, Tooltip } from '@nextui-org/react';
import { BsCheck2, BsExclamationTriangleFill, BsX } from 'react-icons/bs';
import { DateDisplayComponentProp, OptionDef, StyledTextComponentProp } from 'case-editor-tools/surveys/types';
import * as yaml from 'js-yaml';

interface AdvancedContentMonacoEditorProps {
    advancedContent: Array<StyledTextComponentProp | DateDisplayComponentProp> | Array<OptionDef>
    onChange: (newContent: Array<StyledTextComponentProp | DateDisplayComponentProp> | Array<OptionDef>) => void;
}

const exampleFormattedContent = `# Example Content
- className: ''
  content:
    - [nl, Content in Dutch]
    - [en, Content in English]
`;

const AdvancedContentMonacoEditor: React.FC<AdvancedContentMonacoEditorProps> = (props) => {
    const [errorMsg, setErrorMsg] = React.useState<string | undefined>('content could not be parsed');

    return (
        <div>
            <div className='flex items-center gap-unit-sm bg-content2 px-unit-sm py-2 rounded-small mb-unit-sm'>
                <span>
                    <BsExclamationTriangleFill className='text-default-500' />
                </span>
                <span className='text-small'>
                    This is a temporary editor UI for advanced mode. Define the content in YAML format.
                </span>
            </div>

            <div className='overflow-hidden border p rounded-medium relative'>
                <p className="text-tiny px-3 py-2">Title (advanced)</p>
                <Editor height="250px" defaultLanguage="yaml"
                    defaultValue={exampleFormattedContent}
                    options={{
                        minimap: {
                            enabled: false,
                        },
                        rounedSelection: true,
                    }}
                    language='yaml'
                    onChange={(e) => {
                        console.log(e);
                        if (!e) return;
                        try {
                            yaml.loadAll(e, (doc) => {

                                if (doc) {
                                    // props.onChange(doc);
                                    (doc as Array<any>).forEach((item: any) => {
                                        console.log(new Map(item.content))
                                    })
                                    console.log(doc);
                                    setErrorMsg(undefined);
                                }

                            })
                        } catch (e) {
                            setErrorMsg('content could not be parsed');
                        }
                    }}
                />
                {errorMsg && <p className='absolute bottom-0 bg-red-50/50 w-full text-center text-danger-500 text-sm py-1 px-unit-md font-bold'>{errorMsg}</p>}
            </div>
            <div className='flex justify-end'>
                <Tooltip content='Discard changes'>
                    <Button
                        isIconOnly={true}
                        size='sm'
                        variant='light'
                        color='danger'
                        isDisabled={true}
                        className='text-2xl'
                    >
                        <BsX />
                    </Button>
                </Tooltip>
                <Tooltip content='Accept changes'>
                    <Button
                        isIconOnly={true}
                        size='sm'
                        variant='light'
                        color='success'
                        className='text-2xl'
                    >
                        <BsCheck2 />
                    </Button>
                </Tooltip>
            </div>
        </div>

    );
};

export default AdvancedContentMonacoEditor;
