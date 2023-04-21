import React, { InputHTMLAttributes } from 'react';
import clsx from 'clsx';
import { AnimatePresence, motion } from "framer-motion"

interface InputFormProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    hasError?: boolean;
    errorMsg?: string;
    color?: 'blue';
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;

}

const InputForm: React.FC<InputFormProps> = ({ hasError, onChange, errorMsg, color, ...props }) => {

    return (<div>
        {props.label ?
            <label
                htmlFor={props.id}
                className="block cursor-text">
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
        <input {...props}
            type={props.type}
            placeholder={props.placeholder}
            onChange={onChange}
            className={clsx(
                'form-input block w-full mt-1 rounded border-gray-300',
                'focus:ring-4 focus:ring-offset-2',
                {
                    'focus:ring-blue-600 focus:ring-opacity-30 ': color === 'blue' || !color,
                },
                {
                    'border-2 border-red-500': hasError,
                    'focus:border-red-500 focus:border-2': hasError,
                    'focus:ring-red-500 focus:ring-opacity-30 focus:ring-4 focus:ring-offset-2': hasError,

                },
                props.className,

            )}>
        </input>
        <AnimatePresence>
            {(hasError && errorMsg) &&
                <motion.div
                    animate={{ opacity: 1, height: 'auto' }}
                    initial={{ opacity: 0, height: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    className='py-2 flex overflow-hidden text-red-500 text-right text-xs'
                >
                    {errorMsg}
                </motion.div>
            }
        </AnimatePresence>
    </div >
    );
};

export default InputForm;
