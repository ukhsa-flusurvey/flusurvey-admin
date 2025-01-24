import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import React, { Suspense } from 'react';
import CodeListSection from './code-list-section';
import AddCodeListEntries from './add-code-list-entries';
import { Loader2Icon } from 'lucide-react';
import { getStudyCodeListKeys } from '@/lib/data/studyAPI';
import ErrorAlert from '@/components/ErrorAlert';

interface CodeListsOverviewProps {
    studyKey: string;
}

const CodeListsOverview: React.FC<CodeListsOverviewProps> = async (props) => {

    const { error, listKeys } = await getStudyCodeListKeys(props.studyKey);


    let content: React.ReactNode | null = null;
    if (error) {
        content = <ErrorAlert
            title="Failed to fetch list keys"
            error={error}
        />;
    } else if (!listKeys || listKeys.length === 0) {
        content = (
            <div className='py-6 flex justify-center'>
                <p className='text-neutral-600'>
                    No study code lists found
                </p>
            </div>
        );
    } else {
        content = (
            <>
                {listKeys.map(listKey => <Suspense
                    key={listKey}
                    fallback={<div>Loading...</div>}>
                    <CodeListSection
                        studyKey={props.studyKey}
                        listKey={listKey}
                    />
                </Suspense>)}
            </>
        );
    }


    return (
        <Card
            variant='opaque'
            className='w-full'
        >
            <CardHeader>
                <div className='flex gap-6'>
                    <div className='space-y-1.5 grow'>
                        <CardTitle
                            className='text-xl'
                        >
                            Code lists
                        </CardTitle>
                        <CardDescription>
                            Manage the available codes for the study. This can be used to validate participant data for example.
                        </CardDescription>
                    </div>
                    <AddCodeListEntries
                        studyKey={props.studyKey}
                        listKeys={listKeys || []}
                    />
                </div>
            </CardHeader>
            <CardContent className='space-y-3'>
                <Separator />
                {content}
            </CardContent>
        </Card>
    );
};

export default CodeListsOverview;

export const CodeListOverviewLoader = () => {
    return <Card
        variant={'opaque'}
        className='w-full flex items-center justify-center'
    >
        <Loader2Icon
            className='animate-spin size-8 text-primary'></Loader2Icon>
    </Card>
}
