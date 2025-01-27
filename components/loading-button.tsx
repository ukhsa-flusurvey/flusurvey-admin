import React from 'react';
import { Button, ButtonProps } from './ui/button';
import ClipLoader from "react-spinners/ClipLoader";
import { cn } from '@/lib/utils';

interface LoadingButtonProps extends ButtonProps {
    isLoading?: boolean;
}

const LoadingButton = React.forwardRef<HTMLButtonElement, LoadingButtonProps>(({
    isLoading = false,
    disabled = false,
    className,
    ...props
}, ref) => {
    return (
        <Button
            ref={ref}
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
});

LoadingButton.displayName = 'LoadingButton';


export default LoadingButton;
