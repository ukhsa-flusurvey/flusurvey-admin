import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Plus } from 'lucide-react';
import React from 'react';

interface AddDropdownProps {
    options: Array<{
        key: string,
        label: string,
        icon: React.ReactNode,
    }>;
    onAddItem: (key: string) => void;
}

const AddDropdown: React.FC<AddDropdownProps> = (props) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant={'outline'} size={'sm'} className='w-60'>
                    <span><Plus className='size-4 me-2' /></span>Add new
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='center'>
                {props.options.map(option => (
                    <DropdownMenuItem key={option.key} className='flex items-center'
                        onClick={() => props.onAddItem(option.key)}
                    >
                        <span>
                            {option.icon}
                        </span>
                        {option.label}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default AddDropdown;
