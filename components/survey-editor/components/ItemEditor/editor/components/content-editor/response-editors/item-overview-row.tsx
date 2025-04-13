import { Button } from "@/components/ui/button";
import { ItemComponent } from "survey-engine/data_types";
import { PopoverKeyBadge } from "../../KeyBadge";
import { ChevronDown, ClipboardCopy, ClipboardPaste, Copy, GripHorizontal, Heading, Trash } from "lucide-react";
import { cn } from "@/lib/utils";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface ItemOverviewRowProps {
    i: number;
    item: ItemComponent;
    isDragOverlay: boolean;
    isSelected: boolean;
    isBeingDragged: boolean;
    usedKeys: string[];
    itemIconLookup: (item: ItemComponent) => React.ReactNode;
    itemDescriptiveTextLookup: (item: ItemComponent) => string;
    onClick?: () => void;
    onKeyChange?: (oldKey: string, newKey: string) => void;
    onDelete?: () => void;
    onDuplicate?: () => void;
    onCopy?: () => void;
    onPaste?: () => void;
}

export const ItemOverviewRow: React.FC<ItemOverviewRowProps> = (props) => {
    return <Button
        variant={'outline'}
        className={cn(
            'w-full gap-2 py-2 h-auto px-3 text-start',
            { 'bg-accent text-accent-foreground': props.isSelected },
            (props.isBeingDragged && !props.isDragOverlay) && 'invisible')}
        onClick={props.isDragOverlay ? undefined : props.onClick}
    >
        <div>
            {props.itemIconLookup(props.item) || <Heading className='size-4 text-muted-foreground' />}
        </div>
        <span className={cn('grow space-x-2',)}>
            <PopoverKeyBadge
                itemKey={props.item.key ?? ''}
                isHighlighted={props.isSelected}
                allOtherKeys={props.usedKeys.filter(key => key !== props.item.key)}
                onKeyChange={(newKey) => { props.onKeyChange?.(props.item.key ?? '', newKey); }}
            />

            <span className='text-muted-foreground'>
                {props.itemDescriptiveTextLookup(props.item)}
            </span>
        </span>
        <div className='flex flex-row gap-2 items-center'>
            {props.isSelected && <>
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <Button className='h-[20px] w-[20px] flex items-center justify-center hover:bg-slate-300 rounded-full' variant={'ghost'} onClick={props.onDelete}>
                            <ChevronDown className='size-4 text-muted-foreground' />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem onSelect={props.onDelete} onClick={(e) => e.stopPropagation()}><span className="text-muted-foreground mr-2" ><Trash size={16} /></span>Delete</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onSelect={props.onDuplicate} onClick={(e) => e.stopPropagation()}><span className="text-muted-foreground mr-2" ><Copy size={16} /></span>Duplicate</DropdownMenuItem>
                        <DropdownMenuItem onSelect={props.onCopy} onClick={(e) => e.stopPropagation()}><span className="text-muted-foreground mr-2" ><ClipboardCopy size={16} /></span>Copy Contents</DropdownMenuItem>
                        <DropdownMenuItem onSelect={props.onPaste} onClick={(e) => e.stopPropagation()}><span className="text-muted-foreground mr-2" ><ClipboardPaste size={16} /></span>Paste Contents</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </>}
            <GripHorizontal className='size-4' />
        </div>
    </Button>;
}