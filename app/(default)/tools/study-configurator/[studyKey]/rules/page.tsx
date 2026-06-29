import React, { Suspense } from 'react';
import StudyRulesOverview, { StudyRulesOverviewSkeleton } from './_components/StudyRulesOverview';


interface PageProps {
    params: Promise<{
        studyKey: string
    }>
}

export const dynamic = 'force-dynamic';

const Page = async (props: PageProps) => {
    const { studyKey } = await props.params;

    return (
        <div className='flex'>
            <Suspense fallback={<StudyRulesOverviewSkeleton
                studyKey={studyKey}
            />}>
                <StudyRulesOverview
                    studyKey={studyKey}
                />
            </Suspense>
        </div>
    );
};

export default Page;
