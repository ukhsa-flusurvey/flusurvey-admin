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

    const page = parseInt(searchParams.get('page') || '1');


    const setPage = (page: number) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', page.toString());

        replace(`${pathname}?${params.toString()}`);
    }

    return (
        <div className={cn(" w-full gap-2 flex items-center justify-center border-t border-border py-2 bg-white",
            props.className
        )}>
            <Button
                variant='outline'
                className='rounded-full'
                size={'icon'}
                onClick={() => setPage(Math.max(page - 1, 1))}
                aria-label='Previous page'
            >
                <ChevronLeft className='size-4' />
            </Button>
            <p className='text-sm font-bold'>
                {page * props.limit - props.limit + 1} - {Math.min(props.total, page * props.limit)} of {props.total}
            </p>
            <Button
                variant='outline'
                className='rounded-full'
                size={'icon'}
                aria-label='Next page'
                onClick={() => setPage(Math.min(page + 1, Math.ceil(props.total / props.limit)))}
            >
                <ChevronRight className='size-4' />
            </Button>
        </div>
    );
};

export default Pagination;
