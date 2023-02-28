import React, { ButtonHTMLAttributes } from 'react';
import Spinner from '../Spinner';
import Button, { ButtonProps } from './Button';

interface LoadingButtonProps extends ButtonProps {
    isLoading: boolean;
}

const LoadingButton: React.FC<LoadingButtonProps> = ({ children, isLoading, ...props }) => {
    return (
        <Button {...props} disabled={isLoading}>

            {children}
            {isLoading ? <span className='flex items-center ml-4'>
                <Spinner
                    size='sm'
                    color='white'
                /> </span> : null}
        </Button>
    );
};

export default LoadingButton;
