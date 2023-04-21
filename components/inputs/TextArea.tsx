import clsx from 'clsx';
import React from 'react';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    color?: 'blue';
    onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const TextArea: React.FC<TextAreaProps> = (props) => {
    return (
        <textarea {...props}
            placeholder={props.placeholder}
            className={clsx(
                'form-input block w-full mt-1 rounded border-gray-300',
                'focus:ring-4 focus:ring-offset-2',
                {
                    'focus:ring-blue-600 focus:ring-opacity-30 ': props.color === 'blue' || !props.color,
                },

                props.className,

            )}>
        </textarea>
    );
};

export default TextArea;
