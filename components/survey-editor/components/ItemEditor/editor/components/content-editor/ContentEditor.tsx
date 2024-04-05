
import React, { useEffect } from 'react';
import { SurveyItem } from 'survey-engine/data_types';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import ItemPreview from './ItemPreview';
import { useDebounceCallback } from 'usehooks-ts';
import ItemTypeEditorSelector from './ItemTypeEditorSelector';
import SurveyLanguageToggle from '@/components/survey-editor/components/general/SurveyLanguageToggle';

interface ContentEditorProps {
    surveyItem: SurveyItem;
    onUpdateSurveyItem: (item: SurveyItem) => void;
}


const ContentEditor: React.FC<ContentEditorProps> = (props) => {
    const [currentSurveyItem, setCurrentSurveyItem] = React.useState(props.surveyItem);

    const debouncedUpdate = useDebounceCallback(props.onUpdateSurveyItem, 700)

    useEffect(() => {
        if (currentSurveyItem !== props.surveyItem) {
            debouncedUpdate(currentSurveyItem);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentSurveyItem]);



    return (


        <div className='grow h-full'>
            <ResizablePanelGroup direction='horizontal' >
                <ResizablePanel
                    collapsible={true}
                    collapsedSize={1}
                    defaultSize={50}
                    minSize={30}
                >
                    <h3 className='font-semibold text-sm'>Edit content</h3>
                    <ItemTypeEditorSelector
                        surveyItem={props.surveyItem}
                        onUpdateSurveyItem={setCurrentSurveyItem}
                    />
                </ResizablePanel>
                <ResizableHandle
                    withHandle
                />
                <ResizablePanel
                    collapsible={true}
                    collapsedSize={1}
                    defaultSize={50}
                    minSize={30}
                >
                    <div className='w-full overflow-auto max-h-full'>
                        {/**
                             * {
                            icon: <Eye className='me-1 size-4 text-neutral-500' />,
                        label: 'Preview',
        },
                             */}
                        <div className='h-full'>
                            <h3 className='font-semibold text-sm'>Preview</h3>
                            <ItemPreview
                                surveyItem={props.surveyItem}
                            />
                        </div>
                    </div>
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    );
};

export default ContentEditor;
