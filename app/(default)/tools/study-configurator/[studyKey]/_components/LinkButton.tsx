import { Button } from '@/components/ui/button';
import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

interface LinkButtonProps {
    href: string;
    text: string;
}

const LinkButton: React.FC<LinkButtonProps> = (props) => {
    return (
        <Button
            variant={'link'}
            size={'sm'}
            className='px-0 h-auto text-xs text-neutral-600'
            asChild
        >
            <Link
                href={props.href}
                prefetch={false}
            >
                {props.text}
                <ArrowUpRight className='size-4 ml-1' />
            </Link>
        </Button>
    );
};

export default LinkButton;

export const LinkButtonSkeleton: React.FC<{
    text: string;
}> = (
    { text }
) => {
        return (
            <Button
                variant={'link'}
                size={'sm'}
                className='px-0 h-auto text-xs text-neutral-600'
                disabled
            >

                {text}
                <ArrowUpRight className='size-4 ml-1' />

            </Button>
        );
    }
