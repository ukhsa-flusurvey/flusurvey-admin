import React from 'react';
import { KeyValuePairDefs } from '../../types';
import { ChevronRightIcon } from 'lucide-react';

interface ListItemViewProps {
    entry: string | KeyValuePairDefs;
}

const ListItemView: React.FC<ListItemViewProps> = (props) => {
    let content: React.ReactNode;
    if (typeof props.entry === 'string') {
        content = <span>{props.entry}</span>;
    }
    return (
        <div className='flex items-center gap-2 justify-between w-full'>
            <div>
                {content}
            </div>
            <div>
                <ChevronRightIcon className='size-4 text-muted-foreground' />
            </div>
        </div>
    );
};

export default ListItemView;
