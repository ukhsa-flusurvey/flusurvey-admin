import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

interface BackButtonProps {
    label: string;
    href: string;
}

const BackButton: React.FC<BackButtonProps> = (props) => {
    return (
        <Button
            variant={"ghost"}
            asChild
            size={'sm'}
        >
            <Link
                prefetch={false}
                href={props.href}
            >
                <ArrowLeft className="size-5 me-1" />
                {props.label}
            </Link>
        </Button>
    );
};

export default BackButton;
