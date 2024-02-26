import { Card, CardContent, CardHeader } from '@/components/ui/card';
import React from 'react';

interface CardWrapperProps {
    children: React.ReactNode;
}

const CardWrapper: React.FC<CardWrapperProps> = (props) => {
    return (
        <Card
            variant={"opaque"}
            className='max-w-full'
        >
            <CardHeader>
                <h2 className='text-lg font-bold'>Management Users</h2>
            </CardHeader>
            <CardContent>
                {props.children}
            </CardContent>
        </Card>
    );
};

export default CardWrapper;
