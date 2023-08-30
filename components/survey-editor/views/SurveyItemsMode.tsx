import React from 'react';
import ItemExplorerColumn from '../components/ItemExplorerColumn';
import { SurveyEditor } from 'case-editor-tools/surveys/survey-editor/survey-editor'
import { generatePageBreak } from 'case-editor-tools/surveys/utils/simple-generators';
import NewItemDialog from '../components/NewItemDialog';

interface SurveyItemsModeProps {
    editorInstance: SurveyEditor;
}


const SurveyItemsMode: React.FC<SurveyItemsModeProps> = (props) => {
    const [counter, setCounter] = React.useState(0);
    const [newItemDialogMode, setNewItemDialogMode] = React.useState<{
        actionKey: string,
        path: string,
    } | null>(null);

    return (<>
        <div className='relative h-screen'>
            <div className='fixed top-0 h-12 w-full border-b border-red-600'>
                menu bar
            </div>
            <div className='flex pt-12 h-full '>
                <div className=' max-w-[800px] overflow-x-scroll '>
                    <ItemExplorerColumn
                        itemGroup={props.editorInstance.getSurvey().surveyDefinition}
                        onAddItem={(actionKey, path) => {
                            console.log('add item', actionKey, path);
                            if (actionKey === 'pageBreak') {
                                props.editorInstance.addExistingSurveyItem(generatePageBreak(path), path);
                            } else {
                                setNewItemDialogMode({
                                    actionKey: actionKey,
                                    path: path,
                                });
                            }

                            //props.editorInstance.addExistingSurveyItem(item, path);
                            setCounter(counter + 1);
                        }}
                    />
                </div>
                <div className='grow min-w-[400px] bg-black/20 drop-shadow-md border-l border-black'>
                    Inspector
                </div>
            </div>
        </div>
        <NewItemDialog
            currentMode={newItemDialogMode}
            onClose={() => {
                setNewItemDialogMode(null);
            }}
        />
    </>
    );
};

export default SurveyItemsMode;
