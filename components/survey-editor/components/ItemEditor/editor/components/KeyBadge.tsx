import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { PopoverClose } from "@radix-ui/react-popover";
import { Check, RotateCcw, X } from "lucide-react";
import React, { useEffect } from "react";
import { MouseEventHandler } from "react";

export const KeyBadge = (props: { itemKey: string, isHighlighted: boolean, onClick?: MouseEventHandler<HTMLDivElement> | undefined }) => {
    return <Badge onClick={props.onClick} variant={props.isHighlighted ? 'default' : 'outline'} className='h-auto border-2 py-0'>{props.itemKey}</Badge>;
}

export const KeyBadgeAndType = (props: { compKey?: string, type: string }) => {
    return <div className='text-xs font-semibold flex justify-between w-full'>
        <KeyBadge itemKey={props.compKey ?? ''} isHighlighted={false} />
        <span className='text-muted-foreground'>
            {props.type}
        </span>
    </div>
}

export const PopoverKeyBadge: React.FC<{
    allOtherKeys: string[],
    itemKey: string,
    isHighlighted?: boolean,
    onClick?: MouseEventHandler<HTMLDivElement> | undefined,
    onKeyChange?: (newKey: string) => void,
}> = (props) => {
    const popoverCloseRef = React.useRef<HTMLButtonElement>(null);
    const [isSelected, setIsSelected] = React.useState(props.isHighlighted ?? false);
    const [currentKey, setCurrentKey] = React.useState<string>(props.itemKey);
    const [error, setError] = React.useState<string | null>(null);
    const isValidKey = error === null;
    const externalIsSelected = props.isHighlighted != undefined;
    const hasChanges = currentKey !== props.itemKey;

    useEffect(() => {
        console.log('key changed', currentKey);
        if (currentKey.length <= 0) {
            setError("Key must not be empty.");
            return;
        }
        if (props.allOtherKeys.includes(currentKey)) {
            setError("Key already exists.");
            return;
        }
        setError(null);
    }, [currentKey, props.allOtherKeys]);

    return <Popover>
        <PopoverTrigger>
            <KeyBadge itemKey={props.itemKey} isHighlighted={externalIsSelected ? props.isHighlighted! : isSelected} onClick={(e) => {
                if (props.onClick != undefined) {
                    props.onClick(e);
                } else {
                    setIsSelected(externalIsSelected ? props.isHighlighted! : true)
                }
            }} />
        </PopoverTrigger>
        <PopoverContent className="max-w-64" align="start" data-no-dnd="true" >
            <div className="flex flex-col gap-2 w-full">
                <div className="flex flex-row gap-2 items-center justify-between mb-2">
                    <Label className='text-sm font-semibold'>Item Key</Label>
                    <PopoverClose
                        ref={popoverCloseRef}
                        className='top-2 right-2 rounded-full p-1 hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background'
                    >
                        <X className='size-4' />
                    </PopoverClose>
                </div>
                <div className="flex flex-row gap-2 items-center">
                    <Input
                        value={currentKey}
                        autoFocus
                        onChange={(e) => {
                            setCurrentKey(e.target.value.trim());
                        }}
                        className='w-full'
                    />
                </div>
                <div className="flex flex-row gap-2 justify-end items-center">
                    {error && <span className='text-xs grow text-red-800'>{error}</span>}
                    <Button
                        disabled={!hasChanges}
                        className="shrink-0"
                        size={'icon'}
                        variant={'outline'}
                        onClick={() => {
                            setCurrentKey(props.itemKey)
                        }}
                    >
                        <RotateCcw className='size-4 text-muted-foreground' />
                    </Button>
                    <Button
                        className="shrink-0"
                        size={'icon'}
                        variant={'outline'}
                        disabled={!isValidKey}
                        onClick={() => {
                            popoverCloseRef.current?.click();
                            props.onKeyChange?.(currentKey);
                        }}
                    >
                        <Check className='size-4 text-muted-foreground' color="green" />
                    </Button>
                </div>
            </div>
        </PopoverContent>
    </Popover>;
}