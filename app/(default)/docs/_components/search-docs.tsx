'use client';

import { Button } from '@/components/ui/button';
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from '@/components/ui/command';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useDebounceCallback } from 'usehooks-ts';

const searchDocs = async (query: string) => {
    console.log('search docs', query)
}

const SearchDocs: React.FC = () => {
    const [open, setOpen] = React.useState(false)
    const [search, setSearch] = React.useState('')
    const router = useRouter()

    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                setOpen((open) => !open)
            }
        }

        document.addEventListener("keydown", down)
        return () => document.removeEventListener("keydown", down)
    }, [])


    const debouncedSearch = useDebounceCallback(searchDocs, 500)

    const onSearchChange = (newSearch: string) => {
        setSearch(newSearch)
        debouncedSearch(newSearch)
    }


    return (
        <>
            <Button
                className='w-full justify-between'
                variant='outline'
                onClick={() => setOpen(true)}
            >
                <span className='mr-4 text-muted-foreground text-xs'>
                    Search docs... {" "}
                </span>
                <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                    <span className="text-xs">⌘</span>K
                </kbd>
            </Button>
            <CommandDialog open={open} onOpenChange={setOpen}>
                <CommandInput
                    value={search}
                    onValueChange={onSearchChange}
                    placeholder="Type a command or search..." />
                <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>
                    <CommandGroup heading="Suggestions">
                        <CommandItem onSelect={() => onSearchChange('calendar')}>
                            <span>Calendar</span>
                        </CommandItem>

                    </CommandGroup>
                    <CommandSeparator />
                    <CommandGroup heading="Settings">
                        <CommandItem onSelect={() => router.push('/')}>

                            <span>Profile</span>

                        </CommandItem>

                    </CommandGroup>
                </CommandList>
            </CommandDialog>
        </>
    );
};

export default SearchDocs;
