import React, { useContext } from 'react';
import EditorWrapper from './editor-wrapper';
import SurveyLanguageToggle from '@/components/survey-editor/components/general/SurveyLanguageToggle';
import { SurveyContext } from '@/components/survey-editor/surveyContext';
import { ItemComponent, ItemGroupComponent, LocalizedString, SurveySingleItem } from 'survey-engine/data_types';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { getItemComponentByRole } from '@/components/survey-viewer/survey-renderer/SurveySingleItemView/utils';
import { localisedObjectToMap } from '@/components/survey-editor/utils/localeUtils';
import { Textarea } from '@/components/ui/textarea';

interface FootnoteEditorProps {
    surveyItem: SurveySingleItem;
    onUpdateSurveyItem: (item: SurveySingleItem) => void;
}

const FootnoteEditor: React.FC<FootnoteEditorProps> = (props) => {
    const { selectedLanguage } = useContext(SurveyContext);

    const updateFootnote = (newFootnote?: ItemComponent): SurveySingleItem => {
        if (!newFootnote) {
            return {
                ...props.surveyItem,
                components: {
                    ...props.surveyItem.components,
                    items: props.surveyItem.components?.items.filter(comp => comp.role !== 'footnote')
                } as ItemGroupComponent
            };
        }

        const existingComponents = [];
        if (props.surveyItem.components?.items) {
            existingComponents.push(...props.surveyItem.components.items);
        }

        const itemIndex = existingComponents.findIndex(comp => comp.role === 'footnote');
        if (itemIndex !== -1) {
            existingComponents[itemIndex] = newFootnote;
        } else {
            existingComponents.push(newFootnote);
        }

        return {
            ...props.surveyItem,
            components: {
                ...props.surveyItem.components,
                items: [
                    ...existingComponents,
                ]
            } as ItemGroupComponent
        };
    }

    const onToggleFootnote = (checked: boolean) => {
        if (!checked) {
            if (confirm('Are you sure you want to remove the footnote? You will loose the current content.')) {
                // clear content
                props.onUpdateSurveyItem(updateFootnote(undefined));
            }
        } else {
            // init content
            props.onUpdateSurveyItem(updateFootnote(
                {
                    role: 'footnote',
                }
            ));
        }
    }

    const footnote = getItemComponentByRole(props.surveyItem.components?.items, 'footnote') as ItemGroupComponent;

    const useFootnote = footnote ? true : false;

    let content = '';
    if (footnote) {
        const currentLocaleContent = localisedObjectToMap(footnote.content).get(selectedLanguage);
        if (currentLocaleContent) {
            content = currentLocaleContent;
        }
    }
    return (
        <EditorWrapper>
            <Label
                htmlFor='use-footnote'
                className='flex items-center gap-2'
            >
                <Switch
                    id='use-footnote'
                    checked={useFootnote}
                    onCheckedChange={onToggleFootnote}
                />
                <span>
                    Use footnote
                </span>
            </Label>

            {useFootnote && (
                <div className='mt-2 space-y-2'>
                    <div className='flex justify-end'>
                        <SurveyLanguageToggle />
                    </div>

                    <div className='space-y-1.5'>
                        <Label
                            className=''
                            htmlFor='footnote-content'
                        >
                            Content
                        </Label>
                        <Textarea
                            id='footnote-content'
                            value={content}
                            placeholder='Add footnote content for the selected language...'
                            onChange={(e) => {
                                const value = e.target.value;
                                const updatedComponent = { ...footnote };
                                if (!updatedComponent.content) {
                                    updatedComponent.content = [];
                                }

                                const localeIndex = updatedComponent.content.findIndex((c) => c.code === selectedLanguage);
                                if (localeIndex < 0) {
                                    updatedComponent.content.push({ code: selectedLanguage, parts: [{ str: value }] });
                                } else {
                                    (updatedComponent.content[localeIndex] as LocalizedString).parts = [{ str: value }];
                                }

                                props.onUpdateSurveyItem(updateFootnote(updatedComponent));
                            }}
                        />
                    </div>
                </div>
            )}
        </EditorWrapper>
    );
};

export default FootnoteEditor;
