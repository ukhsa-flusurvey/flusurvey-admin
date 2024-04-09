import { getItemTypeInfos } from '@/components/survey-editor/utils/utils';
import React from 'react';
import { SurveyItem } from 'survey-engine/data_types';
import SurveyEndEditor from './SurveyEndEditor';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { CircleHelp } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import SurveyLanguageToggle from '@/components/survey-editor/components/general/SurveyLanguageToggle';
import '@mdxeditor/editor/style.css'
import HelpGroupEditor from './help-group-editor';

interface ItemTypeEditorSelectorProps {
    surveyItem: SurveyItem;
    onUpdateSurveyItem: (item: SurveyItem) => void;
}

const ItemTypeEditorSelector: React.FC<ItemTypeEditorSelectorProps> = (props) => {
    const typeInfos = getItemTypeInfos(props.surveyItem);


    if (typeInfos.key === 'surveyEnd') {
        return (
            <div className='py-4'>
                <SurveyEndEditor
                    surveyItem={props.surveyItem}
                    onUpdateSurveyItem={props.onUpdateSurveyItem}
                />
            </div>
        );
    } else if (typeInfos.key === 'display') {
        return (
            <div className='flex items-center justify-center grow'>
                <p className='text-gray-600'>
                    TODO: Display content editor
                </p>
            </div>
        );
    }

    return (
        <div>

            <div className='mx-auto py-6'>

                <Accordion type="single" collapsible>
                    <AccordionItem value="title">
                        <AccordionTrigger>
                            Title
                        </AccordionTrigger>
                        <AccordionContent>
                            <div className='flex justify-center'>
                                <div className='w-full max-w-[800px]'>
                                    <SurveyLanguageToggle />
                                    Yes. It adheres to the WAI-ARIA design pattern.
                                    <Input />

                                    <Collapsible className='group'>
                                        <CollapsibleTrigger

                                        >
                                            <span
                                                className='group-data-[state=open]:bg-red-500'
                                            >
                                                test
                                            </span>
                                            Can I use this in my project?</CollapsibleTrigger>
                                        <CollapsibleContent>
                                            Yes. Free to use for personal and commercial projects. No attribution
                                            required.
                                            <Input />
                                        </CollapsibleContent>
                                    </Collapsible>
                                </div>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                        <AccordionTrigger>Subtitle</AccordionTrigger>
                        <AccordionContent className='p-2'>
                            Yes. It adheres to the WAI-ARIA design pattern.
                            <Input
                            />
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3">
                        <AccordionTrigger>
                            <span className='flex items-center'>
                                <span>
                                    <CircleHelp className='size-4 mr-2' />
                                </span>
                                Help/Info popup
                            </span>
                        </AccordionTrigger>
                        <AccordionContent>
                            <HelpGroupEditor
                                surveyItem={props.surveyItem}
                                onUpdateSurveyItem={props.onUpdateSurveyItem}
                            />
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
                <p>
                    TODO: get header components
                </p>
                <p>
                    top component
                </p>

                <p>
                    response - specific to question type - single choice, multiple choice, etc. - hint for custom
                </p>
                <p>
                    bottom component
                </p>
                <p>
                    footnote
                </p>
            </div>
        </div>
    );
};

export default ItemTypeEditorSelector;
