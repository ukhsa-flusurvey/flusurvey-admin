import React from 'react';
import { Button, ButtonProps } from './ui/button';
import ClipLoader from "react-spinners/ClipLoader";
import { cn } from '@/lib/utils';

interface LoadingButtonProps extends ButtonProps {
    isLoading?: boolean;
}

const LoadingButton: React.FC<LoadingButtonProps> = ({
    isLoading = false,
    disabled = false,
    className,
    ...props
}) => {
    return (
        <Button
            disabled={isLoading || disabled}
            className={cn('flex items-center justify-center gap-2', className)}
            {...props}
        >
            {isLoading && <ClipLoader
                size={16}
                color={'#ffffff'}
            />}
            {props.children}
        </Button>
    );
};

export default LoadingButton;
