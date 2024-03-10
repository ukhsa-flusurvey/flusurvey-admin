import { cn } from '@/lib/utils';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import { Survey } from 'survey-engine/data_types';

interface SurveyLinkCardProps {
    studyKey: string;
    surveyKey: string;
    versions: Array<Survey>;
    className?: string;
}

const SurveyLinkCard: React.FC<SurveyLinkCardProps> = (props) => {
    let largestPublished = 0;

    props.versions.forEach(sv => {
        if (!sv.published) {
            return;
        }
        if (typeof sv.published !== 'number') {
            sv.published = parseInt(sv.published as unknown as string);
        }
        if (sv.published > largestPublished) {
            largestPublished = sv.published;
        }
    })


    const lastUpdated = new Date(largestPublished * 1000).toLocaleDateString();

    return (
        <Link
            href={`/tools/study-configurator/${props.studyKey}/surveys/${props.surveyKey}`}
            prefetch={false}
            className={cn(
                'bg-white rounded-md shadow-md p-2 flex items-center gap-2 border border-slate-200',
                'hover:bg-slate-100',
                'w-60 shrink-0',
                props.className
            )}
        >
            <div className='grow'>
                <div className='font-semibold'>{props.surveyKey}</div>
                <div className='text-xs text-neutral-400'>Last updated: {lastUpdated}</div>
                <div className='text-xs text-neutral-400'>Number of versions: {props.versions.length}</div>
            </div>
            <div>
                <ChevronRight className='size-6 text-neutral-600' />
            </div>

        </Link>
    );
};

export default SurveyLinkCard;
