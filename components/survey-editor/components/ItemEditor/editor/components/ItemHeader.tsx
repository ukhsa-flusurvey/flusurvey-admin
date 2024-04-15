import React from 'react';
import { SurveyItem } from 'survey-engine/data_types';
import { builtInItemColors, getItemColor, getItemKeyFromFullKey, getItemTypeInfos, getParentKeyFromFullKey } from '../../../../utils/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Popover, PopoverContent } from '@/components/ui/popover';
import { PopoverClose, PopoverTrigger } from '@radix-ui/react-popover';
import { Button } from '@/components/ui/button';
import { ClipboardCopy, CodeSquare, MoreVertical, Move, SquarePen, Trash2, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';
import { useCopyToClipboard } from 'usehooks-ts';
import { toast } from 'sonner';
import MoveItemDialog from './MoveItemDialog';
import KeyPreviewAndEditor from './KeyPreviewAndEditor';

interface ItemHeaderProps {
    surveyItem: SurveyItem;
    surveyItemList: Array<{ key: string, isGroup: boolean }>;
    currentMode: 'source' | 'normal';
    onChangeMode: (mode: 'source' | 'normal') => void;
    onChangeItemColor: (newColor: string) => void;
    onMoveItem: (newParentKey: string, oldItemKey: string) => void;
    onDeleteItem: () => void;
    onChangeKey: (oldKey: string, newKey: string) => void;
}

const ItemHeader: React.FC<ItemHeaderProps> = (props) => {
    const popoverCloseRef = React.useRef<HTMLButtonElement>(null);
    const [copiedText, copy] = useCopyToClipboard()
    const [moveItemDialogOpen, setMoveItemDialogOpen] = React.useState(false);

    const item = {
        parentKey: getParentKeyFromFullKey(props.surveyItem.key),
        itemKey: getItemKeyFromFullKey(props.surveyItem.key),
        typeInfos: getItemTypeInfos(props.surveyItem),
        color: getItemColor(props.surveyItem)
    }

    const hideColorPicker = item.typeInfos.key === 'pageBreak' || item.typeInfos.key === 'surveyEnd';

    const colorPicker = hideColorPicker ? null : (<Popover>
        <PopoverTrigger
            className="rounded-lg p-0 hover:opacity-80"
            style={{
                color: item.color,
                backgroundColor: item.color,
            }}
        >
            <div className="size-6 p-0">
                {' '}
            </div>

        </PopoverTrigger>
        <PopoverContent className='grid grid-cols-4 p-2 gap-2 w-auto'>
            {builtInItemColors.map(color => (
                <Button
                    key={color}
                    value={color}
                    style={{
                        backgroundColor: color,
                        color: color
                    }}
                    className={cn(
                        "size-8 rounded-lg p-0 hover:opacity-80",
                        {
                            'ring ring-slate-600 ring-offset-2': color === item.color
                        }
                    )}
                    size='icon'
                    onClick={() => {
                        props.onChangeItemColor(color);
                        popoverCloseRef.current?.click();
                    }}
                >
                    {' '}
                </Button>
            )
            )}
            <PopoverClose
                ref={popoverCloseRef}
                className='flex items-center justify-center'
            >
                <X className='size-6' />
            </PopoverClose>

        </PopoverContent>
    </Popover>)

    const itemMenu = (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    size='icon'
                    variant={'ghost'}

                >
                    <div className='siz'>
                        <MoreVertical />
                    </div>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
                <DropdownMenuRadioGroup
                    value={props.currentMode}
                >
                    <DropdownMenuRadioItem
                        value='normal'
                        onClick={() => {
                            props.onChangeMode('normal');
                        }}
                    >
                        <div className='flex items-center gap-2 justify-between w-full'>
                            <p>Normal mode</p>
                            <SquarePen className='text-neutral-500 size-5' />
                        </div>
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem
                        value='source'
                        onClick={() => {
                            props.onChangeMode('source');
                        }}
                    >
                        <div className='flex items-center gap-2 justify-between w-full'>
                            <p>Source code</p>
                            <CodeSquare className='text-neutral-500 size-5' />
                        </div>
                    </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>


                <DropdownMenuSeparator />

                <DropdownMenuItem
                    onClick={() => {
                        const surveyItemJSON = JSON.stringify(props.surveyItem, null, 2);
                        copy(surveyItemJSON);
                        toast('Item copied to clipboard');
                    }}
                >
                    <div className='flex items-center gap-2'>
                        <ClipboardCopy className='text-neutral-500 size-5' />
                        <p>Copy</p>
                    </div>
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => setMoveItemDialogOpen(true)}
                >
                    <div className='flex items-center gap-2'>
                        <Move className='text-neutral-500 size-5' />
                        <p>Move to other group</p>
                    </div>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                    onClick={() => {
                        if (confirm(`Are you sure you want to delete the item "${props.surveyItem.key}"?`)) {
                            props.onDeleteItem();
                        }
                    }}
                >
                    <div className='flex items-center gap-2'>
                        <Trash2 className='text-red-500 size-5' />
                        <p>Delete item</p>
                    </div>
                </DropdownMenuItem>

            </DropdownMenuContent>
        </DropdownMenu>
    );

    const moveItemDialog = (
        <MoveItemDialog
            open={moveItemDialogOpen}
            onClose={() => setMoveItemDialogOpen(false)}
            surveyItemList={props.surveyItemList}
            currentItemKey={props.surveyItem.key}
            onMoveItem={(newParentKey, oldItemKey) => {
                props.onMoveItem(newParentKey, oldItemKey);
            }}
        />
    )

    return (
        <TooltipProvider>
            <div className='px-3 py-2 flex gap-3 items-center bg-secondary'>
                <Tooltip
                    delayDuration={0}
                >
                    <TooltipTrigger>
                        <div
                            className={item.typeInfos.defaultItemClassName}
                            style={{
                                color: item.color
                            }}>
                            <item.typeInfos.icon
                                className='size-8'
                            />
                        </div>
                    </TooltipTrigger>
                    <TooltipContent align='start' side='bottom'

                    >
                        {item.typeInfos.label}
                    </TooltipContent>
                </Tooltip>

                <KeyPreviewAndEditor
                    parentKey={item.parentKey}
                    itemKey={item.itemKey}
                    surveyItemList={props.surveyItemList}
                    onChangeKey={(newKey: string) => {
                        props.onChangeKey(props.surveyItem.key, newKey);
                    }}
                />

                {colorPicker}

                {itemMenu}
            </div>
            {moveItemDialog}

        </TooltipProvider>
    );
};

export default ItemHeader;
