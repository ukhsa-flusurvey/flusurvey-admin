'use client'

import { Separator } from '@/components/ui/separator';
import React, { useEffect } from 'react';
import { SurveyGroupItem, SurveySingleItem } from 'survey-engine/data_types';
import ItemCreator from './ItemCreator';
import { BoxSelect, ChevronRight, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getItemColor, getItemTypeInfos, getItemKeyFromFullKey, isValidSurveyItemGroup } from '../../../utils/utils';
import { cn } from '@/lib/utils';
import SortableSurveyGroupWrapper from './SortableSurveyGroupWrapper';
import SortableItem from '@/components/survey-editor/components/general/SortableItem';

interface ExplorerColumnProps {
    root: SurveyGroupItem;
    currentPath: string | null;
    selectedItemId: string | null;
    onSelectItem: (itemKey: string | null) => void;
    onChangePath: (newPath: string) => void;
    onAddItem: (newItemInfos: {
        itemType: string;
        parentKey: string;
    }) => void;
    onItemsReorder: (newGroup: SurveyGroupItem) => void;
}


const ExplorerColumn: React.FC<ExplorerColumnProps> = (props) => {
    const [draggedId, setDraggedId] = React.useState<string | null>(null);
    let subItemGroup: null | SurveyGroupItem = null;

    const childColRef = React.useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (childColRef.current) {
            childColRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'end'
            });
        }
    }, [props.currentPath]);


    if (props.currentPath !== props.root.key) {
        const subGroupKey = [props.root.key, props.currentPath?.replace(props.root.key + '.', '').split('.')[0]].join('.');

        const subItem = props.root.items.find(item => item.key === subGroupKey);
        if (subItem) {
            subItemGroup = subItem as SurveyGroupItem;
        }
    }

    const currentItems = props.root.items.map(surveyItem => {
        const isActive = surveyItem.key === props.selectedItemId;
        const { icon, defaultItemClassName } = getItemTypeInfos(surveyItem);
        const isPageBreak = (surveyItem as SurveySingleItem).type === 'pageBreak';
        const isGroup = isValidSurveyItemGroup(surveyItem);
        const itemKey = surveyItem.key?.split('.').pop();
        const isPathActive = props.currentPath?.includes(surveyItem.key);
        const itemColor = getItemColor(surveyItem);

        return {
            id: surveyItem.key,
            icon: icon,
            className: isActive ? undefined : defaultItemClassName,
            textColor: isActive ? undefined : itemColor,
            isActive,
            isPathActive,
            isGroup,
            label: isPageBreak ? 'Page break' : itemKey,
        }
    })

    const draggedItem = draggedId ? currentItems.find(item => item.id === draggedId) : null;

    return (
        <div className='h-full flex'>
            <div className='bg-white/60 backdrop-blur-md border-r border-black/20 min-w-[220px] overflow-y-scroll' >
                <div className='font-mono bg-white/30 px-3 py-2 text-sm'>
                    {getItemKeyFromFullKey(props.root.key)}
                </div>
                <Separator className='bg-black/20' />

                {currentItems.length === 0 &&
                    <div className='text-muted-foreground flex flex-col items-center py-4 gap-1'>
                        <div>
                            <BoxSelect className='size-6' />
                        </div>
                        <p className='text-sm'>
                            Empty group
                        </p>
                    </div>}

                <SortableSurveyGroupWrapper
                    sortableID={`column-explorer-${props.root.key}`}
                    items={currentItems}
                    onDraggedIdChange={(id) => {
                        setDraggedId(id);
                    }}
                    onReorder={(activeIndex, overIndex) => {
                        const newItems = [...props.root.items];
                        newItems.splice(activeIndex, 1);
                        newItems.splice(overIndex, 0, props.root.items[activeIndex]);
                        const newGroup = {
                            ...props.root,
                            items: newItems,
                        }
                        props.onItemsReorder(newGroup);
                    }}
                    dragOverlayItem={(draggedId && draggedItem) ?
                        <div
                            className={cn(
                                'flex w-full gap-2 py-2 h-auto px-3 text-start bg-slate-50 rounded-lg',
                                draggedItem.className,
                                {
                                    'font-bold': draggedItem.isPathActive,
                                })
                            }
                            style={{
                                color: draggedItem.textColor,
                            }}

                        >
                            <div>
                                <draggedItem.icon className='size-5' />
                            </div>
                            <span className={cn(
                                'grow',
                            )}>{draggedItem.label}</span>

                        </div>
                        : null}
                >

                    <ol className='px-1 space-y-1 py-2'>
                        {currentItems.map(item => (
                            <SortableItem
                                id={item.id}
                                key={item.id}

                            >
                                <Button
                                    variant={item.isActive ? 'default' : (item.isPathActive ? 'secondary' : 'ghost')}
                                    className={cn(
                                        'w-full gap-2 py-2 h-auto px-3 text-start',
                                        item.className,
                                        {
                                            'font-bold': item.isPathActive,
                                        })}
                                    style={{
                                        color: item.textColor,
                                    }}
                                    onClick={() => {
                                        props.onSelectItem(item.id)
                                        if (item.isGroup) {
                                            props.onChangePath(item.id);
                                            return;
                                        } else if (props.currentPath !== props.root.key) {
                                            props.onChangePath(props.root.key);
                                        }
                                    }}
                                >
                                    <div>
                                        <item.icon className='size-5' />
                                    </div>
                                    <span className={cn(
                                        'grow',
                                    )}>{item.label}</span>
                                    {item.isGroup && <ChevronRight className='size-4' />}
                                </Button>
                            </SortableItem>
                        ))}
                    </ol>

                </SortableSurveyGroupWrapper>

                <Separator className='bg-black/20' />
                <div className='px-1 py-1'>
                    <ItemCreator
                        trigger={
                            <Button
                                variant='ghost'
                                className='w-full gap-2'
                                size={'sm'}
                            >
                                <Plus className='size-4' />
                                Add a new item
                            </Button>
                        }
                        parentKey={props.root.key}
                        onAddItem={props.onAddItem}
                    />
                </div>
            </div>

            {subItemGroup &&
                <div ref={
                    childColRef
                }>
                    <ExplorerColumn
                        root={subItemGroup}
                        currentPath={props.currentPath}
                        selectedItemId={props.selectedItemId}
                        onSelectItem={props.onSelectItem}
                        onChangePath={props.onChangePath}
                        onAddItem={props.onAddItem}
                        onItemsReorder={props.onItemsReorder}
                    />
                </div>}

        </div>
    );
};

export default ExplorerColumn;
