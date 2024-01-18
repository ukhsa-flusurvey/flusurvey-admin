import React from 'react';
import { Button, ButtonProps } from './ui/button';
import ClipLoader from "react-spinners/ClipLoader";

interface LoadingButtonProps extends ButtonProps {
    isLoading?: boolean;
}

const LoadingButton: React.FC<LoadingButtonProps> = ({
    isLoading = false,
    disabled = false,
    ...props
}) => {
    return (
        <Button
            disabled={isLoading || disabled}
            className='flex items-center justify-center gap-2'
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
