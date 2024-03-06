import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import React from 'react';

interface WrapperCardProps {
    children: React.ReactNode;
    title: string;
    description: string;
}

const WrapperCard: React.FC<WrapperCardProps> = (props) => {
    return (
        <Card
            variant={'opaque'}
        >
            <CardHeader>
                <CardTitle className='text-xl'>
                    {props.title}
                </CardTitle>
                <CardDescription>
                    {props.description}
                </CardDescription>
            </CardHeader>
            <CardContent>
                {props.children}
            </CardContent>
        </Card>
    );
};

export default WrapperCard;
