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

    let tabs = [
        {
            icon: <Languages className='me-1 size-4 text-neutral-500' />,
            label: 'Content',
        },
        {
            icon: <ToggleLeft className='me-1 size-4 text-neutral-500' />,
            label: 'Condition',
        },
        {
            icon: <Asterisk className='me-1 size-4 text-neutral-500' />,
            label: 'Validation',
        },
        {
            icon: <Bolt className='me-1 size-4 text-neutral-500' />,
            label: 'Advanced',
        },
        {
            icon: <Eye className='me-1 size-4 text-neutral-500' />,
            label: 'Preview',
        },
    ]

    if (typeInfos.key === 'pageBreak') {
        return (
            <div className='flex items-center justify-center grow'>
                <p className='text-gray-600'>
                    Page breaks do not have any content to edit.
                </p>
            </div>
        );
    } else if (typeInfos.key === 'group') {
        return (
            <div className='flex items-center justify-center grow'>
                <p className='text-gray-600'>
                    Groups do not have any content to edit.
                </p>
            </div>
        );
    } else if (typeInfos.key === 'surveyEnd' || typeInfos.key === 'display') {
        tabs = [
            {
                icon: <Languages className='me-1 size-4 text-neutral-500' />,
                label: 'Content',
            },
            {
                icon: <ToggleLeft className='me-1 size-4 text-neutral-500' />,
                label: 'Condition',
            },
            {
                icon: <Bolt className='me-1 size-4 text-neutral-500' />,
                label: 'Advanced',
            },
            {
                icon: <Eye className='me-1 size-4 text-neutral-500' />,
                label: 'Preview',
            },
        ]
    }



    console.log(typeInfos);


    return (
        <Tabs defaultValue="content" className="w-full p-4">
            <div className='flex justify-center'>
                <TabsList className=''>
                    {tabs.map(tab => (
                        <TabsTrigger value={tab.label.toLowerCase()} key={tab.label}>
                            <span>
                                {tab.icon}
                            </span>
                            {tab.label}
                        </TabsTrigger>
                    ))}

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
