import { Input } from "@nextui-org/react";
import React from "react";
import { BsTag } from "react-icons/bs";

const KeyEditor: React.FC<{
    parentKey: string;
    itemKey: string;
    onItemKeyChange: (oldKey: string, newKey: string) => boolean;
}> = ({ parentKey, itemKey, onItemKeyChange }) => {
    const [errorMsg, setErrorMsg] = React.useState<string | null>(null);


    return <div>
        <div className='flex items-center text-small font-bold'>
            <span>
                <BsTag className='text- text-default-500 me-2' />
            </span>
            Key:
        </div>
        <div className='overflow-x-scroll'>
            <div className='flex items-center'>
                <span className='font-mono text-tiny text-default-400 pt-1'>
                    {parentKey}.
                </span>
                <Input
                    aria-label='Item key'
                    className='font-mono min-w-[200px] w-80'
                    variant='bordered'
                    size='md'
                    placeholder='Enter a key for the item'
                    isRequired

                    validationState={itemKey.length === 0 ? 'invalid' : 'valid'}
                    value={itemKey}
                    onValueChange={(v) => {
                        setErrorMsg(null);
                        if (!onItemKeyChange([parentKey, itemKey].join('.'), [parentKey, v].join('.'))) {
                            setErrorMsg('Key already exists. To avoid issues it is not possible to change the key to an existing one.');
                        }
                    }}
                />
            </div>
            {errorMsg && <p className='text-danger-500 text-sm mt-1'>{errorMsg}</p>}
        </div>
    </div>
}

export default KeyEditor;
