'use client';

import { Button } from '@/components/ui/button';
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from '@/components/ui/command';
import { Loader2Icon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useDebounceCallback, useDebounceValue } from 'usehooks-ts';

const searchDocs = async (query: string) => {

    // simulate search - sleep
    await new Promise(resolve => setTimeout(resolve, 1000))
    return ['test']
}

const SearchDocs: React.FC = () => {
    const [open, setOpen] = React.useState(false)
    const [search, setSearch] = useDebounceValue('', 500)
    const router = useRouter()
    const [isPending, startTransition] = React.useTransition()


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

    React.useEffect(() => {
        console.log('search', search)
        const getSearch = async () => {
            startTransition(async () => {
                const results = await searchDocs(search)
                console.log('results', results)
            })

        }
        getSearch()
    }, [search])







    return (
        <>
            <Button
                className='w-full justify-between h-fit px-3 py-1.5 rounded-lg '
                variant='outline'
                onClick={() => setOpen(true)}
            >
                <span className='mr-4 text-muted-foreground/80 text-xs'>
                    Search docs... {" "}
                </span>
                <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                    <span className="text-xs">⌘</span>K
                </kbd>
            </Button>
            <CommandDialog open={open} onOpenChange={setOpen}>
                <div className='relative'>
                    <CommandInput
                        defaultValue={search}
                        onValueChange={setSearch}
                        placeholder="Search docs..."
                    />
                    {isPending &&
                        <Loader2Icon className='animate-spin size-4 text-muted-foreground/70 absolute top-4 right-10 z-10' />
                    }

                </div>

                <CommandList className=''>
                    <CommandEmpty>
                        {isPending && <span
                            className='flex items-center gap-2 justify-center'
                        ><Loader2Icon className='animate-spin size-4 text-muted-foreground/70' />
                            <span className=''>Searching...</span>
                        </span>}
                        {!isPending && 'No results found.'}
                    </CommandEmpty>

                    <CommandGroup heading="Suggestions">
                        <CommandItem onSelect={() => setSearch('calendar')}>
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
