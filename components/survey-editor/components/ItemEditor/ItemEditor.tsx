import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { cn } from '@/lib/utils';
import React, { useContext } from 'react';
import { SurveyGroupItem, SurveyItem } from 'survey-engine/data_types';
import { SurveyEditor as EditorInstance } from 'case-editor-tools/surveys/survey-editor/survey-editor';
import CompactExplorer from './explorer/CompactExplorer';
import ExplorerColumn from './explorer/ExplorerColumn';
import EditorView from './editor/EditorView';
import { getParentKeyFromFullKey, getSurveyItemsAsFlatList, isValidSurveyItemGroup } from '../../utils/utils';
import { toast } from 'sonner';
import { generateNewItemForType } from '../../utils/new-item-init';
import { SurveyContext } from '../../surveyContext';

interface ItemEditorProps {
    className?: string;

}

const ItemEditor: React.FC<ItemEditorProps> = (props) => {
    const {
        survey,
        setSurvey,
    } = useContext(SurveyContext);
    const [isCollapsed, setIsCollapsed] = React.useState(true);
    const [editorInstance, setEditorInstance] = React.useState<EditorInstance | undefined>(survey ? new EditorInstance(survey) : undefined);
    const [selectedItemKey, setSelectedItemKey] = React.useState<string | null>(null);
    const [currentPath, setCurrentPath] = React.useState<string | null>(null);
    //const [counter, setCounter] = React.useState(0);

    React.useEffect(() => {
        if (survey) {
            setEditorInstance(new EditorInstance(survey));
        }
    }, [survey]);

    if (!editorInstance) {
        return <div>load survey first...</div>
    }

    const onAddNewSurveyItem = (newItemInfos: { itemType: string; parentKey: string; }) => {
        const parentItem = editorInstance.findSurveyItem(newItemInfos.parentKey);
        if (!parentItem || !isValidSurveyItemGroup(parentItem)) {
            console.warn('Parent not found or not a group: ', newItemInfos.parentKey);
            return;
        }

        const newSurveyItem = generateNewItemForType({
            itemType: newItemInfos.itemType,
            parentGroup: parentItem as SurveyGroupItem,
        });

        if (newSurveyItem) {
            const createdItem = editorInstance.addExistingSurveyItem(newSurveyItem, newItemInfos.parentKey);
            if (createdItem) {
                setSelectedItemKey(createdItem.key);
            }
        }
        toast.success('New item added');
        setSurvey(editorInstance.getSurvey());
    }


    return (
        <div
            className={cn('overflow-hidden', props.className)}
        >
            <ResizablePanelGroup direction="horizontal">
                <ResizablePanel
                    minSize={15}
                    maxSize={60}
                    defaultSize={1}
                    collapsedSize={1}
                    collapsible={true}
                    className='min-w-[56px]'
                    onCollapse={() => {
                        setIsCollapsed(true);
                    }}
                    onExpand={() => {
                        setIsCollapsed(false);
                    }}
                >
                    <div className='w-full bg-black/10 overflow-auto overscroll-contain h-full'
                    >
                        {
                            isCollapsed && <CompactExplorer
                                root={{ ...editorInstance.getSurvey().surveyDefinition }}
                                selectedItemId={selectedItemKey}
                                currentPath={currentPath}
                                onSelectItem={(itemKey) => {
                                    setSelectedItemKey(itemKey);
                                }}
                                onChangePath={(newPath) => {
                                    setCurrentPath(newPath);
                                }}
                                onAddItem={onAddNewSurveyItem}
                                onItemsReorder={(newGroup) => {
                                    editorInstance.updateSurveyItem(newGroup);
                                    setSurvey(editorInstance.getSurvey());
                                }}
                            />
                        }

                        {
                            !isCollapsed && <ExplorerColumn
                                root={{ ...editorInstance.getSurvey().surveyDefinition }}
                                selectedItemId={selectedItemKey}
                                currentPath={currentPath}
                                onSelectItem={(itemKey) => {
                                    setSelectedItemKey(itemKey);
                                }}
                                onChangePath={(newPath) => {
                                    setCurrentPath(newPath);
                                }}
                                onAddItem={onAddNewSurveyItem}
                                onItemsReorder={(newGroup) => {
                                    editorInstance.updateSurveyItem(newGroup);
                                    setSurvey(editorInstance.getSurvey());
                                }}
                            />
                        }
                    </div>
                </ResizablePanel>

                <ResizableHandle withHandle
                    className='bg-neutral-300 cursor-col-resize'
                />

                <ResizablePanel
                    defaultSize={67}
                >
                    <div className='w-full overflow-auto h-full'
                    >
                        <EditorView
                            surveyItem={selectedItemKey ? editorInstance.findSurveyItem(selectedItemKey) : undefined}
                            surveyItemList={getSurveyItemsAsFlatList(editorInstance.getSurvey().surveyDefinition)}

                            onChangeItemColor={(newColor) => {
                                if (selectedItemKey) {
                                    const item = editorInstance.findSurveyItem(selectedItemKey);
                                    if (item) {
                                        if (!item.metadata) {
                                            item.metadata = {};
                                        }
                                        item.metadata.editorItemColor = newColor;
                                        editorInstance.updateSurveyItem(item);
                                        setSurvey(editorInstance.getSurvey());
                                    }
                                }
                            }}
                            onDeleteItem={(itemKey) => {
                                const parentKey = getParentKeyFromFullKey(itemKey);
                                const parentItem = editorInstance.findSurveyItem(parentKey);
                                if (!parentItem || !isValidSurveyItemGroup(parentItem)) {
                                    console.warn('Parent not found or not a group: ', itemKey);
                                    return;
                                }
                                (parentItem as SurveyGroupItem).items = (parentItem as SurveyGroupItem).items.filter(item => item.key !== itemKey);
                                editorInstance.updateSurveyItem(parentItem);
                                setSelectedItemKey(null);
                                setSurvey(editorInstance.getSurvey());
                                toast(`Item "${itemKey}" deleted`);
                            }}
                            onMoveItem={(newParentKey, oldItemKey) => {
                                const oldParentKey = getParentKeyFromFullKey(oldItemKey);

                                const parentItem = editorInstance.findSurveyItem(oldParentKey);
                                if (!parentItem) {
                                    alert('parent item not found');
                                    return;
                                };

                                const itemToMove = editorInstance.findSurveyItem(oldItemKey);
                                if (!itemToMove) {
                                    alert('item to move not found');
                                    return;
                                }
                                const newItemKey = itemToMove.key.replace(oldParentKey, newParentKey);


                                const existingItemWithSameKey = editorInstance.findSurveyItem(newItemKey);
                                if (existingItemWithSameKey) {
                                    alert('item with same key already exists, rename the item first');
                                    return;
                                }

                                editorInstance.changeItemKey(oldItemKey, newItemKey);

                                const tempItem: SurveyItem = { ...(parentItem as SurveyGroupItem).items.find(item => item.key === newItemKey) } as SurveyItem;
                                (parentItem as SurveyGroupItem).items = (parentItem as SurveyGroupItem).items.filter(item => item.key !== newItemKey);
                                editorInstance.addExistingSurveyItem(tempItem, newParentKey);

                                // insert new item
                                if (!tempItem) {
                                    alert('item during move could not be found');
                                    return;
                                }

                                setCurrentPath(newParentKey);
                                setSelectedItemKey(newItemKey);

                                toast(`Move successful. New item key: "${newItemKey}"`, {
                                    description: 'References to the item are not updated. Please update them manually.'
                                });
                                setSurvey(editorInstance.getSurvey());
                            }}
                            onChangeKey={(oldKey, newKey) => {
                                editorInstance.changeItemKey(oldKey, newKey);
                                setSelectedItemKey(newKey);
                                setSurvey(editorInstance.getSurvey());
                                toast(`Key changed from "${oldKey}" to "${newKey}"`, {
                                    description: 'References to the item are not updated. Please update them manually.'
                                });
                            }}
                            onUpdateSurveyItem={(item) => {
                                if (!editorInstance.findSurveyItem(item.key)) {
                                    toast(`Couldn't find survey item with key "${item.key}".`,
                                        {
                                            description: 'To change the key, use the key editor feature instead of the source editor.'
                                        }
                                    )
                                    return;
                                }
                                editorInstance.updateSurveyItem(item);
                                setSurvey(editorInstance.getSurvey());
                                toast('Survey item updated')
                            }}
                        />
                    </div>
                </ResizablePanel>

            </ResizablePanelGroup>
        </div>
    );
};

export default ItemEditor;
