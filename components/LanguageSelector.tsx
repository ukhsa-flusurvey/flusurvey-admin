'use client';

import React, { useEffect, useState } from 'react';
import { BsGlobe2 } from 'react-icons/bs';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import NotificationBadge from './NotificationBadge';

interface LanguageSelectorProps {
    onLanguageChange?: (lang: string) => void;
    showBadgeForLanguages?: string[];
    initialLanguage?: string;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
    onLanguageChange,
    showBadgeForLanguages,
    initialLanguage = (process.env.NEXT_PUBLIC_DEFAULT_LANGUAGE || 'en')
}) => {
    const languages = process.env.NEXT_PUBLIC_SUPPORTED_LOCALES ? process.env.NEXT_PUBLIC_SUPPORTED_LOCALES.split(',') : [process.env.NEXT_PUBLIC_DEFAULT_LANGUAGE || 'en'];

    const [selectedLanguage, setSelectedLanguage] = useState(initialLanguage)

    useEffect(() => {
        if (onLanguageChange) {
            onLanguageChange(selectedLanguage);
        }
    }, [selectedLanguage, onLanguageChange])

    return (
        <div className='flex items-center'>
            <ToggleGroup
                type='single'
                value={selectedLanguage}
                onValueChange={(lang) => {
                    if (lang) {
                        setSelectedLanguage(lang);
                    }
                }}
                aria-label='Language'
                className='flex items-center bg-neutral-50 p-1 rounded-md gap-1.5 border border-slate-200'
            >
                <span className='sr-only'>Language</span>
                <BsGlobe2 className='text-neutral-400 mx-1' aria-hidden='true' />
                {languages.map((lang) => (
                    <NotificationBadge key={lang}
                        variant={'warning'}
                        animation={'ping'}
                        isInvisible={!showBadgeForLanguages || !showBadgeForLanguages.includes(lang)}
                    >
                        <ToggleGroupItem
                            value={lang}
                            aria-label={lang}
                            size='sm'
                            className='h-auto px-1.5 py-0.5 rounded-sm text-sm hover:underline data-[state=on]:font-bold data-[state=on]:bg-white data-[state=on]:underline data-[state=on]:shadow-sm data-[state=on]:border-slate-200 border border-transparent'
                        >
                            {lang}
                        </ToggleGroupItem>
                    </NotificationBadge>
                ))}
            </ToggleGroup>

        </div>
    );
};

export default LanguageSelector;
