import React, { Suspense } from 'react';
import StudyRulesOverview, { StudyRulesOverviewSkeleton } from './_components/StudyRulesOverview';


interface PageProps {
    params: {
        studyKey: string
    }
}

export const dynamic = 'force-dynamic';

const Page: React.FC<PageProps> = async (props) => {
    return (
        <div className='flex'>
            <Suspense fallback={<StudyRulesOverviewSkeleton
                studyKey={props.params.studyKey}
            />}>
                <StudyRulesOverview
                    studyKey={props.params.studyKey}
                />
            </Suspense>
        </div>
    );
};

export default Page;
