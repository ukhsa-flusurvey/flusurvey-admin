'use client';

import ErrorAlert from '@/components/ErrorAlert';
import React from 'react';


const Error: React.FC = () => {
    return (
        <div className='p-6'>
            <ErrorAlert
                title="Could not load the study"
                error="The study could not be loaded. Please try again later."
                hint="Try to reload the page. If the problem persists, contact support."
            />
        </div>
    );
};

export default Error;
