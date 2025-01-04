import React, { useContext } from 'react';
import { SurveyGroupItem, SurveyItem, SurveySingleItem } from 'survey-engine/data_types';
import ItemCreator from '../../../explorer/ItemCreator';
import { Button } from '@/components/ui/button';
import { ClipboardCopyIcon, Plus, Shield } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import SortableWrapper from '@/components/survey-editor/components/general/SortableWrapper';
import { getItemColor, getItemTypeInfos, isValidSurveyItemGroup } from '@/components/survey-editor/utils/utils';
import { cn } from '@/lib/utils';
import SortableItem from '@/components/survey-editor/components/general/SortableItem';
import { generateNewItemForType } from '@/components/survey-editor/utils/new-item-init';
import { toast } from 'sonner';
import { ItemEditorContext } from '../../../item-editor-context';
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
} from "@/components/ui/context-menu"
import { useCopyToClipboard } from 'usehooks-ts';

interface ItemListEditorProps {
    surveyItem: SurveyItem;
    onUpdateSurveyItem: (item: SurveyItem) => void;
}

const ItemListEditor: React.FC<ItemListEditorProps> = (props) => {
    const { setSelectedItemKey, setCurrentPath } = useContext(ItemEditorContext);

    const groupItem = props.surveyItem as SurveyGroupItem;
    const [draggedId, setDraggedId] = React.useState<string | null>(null);
    const [, copy] = useCopyToClipboard()


    const currentItems = groupItem.items.map(surveyItem => {
        const isActive = false;
        const { icon, defaultItemClassName } = getItemTypeInfos(surveyItem);
        const isPageBreak = (surveyItem as SurveySingleItem).type === 'pageBreak';
        const isGroup = isValidSurveyItemGroup(surveyItem);
        const itemKey = surveyItem.key?.split('.').pop();
        const isPathActive = false;
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
            isConfidential: (surveyItem as SurveySingleItem).confidentialMode !== undefined,
        }
    })

    const draggedItem = draggedId ? currentItems.find(item => item.id === draggedId) : null;

    const onAddNewSurveyItem = (newItemInfos: { itemType: string; parentKey: string; }) => {

        const newSurveyItem = generateNewItemForType({
            itemType: newItemInfos.itemType,
            parentGroup: groupItem,
        });

        if (newSurveyItem) {
            groupItem.items.push(newSurveyItem);
        }
        toast.success('New item added');
        props.onUpdateSurveyItem(groupItem);
    }

    const onInsertFromClipboard = async (parentKey: string) => {
        try {
            const clipboardContent = await navigator.clipboard.readText();
            const content = JSON.parse(clipboardContent);

            if (!content || !content.key || content.key === '') {
                toast.error('Clipboard content is not valid');
                return;
            }

            const oldKey = content.key as string;
            if (oldKey === parentKey) {
                toast.error("Can't insert item into itself");
                return;
            }

            let copiedItemKey = oldKey.split('.').pop();
            if (copiedItemKey === undefined) {
                toast.error('Clipboard content is not valid');
                return;
            }



            // check if item already exists
            const existingItem = groupItem.items?.find(item => {
                const itemKey = item.key.split('.').pop();
                return itemKey === copiedItemKey;
            })
            if (existingItem) {
                copiedItemKey = copiedItemKey + '_copy';
            }

            const newKey = parentKey + '.' + copiedItemKey;
            let newClipboardContent = clipboardContent.replaceAll(`"${oldKey}"`, `"${newKey}"`);
            newClipboardContent = newClipboardContent.replaceAll(`"${oldKey}.`, `"${newKey}.`);
            const contentToInsert = JSON.parse(newClipboardContent);

            groupItem.items.push(contentToInsert);
            toast.success('New item inserted');
            props.onUpdateSurveyItem(groupItem);
        } catch (error) {
            toast.error('Error reading clipboard content');
            console.error(error);
        }

    }

    return (
        <div className='flex-1 pb-6'>
            <h3 className='font-semibold text-base'>Items of {groupItem.key} </h3>
            <p className='text-sm text-neutral-600'>Double click on item to open it, drag and drop to reorder.</p>

            {groupItem.items.length === 0 &&
                <p className='text-sm text-neutral-600'>No items found.</p>
            }

            <SortableWrapper
                sortableID={`items-of-${groupItem.key}`}
                items={currentItems}
                onDraggedIdChange={(id) => {
                    setDraggedId(id);
                }}
                onReorder={(activeIndex, overIndex) => {
                    const newItems = [...groupItem.items];
                    newItems.splice(activeIndex, 1);
                    newItems.splice(overIndex, 0, groupItem.items[activeIndex]);
                    const newGroup: SurveyGroupItem = {
                        ...groupItem,
                        items: newItems,
                    }
                    props.onUpdateSurveyItem(newGroup);
                }}
                dragOverlayItem={(draggedId && draggedItem) ?
                    <div
                        className={cn(
                            'flex w-full gap-2 py-3 h-auto px-3 text-start bg-slate-50 rounded-lg border',
                            draggedItem.className,
                            {
                                'font-bold': draggedItem.isPathActive,
                            })
                        }
                        style={{
                            color: draggedItem.textColor,
                            borderColor: draggedItem.textColor,
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

                <ol className='px-1 space-y-2 py-4'>
                    {currentItems.map(item => (
                        <SortableItem
                            id={item.id}
                            key={item.id}

                        >
                            <ContextMenu>
                                <ContextMenuTrigger>
                                    <Button
                                        variant={'outline'}
                                        className={cn(
                                            'w-full gap-2 py-3 h-auto px-3 text-start',
                                            item.className,
                                            {
                                                'font-bold': item.isPathActive,
                                            })}
                                        style={{
                                            color: item.textColor,
                                            borderColor: item.textColor,
                                        }}
                                        onDoubleClick={() => {
                                            setCurrentPath(groupItem.key);
                                            setSelectedItemKey(item.id);
                                        }}
                                    >
                                        <div>
                                            <item.icon className='size-5' />
                                        </div>
                                        <span className={cn(
                                            'grow',
                                        )}>{item.label}</span>
                                        {item.isConfidential && <span className='p-1 bg-neutral-600/90 rounded-full text-white'>
                                            <Shield className='size-4' />
                                        </span>}

                                    </Button>
                                </ContextMenuTrigger>
                                <ContextMenuContent>
                                    <ContextMenuItem
                                        onClick={() => {
                                            const surveyItemToCopy = (props.surveyItem as SurveyGroupItem).items.find(i => i.key === item.id);
                                            if (!surveyItemToCopy) {
                                                toast.error('Item not found');
                                                return;
                                            }
                                            const surveyItemJSON = JSON.stringify(surveyItemToCopy, null, 2);
                                            copy(surveyItemJSON);
                                            toast('Item copied to clipboard');
                                        }}
                                    >
                                        <ClipboardCopyIcon className='size-4' />
                                        <span className='ml-2'>Copy</span>
                                    </ContextMenuItem>
                                </ContextMenuContent>
                            </ContextMenu>
                        </SortableItem>
                    ))}
                </ol>

            </SortableWrapper>

            <Separator className='bg-border' />
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
                    parentKey={groupItem.key}
                    onAddItem={onAddNewSurveyItem}
                    onInsertFromClipboard={onInsertFromClipboard}
                />
            </div>
        </div>
    );
};

export default ItemListEditor;
