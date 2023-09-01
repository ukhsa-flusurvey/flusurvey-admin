import React from 'react';
import ItemExplorerColumn from '../components/ItemExplorerColumn';
import { SurveyEditor } from 'case-editor-tools/surveys/survey-editor/survey-editor'
import { generatePageBreak } from 'case-editor-tools/surveys/utils/simple-generators';
import NewItemDialog from '../components/NewItemDialog';

import clsx from 'clsx';
import ItemInspector from '../components/ItemInspector';
import { SurveyItem } from 'survey-engine/data_types';
import EditorMenu from '../components/EditorMenu';

interface SurveyItemsModeProps {
    editorInstance: SurveyEditor;
}


const SurveyItemsMode: React.FC<SurveyItemsModeProps> = (props) => {
    const [counter, setCounter] = React.useState(0);
    const [newItemDialogMode, setNewItemDialogMode] = React.useState<{
        actionKey: string,
        path: string,
    } | null>(null);

    const [selectedItem, setSelectedItem] = React.useState<SurveyItem | null>(null);

    const [isInspectorExpanded, setIsInspectorExpanded] = React.useState(false);

    return (<>
        <div className='relative h-screen'>
            <EditorMenu
                title='Survey Items'
                editorInstance={props.editorInstance}
            />
            <div className='flex pt-12 h-full relative'>
                <div className='overflow-x-scroll '>
                    <ItemExplorerColumn
                        itemGroup={props.editorInstance.getSurvey().surveyDefinition}
                        onItemSelect={(item) => {
                            setSelectedItem(item);
                        }}
                        onAddItem={(actionKey, path) => {
                            if (actionKey === 'pageBreak') {
                                props.editorInstance.addExistingSurveyItem(generatePageBreak(path), path);
                            } else {
                                setNewItemDialogMode({
                                    actionKey: actionKey,
                                    path: path,
                                });
                            }
                            setCounter(counter + 1);
                        }}
                        onItemsReorder={(newGroup) => {
                            props.editorInstance.updateSurveyItem(newGroup);
                            setCounter(counter + 1);
                        }}
                    />
                </div>
                <div className='grow'></div>
                {selectedItem &&
                    <div className={clsx('grow h-full flex min-w-[400px] border-l bg-yellow drop-shadow-[-4px_2px_5px_rgba(0,0,0,0.25)] z-10 transition',
                        {
                            'fixed right-0 top-0 pt-12 left-36': isInspectorExpanded,
                            'max-w-[500px] min-w-[500px]': !isInspectorExpanded,
                        }
                    )}>
                        <ItemInspector
                            isExpanded={isInspectorExpanded}
                            onExpandToggle={(isExpanded) => {
                                setIsInspectorExpanded(isExpanded);
                            }}

                            selectedItem={selectedItem}
                            onClearSelection={() => {
                                setSelectedItem(null);
                                setIsInspectorExpanded(false);
                            }}

                            onItemKeyChange={(oldKey, newKey) => {
                                const itemWithSameKey = props.editorInstance.findSurveyItem(newKey);
                                if (itemWithSameKey) return false;
                                props.editorInstance.changeItemKey(oldKey, newKey)

                                const newItem = props.editorInstance.findSurveyItem(newKey);
                                if (!newItem) return false;
                                setSelectedItem({ ...newItem });
                                return true
                            }}
                        // onItemUpdate
                        // onItemDelete
                        // onMoveItem
                        />
                    </div>}

            </div>
        </div>
        <NewItemDialog
            currentMode={newItemDialogMode}
            onCreateItem={(item, path) => {
                props.editorInstance.addExistingSurveyItem(item, path);
                setNewItemDialogMode(null);
                setCounter(counter + 1);
            }}
            onClose={() => {
                setNewItemDialogMode(null);
            }}
        />
    </>
    );
};

export default SurveyItemsMode;
