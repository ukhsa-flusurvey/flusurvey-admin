'use client';

import Container from '@/components/Container';
import { useEffect } from 'react';

export default function Error({
    error,
    reset,
}: {
    error: Error;
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error);
    }, [error]);

    return (
        <Container>
            <div className='p-8 bg-white rounded-2xl shadow-lg max-w-[500px] mx-auto'>
                <h2 className='text-2xl font-bold text-red-500'>{'Something went wrong :-('}</h2>
                <p className='text-red-500 mt-4'> {error.message} </p>

            </div>
        </Container>
    );
}
