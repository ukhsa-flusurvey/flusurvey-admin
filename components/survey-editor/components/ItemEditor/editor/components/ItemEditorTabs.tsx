import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Asterisk, Bolt, Eye, Languages, ToggleLeft } from 'lucide-react';
import React from 'react';
import ContentEditor from './ContentEditor';
import { SurveyItem } from 'survey-engine/data_types';
import ItemPreview from './ItemPreview';
import { getItemTypeInfos } from '@/components/survey-editor/utils/utils';

interface ItemEditorTabsProps {
    surveyItem: SurveyItem;
    onUpdateSurveyItem: (item: SurveyItem) => void;
}

const ItemEditorTabs: React.FC<ItemEditorTabsProps> = (props) => {

    const typeInfos = getItemTypeInfos(props.surveyItem);

    if (typeInfos.key === 'pageBreak') {
        return (
            <div className='flex items-center justify-center grow'>
                <p className='text-gray-600'>
                    Page breaks does not have any content to edit.
                </p>
            </div>
        );
    }

    console.log(typeInfos);


    return (
        <Tabs defaultValue="content" className="w-full p-4">
            <div className='flex justify-center'>
                <TabsList className=''>
                    <TabsTrigger value="content">
                        <span>
                            <Languages className='me-1 size-4 text-neutral-500' />
                        </span>
                        Content
                    </TabsTrigger>

                    <TabsTrigger value="condition">
                        <span>
                            <ToggleLeft className='me-1 size-4 text-neutral-500' />
                        </span>
                        Condition
                    </TabsTrigger>

                    <TabsTrigger value="validation">
                        <span>
                            <Asterisk className='me-1 size-4 text-neutral-500' />
                        </span>
                        Validation
                    </TabsTrigger>

                    <TabsTrigger value="advanced">
                        <span>
                            <Bolt className='me-1 size-4 text-neutral-500' />
                        </span>
                        Advanced
                    </TabsTrigger>

                    <TabsTrigger value="preview">
                        <span>
                            <Eye className='me-1 size-4 text-neutral-500' />
                        </span>
                        Preview
                    </TabsTrigger>

                </TabsList>
            </div>

            <TabsContent value="content">
                <ContentEditor
                    surveyItem={props.surveyItem}
                    onUpdateSurveyItem={props.onUpdateSurveyItem}
                />
            </TabsContent>

            <TabsContent value="condition">
                <div>Condition</div>
            </TabsContent>

            <TabsContent value="validation">
                <div>Validation</div>
            </TabsContent>

            <TabsContent value="advanced">
                <div>Advanced</div>
            </TabsContent>

            <TabsContent value="preview">
                <ItemPreview
                    surveyItem={props.surveyItem}
                />
            </TabsContent>


        </Tabs>
    );
};

export default ItemEditorTabs;
