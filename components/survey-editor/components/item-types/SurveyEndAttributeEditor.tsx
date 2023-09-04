import LanguageSelector from '@/components/LanguageSelector';
import NotImplemented from '@/components/NotImplemented';
import { Divider, Textarea } from '@nextui-org/react';
import React from 'react';
import { BsBraces, BsBracesAsterisk, BsCardText, BsTextarea } from 'react-icons/bs';
import { Expression } from 'survey-engine/data_types';

interface SurveyEndAttributes {
    key: string;
    content: Map<string, string>;
    condition?: Expression;
}

interface SurveyEndAttributeEditorProps {
    attributes: SurveyEndAttributes;
    onChange: (attributes: SurveyEndAttributes) => void;
}

const SurveyEndAttributeEditor: React.FC<SurveyEndAttributeEditorProps> = (props) => {
    const [selectedLanguage, setSelectedLanguage] = React.useState<string>(process.env.NEXT_PUBLIC_DEFAULT_LANGUAGE || 'en');

    const currentContent = props.attributes.content.get(selectedLanguage) || '';

    return (
        <div className='space-y-unit-lg'>
            <div>
                <div className='flex items-center text-small font-bold mb-2'>
                    <span>
                        <BsBracesAsterisk className='text-default-500 me-2' />
                    </span>
                    Required attributes:
                </div>
                <div className='flex flex-col gap-unit-sm px-unit-sm border-s border-default-200'>
                    <div className='flex justify-start'>
                        <LanguageSelector
                            onLanguageChange={(lang) => setSelectedLanguage(lang)}
                        />
                    </div>

                    <Textarea
                        label='Content'
                        labelPlacement='outside'
                        variant='bordered'
                        value={currentContent}
                        placeholder='Enter content here'
                        description='This text will be displayed next to the submit button'
                        onValueChange={(value) => {
                            const newContent = new Map(props.attributes.content);
                            newContent.set(selectedLanguage, value);
                            props.onChange({
                                ...props.attributes,
                                content: newContent,
                            });
                        }}
                    />


                </div>
            </div>
            <Divider />
            <div>
                <div className='flex items-center text-small font-bold mb-2'>
                    <span>
                        <BsBraces className='text-default-500 me-2' />
                    </span>
                    Advanced settings:
                </div>
                <div className='flex flex-col px-unit-sm border-s border-default-200'>
                    <NotImplemented>
                        Preview and edit condition when this item should be rendered
                    </NotImplemented>
                </div>
            </div>
        </div>
    );
};

export default SurveyEndAttributeEditor;
