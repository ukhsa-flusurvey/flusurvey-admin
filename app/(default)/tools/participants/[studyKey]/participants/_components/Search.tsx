'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SearchIcon } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React from 'react';

interface SearchProps {
}

const Search: React.FC<SearchProps> = (props) => {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();
    const [search, setSearch] = React.useState<string>(decodeURIComponent(searchParams.get('filter') || ''));



    const handleSearch = () => {
        const params = new URLSearchParams(searchParams);
        if (search) {
            params.set('filter',
                encodeURIComponent(search)
            );
        } else {
            params.delete('filter');
        }

        replace(`${pathname}?${params.toString()}`);
    }

    const hasChanged = search !== decodeURIComponent((searchParams.get('filter') || '')).toString();

    return (
        <div className='flex gap-2'>
            <Input
                id='participant-filter'
                name='participant-filter'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        handleSearch();
                    }
                }}
            />
            <Button
                disabled={!hasChanged}
                onClick={handleSearch}
            >
                <SearchIcon className="size-4 me-2" />
                Search
            </Button>
        </div>
    );
};

export default Search;
