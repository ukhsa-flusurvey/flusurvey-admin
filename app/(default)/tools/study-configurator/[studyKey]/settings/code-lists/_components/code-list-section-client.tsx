'use client'

import React, { useEffect } from 'react';
import { Separator } from '@/components/ui/separator';
import LoadingButton from '@/components/loading-button';
import { getStudyCodeListEntries } from '@/lib/data/studyAPI';
import DeleteCodeListItem from './delete-code-list-item';
import DeleteWholeCodeList from './delete-whole-code-list';
import ErrorAlert from '@/components/ErrorAlert';

interface CodeListSectionClientProps {
    studyKey: string;
    listKey: string;
    initialCodeList: Array<{
        code: string;
        addedAt: string;
    }>;
    totalCount: number;
    pageSize?: number;
}

const DEFAULT_PAGE_SIZE = 100;

const CodeListSectionClient: React.FC<CodeListSectionClientProps> = (props) => {
    const pageSize = props.pageSize || DEFAULT_PAGE_SIZE;
    const [mounted, setMounted] = React.useState(false);

    const [entries, setEntries] = React.useState(props.initialCodeList || []);
    const [totalCount, setTotalCount] = React.useState<number>(props.totalCount || 0);
    const [error, setError] = React.useState<string | undefined>(undefined);
    const [isPending, startTransition] = React.useTransition();

    const hasMore = totalCount > entries.length;

    useEffect(() => {
        setMounted(true);
        return () => {
            setMounted(false);
        }
    }, []);

    if (!mounted) {
        return null;
    }

    const onLoadMore = (reload: boolean = false) => {
        const nextPage = reload ? 1 : Math.floor(entries.length / pageSize) + 1;
        startTransition(async () => {
            try {
                const resp = await getStudyCodeListEntries(props.studyKey, props.listKey, nextPage, pageSize);
                if (resp.error) {
                    setError(resp.error);
                    return;
                }
                if (resp.codeList && resp.codeList.length > 0) {
                    setEntries(prev => reload ? resp.codeList! : [...prev, ...resp.codeList!]);
                }
                if (resp.pagination) {
                    setTotalCount(resp.pagination.totalCount);
                }
            } catch {
                setError('Failed to load more codes');
            }
        });
    };

    return (
        <section className='border border-border rounded-md overflow-hidden bg-white'>
            <h3 className='px-4 py-2 font-semibold bg-slate-50 flex items-center justify-between'>
                <span className='flex items-center gap-2'>
                    <span>{props.listKey}</span>
                    <span className='text-muted-foreground text-sm'>
                        Showing {entries.length} of {totalCount}
                    </span>
                </span>
                <DeleteWholeCodeList
                    studyKey={props.studyKey}
                    listKey={props.listKey}
                />
            </h3>
            <Separator />

            {error && (
                <div className='p-4'>
                    <ErrorAlert title="Failed to fetch code list entries" error={error} />
                </div>
            )}

            {entries.length === 0 && !error && (
                <div className='py-6 flex justify-center'>
                    <p className='text-neutral-600'>
                        No code list entries found
                    </p>
                </div>
            )}

            {entries.length > 0 && (
                <>
                    <ul className='max-h-96 overflow-y-auto flex gap-4 flex-wrap p-4'>
                        {entries.map(entry => (
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
                                    onDeleteSuccess={() => {
                                        onLoadMore(true);
                                    }}
                                />
                            </li>
                        ))}
                        <li className='flex items-center gap-2 rounded-md'>
                            {hasMore ? (
                                <LoadingButton
                                    isLoading={isPending}
                                    variant={'ghost'}
                                    onClick={() => onLoadMore(false)}
                                >
                                    Load more
                                </LoadingButton>
                            ) : (
                                <p className='text-xs text-neutral-500'>End of list</p>
                            )}
                        </li>
                    </ul>

                </>
            )}
        </section>
    );
};

export default CodeListSectionClient;


