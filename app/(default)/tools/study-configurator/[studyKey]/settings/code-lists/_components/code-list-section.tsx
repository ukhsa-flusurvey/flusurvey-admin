import React from 'react';
import DeleteCodeListItem from './delete-code-list-item';
import { Loader2Icon } from 'lucide-react';
import { getStudyCodeListEntries } from '@/lib/data/studyAPI';
import ErrorAlert from '@/components/ErrorAlert';
import { Separator } from '@/components/ui/separator';
import DeleteWholeCodeList from './delete-whole-code-list';

interface CodeListSectionProps {
    studyKey: string;
    listKey: string;
}

const CodeListSection: React.FC<CodeListSectionProps> = async (props) => {
    const { error, codeList } = await getStudyCodeListEntries(props.studyKey, props.listKey);

    let content: React.ReactNode | null = null;
    if (error) {
        content = <ErrorAlert
            title="Failed to fetch code list entries"
            error={error}
        />;
    } else if (!codeList || codeList.length === 0) {
        content = (
            <div className='py-6 flex justify-center'>
                <p className='text-neutral-600'>
                    No code list entries found
                </p>
            </div>
        );
    } else {
        content = (
            <ul className='max-h-96 overflow-y-auto flex gap-4 flex-wrap p-4'>
                {codeList.map(entry => (
                    <li key={entry.code}
                        className='flex items-center gap-2 border border-border py-1 pl-4 rounded-md'
                    >
                        <div className='flex flex-col'>
                            <span className='font-mono text-sm'>{entry.code}</span>
                            <span className='text-xs text-muted-foreground'>
                                {new Date(entry.addedAt).toLocaleDateString()}
                            </span>
                        </div>


                        <DeleteCodeListItem
                            studyKey={props.studyKey}
                            listKey={props.listKey}
                            code={entry.code}
                        />
                    </li>
                ))}
            </ul>
        );
    }


    // load code list items for list key
    return (
        <section className='border border-border rounded-md overflow-hidden'>
            <h3 className='px-4 py-2 font-semibold bg-slate-50 flex items-center justify-between'>
                <span>
                    {props.listKey} <span className='text-muted-foreground'>({codeList?.length || 0})</span>
                </span>
                <DeleteWholeCodeList
                    studyKey={props.studyKey}
                    listKey={props.listKey}
                />
            </h3>
            <Separator />
            {content}
        </section>
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
