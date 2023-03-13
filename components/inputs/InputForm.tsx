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
                    {(hasError) ?
                        <motion.div animate={{ opacity: 1 }}
                            transition={{
                                ease: [0.5, 0.71, 1, 1],
                            }}
                            initial={{ opacity: 0 }}>
                            {props.label}
                        </motion.div>
                        : <>{props.label}</>}
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
            <motion.div animate={{ y: [-10, -10, 0], opacity: 1, scale: 1 }}
                transition={{
                    ease: [0.5, 0.71, 1, 1],
                }}
                initial={{ opacity: 0, scale: 0.7 }}
                className='bg-rose-200 rounded px-2 py-2 flex'>
                <XCircleIcon className='h-6 w-6 mr-2 text-red-500' />  {props.errorMsg}
            </motion.div>
            : null}
    </div>
    );
};

export default InputForm;