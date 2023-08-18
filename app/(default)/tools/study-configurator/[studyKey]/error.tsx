'use client';

import React from 'react';

interface ErrorProps {
}

const Error: React.FC<ErrorProps> = (props) => {
    return (
        <div className='p-unit-lg'>
            <div className='rounded-medium p-unit-md text-danger bg-danger-50'>
                <p>Error while loading study</p>
            </div>

        </div>
    );
};

export default Error;
