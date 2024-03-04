'use client';

import React from 'react';
import { StudyCardWithTags } from '../settings/_components/DisplayTexts';
import LanguageSelector from '@/components/LanguageSelector';
import { Study } from '@/utils/server/types/studyInfos';
import { getLocalizedString } from '@/utils/getLocalisedString';

interface StudyCardClientCompProps {
    study: Study;
}

const StudyCardClientComp: React.FC<StudyCardClientCompProps> = (props) => {
    const [selectedLanguage, setSelectedLanguage] = React.useState(process.env.NEXT_PUBLIC_DEFAULT_LANGUAGE || 'en');
    const currentStudyProps = props.study.props;

    const name = getLocalizedString(currentStudyProps.name, selectedLanguage);
    const description = getLocalizedString(currentStudyProps.description, selectedLanguage);
    const tags = currentStudyProps.tags ? currentStudyProps.tags.map(tag => getLocalizedString(tag.label, selectedLanguage)) : [];

    return (
        <div className="space-y-2">
            <div className="flex justify-end">
                <LanguageSelector
                    onLanguageChange={setSelectedLanguage}
                />
            </div>
            <StudyCardWithTags
                name={name}
                description={description}
                tags={tags}
            />
        </div>
    );
};

export default StudyCardClientComp;
