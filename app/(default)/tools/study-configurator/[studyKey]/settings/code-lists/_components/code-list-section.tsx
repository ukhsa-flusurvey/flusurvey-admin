import React from 'react';
import { Loader2Icon } from 'lucide-react';
import { getStudyCodeListEntries } from '@/lib/data/studyAPI';
import ErrorAlert from '@/components/ErrorAlert';
import CodeListSectionClient from './code-list-section-client';

interface CodeListSectionProps {
    studyKey: string;
    listKey: string;
}

const DEFAULT_PAGE_SIZE = 1000;

const CodeListSection: React.FC<CodeListSectionProps> = async (props) => {
    const { error, codeList, pagination } = await getStudyCodeListEntries(props.studyKey, props.listKey);

    if (error) {
        return (
            <section className='border border-border rounded-md overflow-hidden bg-white'>
                <ErrorAlert
                    title="Failed to fetch code list entries"
                    error={error}
                />
            </section>
        );
    }

    return (
        <CodeListSectionClient
            studyKey={props.studyKey}
            listKey={props.listKey}
            initialCodeList={codeList || []}
            totalCount={pagination?.totalCount || 0}
            pageSize={pagination?.pageSize || DEFAULT_PAGE_SIZE}
        />
    );
};

export default CodeListSection;

export const CodeListSectionLoader = (props: CodeListSectionProps) => {
    return <section className='border border-border rounded-md overflow-hidden'>
        <h3 className='px-4 py-2 font-semibold bg-slate-50'>{props.listKey}</h3>
        <div className='w-full flex items-center justify-center'>
            <Loader2Icon
                className='animate-spin size-8 text-primary'></Loader2Icon>
        </div>
    </section>
}
