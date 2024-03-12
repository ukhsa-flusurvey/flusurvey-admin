'use client';
import ErrorAlert from '@/components/ErrorAlert';
import React from 'react';

interface ErrorProps {
}

const error: React.FC<ErrorProps> = (props) => {
    return (
        <div className='py-4'>
            <ErrorAlert
                title="Error loading participants"
                error="Try again later. If the problem persists, contact your admin."
            />
        </div>
    );
};

export default error;
