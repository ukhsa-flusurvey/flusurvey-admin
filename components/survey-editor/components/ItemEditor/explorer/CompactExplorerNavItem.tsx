import SortableItem from '@/components/survey-editor/components/general/SortableItem';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { BoxSelect, LucideIcon } from 'lucide-react';


interface CompactExplorerNavItemProps {
    sortableID?: string;
    className?: string;
    icon: LucideIcon;
    isActive?: boolean;
    isDragged?: boolean;
    tooltip?: string;
    style?: React.CSSProperties;
    onClick?: () => void;
    onDoubleClick?: () => void;
}


const CompactExplorerNavItem: React.FC<CompactExplorerNavItemProps> & { EmptyList: typeof EmptyList } = (props) => {
    let variant = 'ghost';
    if (props.isActive) {
        variant = 'default';
    } else if (props.isDragged) {
        variant = 'secondary';
    }

    const content = (
        <Tooltip
            delayDuration={0}>
            <TooltipTrigger asChild>
                <Button
                    size={'icon'}
                    variant={variant as 'ghost' | 'link' | 'default' | 'secondary' | 'destructive' | 'outline' | null | undefined}
                    className={props.className}
                    onDoubleClick={props.onDoubleClick}
                    onClick={props.onClick}
                    style={props.style}
                >
                    <props.icon className='size-6' />
                </Button>
            </TooltipTrigger>
            <TooltipContent side="right" className="flex items-center gap-4">
                <p className='text-sm'>
                    {props.tooltip}
                </p>
            </TooltipContent>
        </Tooltip>
    );

    if (props.sortableID) {
        return <SortableItem id={props.sortableID}>
            {content}
        </SortableItem>
    }
    return content;
};

const EmptyList: React.FC = () => {
    return (
        <Tooltip
            delayDuration={0}>
            <TooltipTrigger asChild>
                <div
                    className='text-gray-500 py-2 '
                >
                    <BoxSelect />
                </div>
            </TooltipTrigger>
            <TooltipContent side="right" className="flex items-center gap-4">
                <p className='text-sm'>List is empty, add the first item with the button below</p>
            </TooltipContent>
        </Tooltip>
    )
}
CompactExplorerNavItem.EmptyList = EmptyList;

export default CompactExplorerNavItem;
