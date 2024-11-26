import SurveyLanguageToggle from '@/components/survey-editor/components/general/SurveyLanguageToggle';
import { SurveyContext } from '@/components/survey-editor/surveyContext';
import { checkMissingTranslations } from '@/components/survey-editor/utils/localeUtils';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { getLocalizedString } from '@/utils/localizedStrings';
import { generateTitleComponent } from 'case-editor-tools/surveys/utils/simple-generators';
import React, { useContext } from 'react';
import { LocalizedString, SurveyItem, SurveySingleItem } from 'survey-engine/data_types';
import EditorWrapper from './editor-wrapper';


interface SurveyEndEditorProps {
    surveyItem: SurveySingleItem;
    onUpdateSurveyItem: (item: SurveyItem) => void;
}

const SurveyEndEditor: React.FC<SurveyEndEditorProps> = (props) => {
    const { selectedLanguage } = useContext(SurveyContext);


    let itemComponents = (props.surveyItem as SurveySingleItem).components?.items;

    if (!itemComponents || itemComponents.length === 0) {
        itemComponents = [
            generateTitleComponent(new Map([[selectedLanguage, '']])),
        ];
    }

    if (itemComponents.length > 1) {
        console.warn('Too many components in survey end item. Only the first one will be displayed.');
    }

    const surveyEndContent = itemComponents[0];

    const currentLocaleContent = getLocalizedString(surveyEndContent.content, selectedLanguage);

    return (
        <EditorWrapper>
            <div className='flex justify-end'>
                <SurveyLanguageToggle
                    showBadgeForLanguages={checkMissingTranslations(surveyEndContent.content)}
                />
            </div>

            <div className='space-y-1'>
                <Label
                    htmlFor='survey-end-content'
                >
                    Content
                </Label>
                <Textarea
                    key={props.surveyItem.key + selectedLanguage}
                    id='survey-end-content'
                    value={currentLocaleContent || ''}
                    placeholder='-- no translation available - please add one --'
                    onChange={(e) => {
                        const value = e.target.value;
                        const updatedComponent = { ...surveyEndContent };
                        if (!updatedComponent.content) {
                            updatedComponent.content = [];
                        }

                        const localeIndex = updatedComponent.content.findIndex((c) => c.code === selectedLanguage);
                        if (localeIndex < 0) {
                            updatedComponent.content.push({ code: selectedLanguage, parts: [{ str: value }] });
                        } else {
                            (updatedComponent.content[localeIndex] as LocalizedString).parts = [{ str: value }];
                        }

                        const updatedItem = {
                            ...props.surveyItem,
                            components: {
                                ...props.surveyItem.components,
                                items: [updatedComponent],
                            }
                        } as SurveySingleItem;
                        props.onUpdateSurveyItem(updatedItem);
                    }}
                />
            </div>
        </EditorWrapper>
    );
};

export default SurveyEndEditor;
