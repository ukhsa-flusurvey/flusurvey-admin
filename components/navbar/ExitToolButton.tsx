'use client';

import Link from 'next/link';
import { BsXLg } from 'react-icons/bs';
import { buttonVariants } from '../ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import { cn } from '@/lib/utils';

const ExitToolButton: React.FC = () => {
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Link
                    href="/"
                    aria-label="Exit"
                    className={cn(buttonVariants({ variant: 'ghost', size: 'icon' }), 'text-2xl')}
                >
                    <BsXLg />
                </Link>
            </TooltipTrigger>
            <TooltipContent>
                Return to main menu
            </TooltipContent>
        </Tooltip>
    );
};

export default ExitToolButton;
