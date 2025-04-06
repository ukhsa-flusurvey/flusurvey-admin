import { Badge } from "@/components/ui/badge";

export const KeyBadgeAndType = (props: { compKey?: string, type: string }) => {
    return <div className='text-xs font-semibold flex justify-between w-full'>
        <Badge className='h-auto py-0'>
            {props.compKey}
        </Badge>
        <span className='text-muted-foreground'>
            {props.type}
        </span>
    </div>
}