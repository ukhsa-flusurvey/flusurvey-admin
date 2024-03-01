import { cn } from '@/lib/utils';
import { Cog } from 'lucide-react';
import React from 'react';

interface CogLoadersProps {
    className?: string;
    label: string;
}

const CogLoaders: React.FC<CogLoadersProps> = (props) => {
    return (
        <div className={cn(
            'animate-pulse px-6 py-3 rounded-md bg-white',
            props.className
        )}>
            <p className='text-center'>
                {props.label}
            </p>
            <p className='text-center flex justify-center mt-3'>
                <Cog className='size-8 animate-spin' />
            </p>
        </div>
    );
};

export default CogLoaders;
