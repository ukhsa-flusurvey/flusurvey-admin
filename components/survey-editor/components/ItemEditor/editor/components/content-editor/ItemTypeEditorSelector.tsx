import { getItemTypeInfos } from '@/components/survey-editor/utils/utils';
import React from 'react';
import { SurveyItem } from 'survey-engine/data_types';
import SurveyEndEditor from './SurveyEndEditor';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { CircleHelp, Heading1, Heading2, MessageSquareReply, PanelBottom, PanelTop, Subscript } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import SurveyLanguageToggle from '@/components/survey-editor/components/general/SurveyLanguageToggle';
import '@mdxeditor/editor/style.css'
import HelpPopupEditor from './help-popup-editor';
import SubtitleEditor from './subtitle-editor';
import TitleEditor from './title-editor';
import TopContentEditor from './top-content-editor';
import FootnoteEditor from './footnote-editor';

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

                    <div className='mb-6 p-4 rounded-md border border-l-4  border-l-[--survey-card-header-bg]'>

                        <h4 className='text-xs tracking-widest font-semibold'>
                            Header
                        </h4>
                        <AccordionItem value="title">
                            <AccordionTrigger>
                                <span className='flex items-center text-sm'>
                                    <span>
                                        <Heading1 className='size-4 mr-2 text-neutral-600' />
                                    </span>
                                    Title
                                </span>
                            </AccordionTrigger>
                            <AccordionContent>
                                <TitleEditor
                                    surveyItem={props.surveyItem}
                                    onUpdateSurveyItem={props.onUpdateSurveyItem}
                                />
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="subtitle">
                            <AccordionTrigger>
                                <span className='flex items-center text-sm text-muted-foreground'>
                                    <span>
                                        <Heading2 className='size-4 mr-2 text-neutral-600' />
                                    </span>
                                    Subtitle
                                </span>
                            </AccordionTrigger>
                            <AccordionContent>
                                <SubtitleEditor
                                    surveyItem={props.surveyItem}
                                    onUpdateSurveyItem={props.onUpdateSurveyItem}
                                />
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="help-popup">
                            <AccordionTrigger>
                                <span className='flex items-center text-sm text-muted-foreground'>
                                    <span>
                                        <CircleHelp className='size-4 mr-2 text-neutral-600' />
                                    </span>
                                    Help/Info popup
                                </span>
                            </AccordionTrigger>
                            <AccordionContent>
                                <HelpPopupEditor
                                    surveyItem={props.surveyItem}
                                    onUpdateSurveyItem={props.onUpdateSurveyItem}
                                />
                            </AccordionContent>
                        </AccordionItem>
                    </div>


                    <div className='mb-6 p-4 rounded-md border border-l-4  border-[--survey-card-bg]'>

                        <h4 className='text-xs tracking-widest font-semibold'>
                            Body
                        </h4>
                        <AccordionItem value="top-contents">
                            <AccordionTrigger>
                                <span className='flex items-center text-sm text-muted-foreground'>
                                    <span>
                                        <PanelTop className='size-4 mr-2 text-neutral-600' />
                                    </span>
                                    Top content (before response)
                                </span>
                            </AccordionTrigger>
                            <AccordionContent>
                                <TopContentEditor
                                    surveyItem={props.surveyItem}
                                    onUpdateSurveyItem={props.onUpdateSurveyItem}
                                />
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="response">
                            <AccordionTrigger>
                                <span className='flex items-center text-sm'>
                                    <span>
                                        <MessageSquareReply className='size-4 mr-2 text-neutral-600' />
                                    </span>
                                    Response options
                                </span>
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

                        <AccordionItem value="bottom-contents">
                            <AccordionTrigger>
                                <span className='flex items-center text-sm text-muted-foreground'>
                                    <span>
                                        <PanelBottom className='size-4 mr-2 text-neutral-600' />
                                    </span>
                                    Bottom content (after response)
                                </span>
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
                    </div>

                    <div className='ps-4 border-l-4 border-neutral-100'>
                        <AccordionItem value="footnote">
                            <AccordionTrigger>
                                <span className='flex items-center text-sm text-muted-foreground'>
                                    <span>
                                        <Subscript className='size-4 mr-2 text-neutral-600' />
                                    </span>
                                    Footnote
                                </span>
                            </AccordionTrigger>
                            <AccordionContent>
                                <FootnoteEditor
                                    surveyItem={props.surveyItem}
                                    onUpdateSurveyItem={props.onUpdateSurveyItem}
                                />
                            </AccordionContent>
                        </AccordionItem>
                    </div>
                </Accordion>

            </div>
        </div >
    );
};

export default ItemTypeEditorSelector;
