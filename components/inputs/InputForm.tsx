import React, { InputHTMLAttributes, useState } from 'react';
import clsx from 'clsx';
import XCircleIcon from '@heroicons/react/20/solid/XCircleIcon';
import { motion } from "framer-motion"

interface InputFormProps extends InputHTMLAttributes<HTMLElement> {
    label?: string;
    hasError?: boolean;
    errorMsg?: string;

}

const InputForm: React.FC<InputFormProps> = ({ hasError, ...props }) => {

    return (<div>
        {props.label ?
            <label
                className="block mt-4">
                <span className={clsx(
                    "text-gray-700",
                    {
                        'text-red-500': hasError
                    },
                )}>
                    {props.label}
                </span>
            </label>
            : null}
        <input {...props} type={props.type}
            placeholder={props.placeholder}
            className={clsx(
                'form-input block w-full mt-1 rounded border-gray-300',
                props.className,
                {
                    'border-2 border-red-500': hasError
                },
            )}>
        </input>
        {(hasError && props.errorMsg) ?
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1, transition: { duration: 1 }, }}
                className='bg-rose-200 rounded px-2 py-2 flex'>
                <XCircleIcon className='h-6 w-6 mr-2 text-red-500' />  {props.errorMsg}
            </motion.div>
            : null}
    </div>
    );
};

export default InputForm;
