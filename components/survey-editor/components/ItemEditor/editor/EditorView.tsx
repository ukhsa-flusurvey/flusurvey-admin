import React from 'react';
import { SurveyItem } from 'survey-engine/data_types';
import ItemSourceEditor from './components/ItemSourceEditor';
import { Separator } from '@/components/ui/separator';
import ItemHeader from './components/ItemHeader';
import ItemEditorTabs from './components/ItemEditorTabs';

interface EditorViewProps {
    surveyItem?: SurveyItem;
    surveyItemList: Array<{ key: string, isGroup: boolean }>;
    onChangeItemColor: (newColor: string) => void;
    onDeleteItem: (itemKey: string) => void;
    onMoveItem: (newParentKey: string, oldItemKey: string) => void;
    onChangeKey: (oldKey: string, newKey: string) => void;
    onUpdateSurveyItem: (item: SurveyItem) => void;
}

const EditorView: React.FC<EditorViewProps> = (props) => {
    const [mode, setMode] = React.useState<'source' | 'normal'>('normal');

    if (!props.surveyItem) {
        return (
            <div className='flex items-center justify-center h-full w-full'>
                <p className='text-gray-500'>Select an item to edit</p>
            </div>
        );
    }

    let editor = null;
    if (mode === 'source') {
        editor = (
            <ItemSourceEditor
                surveyItem={props.surveyItem}
                onApply={props.onUpdateSurveyItem}
                onExitSourceMode={() => setMode('normal')}
            />
        );
    } else {
        editor = (
            <ItemEditorTabs
                surveyItem={props.surveyItem}
                onUpdateSurveyItem={props.onUpdateSurveyItem}
            />
        );
    }

    return (
        <div className='min-w-[400px] w-full h-full'>
            <ItemHeader
                surveyItem={props.surveyItem}
                surveyItemList={props.surveyItemList}
                onChangeItemColor={props.onChangeItemColor}
                currentMode={mode}
                onChangeMode={setMode}
                onDeleteItem={() => {
                    if (props.surveyItem) {
                        props.onDeleteItem(props.surveyItem.key);
                    }
                }}
                onMoveItem={props.onMoveItem}
                onChangeKey={props.onChangeKey}
            />
            <Separator className='bg-black/20' />

            {editor}
        </div>
    );
};

export default EditorView;
