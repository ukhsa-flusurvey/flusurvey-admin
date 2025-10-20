'use client'

import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { ArrowDown01, ArrowUp01 } from "lucide-react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"

const SortConfig = () => {
    const searchParams = useSearchParams()
    const pathname = usePathname()
    const router = useRouter()

    const sortAscending = searchParams.get('sortAscending') === 'true'

    const handleSort = () => {
        const params = new URLSearchParams(searchParams)
        params.set('sortAscending', sortAscending ? 'false' : 'true')
        // Reset pagination to first page when changing sort order
        params.set('page', '1')
        router.replace(`${pathname}?${params.toString()}`)
    }

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Button
                    size={'icon'}
                    variant='outline'
                    className="font-bold rounded-full shadow-sm"
                    onClick={handleSort}>
                    {sortAscending ? <ArrowDown01 className='size-4' /> : <ArrowUp01 className='size-4' />}

                </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" align="start">
                {sortAscending ? 'Toggle to show oldest first' : 'Toggle to show newest first'}
            </TooltipContent>
        </Tooltip>
    )
}

export default SortConfig;
