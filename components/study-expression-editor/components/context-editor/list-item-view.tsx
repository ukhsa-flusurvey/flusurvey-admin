import React from 'react';
import { KeyValuePairDefs, isKeyValuePairDefs, isStudyVariableDef } from '../../types';
import { ChevronRightIcon } from 'lucide-react';
import { StudyVariableDef } from '../../types';

interface ListItemViewProps {
    entry: string | KeyValuePairDefs | StudyVariableDef;
}

const ListItemView: React.FC<ListItemViewProps> = (props) => {
    let content: React.ReactNode;
    if (typeof props.entry === 'string') {
        content = <span>{props.entry}</span>;
    } else {
        if (isKeyValuePairDefs(props.entry)) {
            content = <div className='space-y-1 max-w-full text-start'>
                <div>{props.entry.key}</div>
                <div className='text-xs text-muted-foreground ps-2 text-wrap font-bold'>
                    {props.entry.possibleValues?.length > 0 ? props.entry.possibleValues.join(', ') :
                        <span className='font-normal'>{'<no values specified>'}</span>}
                </div>
            </div>;
        } else if (isStudyVariableDef(props.entry)) {
            content = <div className='max-w-full text-start flex flex-row gap-2 items-center'>
                <div>{props.entry.key}</div>
                <div className='text-xs text-muted-foreground ps-2 text-wrap font-mono font-semibold'>
                    {props.entry.type}
                </div>
            </div>;
        }
    }
    return (
        <div className='flex items-center gap-2 justify-between w-full'>
            <div className='font-mono'>
                {content}
            </div>
            <div>
                <ChevronRightIcon className='size-4 text-muted-foreground' />
            </div>
        </div>
    );
};

export default ListItemView;
