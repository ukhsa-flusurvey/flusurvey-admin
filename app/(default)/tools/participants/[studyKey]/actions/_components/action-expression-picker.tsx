import Filepicker from '@/components/inputs/Filepicker';
import React from 'react';
import { Expression, isExpression } from 'survey-engine/data_types';

interface ActionExpressionPickerProps {
    onChange: (newExpression?: Expression[]) => void;
}

const checkIfValidCustomStudyRules = (rules: any): boolean => {
    if (!Array.isArray(rules)) {
        return false;
    }
    for (const rule of rules) {
        if (!isExpression(rule)) {
            return false;
        }
    }
    return true
}

const ActionExpressionPicker: React.FC<ActionExpressionPickerProps> = (props) => {
    const [errorMsg, setErrorMsg] = React.useState<string | undefined>(undefined);
    const [successMsg, setSuccessMsg] = React.useState<string | undefined>(undefined);

    return (
        <div className='py-4 flex flex-col'>
            <Filepicker
                id='upload-study-rules-for-action'
                label='Select a file'
                accept={{
                    'application/json': ['.json'],
                }}
                onChange={(files) => {
                    setErrorMsg(undefined);
                    setSuccessMsg(undefined);
                    if (files.length > 0) {
                        // read file as a json
                        const reader = new FileReader();
                        reader.onload = (e) => {
                            const text = e.target?.result;
                            if (typeof text === 'string') {
                                const data = JSON.parse(text);

                                if (!checkIfValidCustomStudyRules(data)) {
                                    setErrorMsg('Selected file does not appear to be a valid custom rule file. Please check if you have selected the correct file.');
                                    return;
                                }
                                props.onChange(data as Expression[]);
                            } else {
                                props.onChange(undefined);
                                console.error('error');
                            }
                        }
                        reader.readAsText(files[0]);
                    } else {
                        props.onChange(undefined);
                    }
                }}
            />
            {errorMsg && <p className='text-red-600 mt-2'>{errorMsg}</p>}
            {successMsg && <p className='text-green-600 mt-2'>{successMsg}</p>}
        </div>
    );
};

export default ActionExpressionPicker;
