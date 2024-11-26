'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import React from 'react';

interface PaginationProps {
    className?: string;
    limit: number;
    total: number;
    page: number;
}


const Pagination: React.FC<PaginationProps> = (props) => {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const page = props.page; // parseInt(searchParams.get('page') || '1');


    const setPage = (page: number) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', page.toString());

        replace(`${pathname}?${params.toString()}`);
    }

    return (
        <div className={cn(" w-full h-12  flex items-center justify-center border-t border-neutral-300",
            props.className
        )}>
            <Button
                variant='ghost'
                size={'icon'}
                onClick={() => setPage(Math.max(page - 1, 1))}
            >
                <ChevronLeft className='size-4' />
            </Button>
            <p className='text-sm'>
                {page * props.limit - props.limit + 1} - {Math.min(props.total, page * props.limit)} of {props.total}
            </p>
            <Button
                variant='ghost'
                size={'icon'}
                onClick={() => setPage(Math.min(page + 1, Math.ceil(props.total / props.limit)))}
            >
                <ChevronRight className='size-4' />
            </Button>
        </div>
    );
};

export default Pagination;
