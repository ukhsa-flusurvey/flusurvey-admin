import { AlertTriangle } from 'lucide-react';
import React from 'react';

interface ErrorAlertProps {
    title: string;
    error: string;
    hint?: string;
}

const ErrorAlert: React.FC<ErrorAlertProps> = (props) => {
    return (
        <div className='px-6 py-3 bg-red-100/80 rounded-md border border-red-700 text-red-700 flex gap-6'>
            <div className='flex items-center'>
                <AlertTriangle className='size-8 text-red-700' />
            </div>
            <div className='space-y-2'>
                <h3 className='font-bold'>
                    {props.title}
                </h3>
                <p>
                    {props.error}
                </p>
                {props.hint && <p className='text-sm '>
                    {props.hint}
                </p>}
            </div>
        </div>
    );
};

export default ErrorAlert;
