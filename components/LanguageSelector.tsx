'use client';

import { Tooltip } from '@nextui-org/tooltip';
import { clsx } from 'clsx';
import React, { useEffect, useState } from 'react';
import { BsGlobe2 } from 'react-icons/bs';
import { RadioGroup } from '@headlessui/react'
import { Badge } from '@nextui-org/badge';

interface LanguageSelectorProps {
    onLanguageChange?: (lang: string) => void;
    showBadgeForLanguages?: string[];
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
    onLanguageChange,
    showBadgeForLanguages
}) => {
    const languages = process.env.NEXT_PUBLIC_SUPPORTED_LOCALES ? process.env.NEXT_PUBLIC_SUPPORTED_LOCALES.split(',') : [process.env.NEXT_PUBLIC_DEFAULT_LANGUAGE || 'en'];

    const [selectedLanguage, setSelectedLanguage] = useState(process.env.NEXT_PUBLIC_DEFAULT_LANGUAGE || 'en')

    useEffect(() => {
        if (onLanguageChange) {
            onLanguageChange(selectedLanguage);
        }
    }, [selectedLanguage, onLanguageChange])

    return (
        <div className='flex items-center gap-unit-sm'>
            <RadioGroup value={selectedLanguage} onChange={setSelectedLanguage}>
                <div className='flex items-center bg-content1 p-unit-2 rounded-small gap-unit-2 border border-default-200'>
                    <RadioGroup.Label>
                        <Tooltip content='Language' placement='left'>
                            <span>
                                <BsGlobe2 className='text-default-400 mx-unit-1' />
                            </span>
                        </Tooltip>
                    </RadioGroup.Label>
                    {languages.map((lang) => (
                        <Badge key={lang}
                            size="sm"
                            color="warning"
                            content=''
                            isDot
                            isInvisible={!showBadgeForLanguages || !showBadgeForLanguages.includes(lang)}
                        >
                            <RadioGroup.Option
                                value={lang}
                                className='px-unit-2 cursor-pointer rounded-md  hover:underline ui-checked:bg-content4 ui-checked:shadow-sm'>
                                {lang}
                            </RadioGroup.Option>
                        </Badge>
                    ))}
                </div>
            </RadioGroup>

        </div>
    );
};

export default LanguageSelector;
