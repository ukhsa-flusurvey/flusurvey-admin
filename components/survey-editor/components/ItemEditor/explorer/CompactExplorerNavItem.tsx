import SortableItem from '@/components/survey-editor/components/general/SortableItem';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { BoxSelectIcon, LucideIcon, Shield } from 'lucide-react';


interface CompactExplorerNavItemProps {
    sortableID?: string;
    className?: string;
    icon: LucideIcon;
    isActive?: boolean;
    isDragged?: boolean;
    tooltip?: string;
    style?: React.CSSProperties;
    isConfidential?: boolean;
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
                    className={cn(props.className, '[&_svg]:size-6')}
                    onDoubleClick={props.onDoubleClick}
                    onClick={props.onClick}
                    style={props.style}
                >
                    {props.isConfidential && <span className='p-1 [&_svg]:size-2 absolute -top-1 -right-1 bg-neutral-600/90 rounded-full text-white'>
                        <Shield className='size-2' />
                    </span>}
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
                    <BoxSelectIcon />
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
