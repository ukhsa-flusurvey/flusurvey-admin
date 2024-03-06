import React, { Suspense } from 'react';
import StatusCard, { StatusCardSkeleton } from './StatusCard';
import Stats, { StatsSkeleton } from './Stats';
import StudyCard, { StudyCardSkeleton } from './StudyCard';
import SurveysPreview, { SurveysPreviewSkeleton } from './SurveysPreview';


interface StudyDashboardProps {
    studyKey: string;
}

const StudyDashboard: React.FC<StudyDashboardProps> = async (props) => {
    return (
        <div className='space-y-4'>
            <div className='flex'>
                <Suspense fallback={<StatusCardSkeleton />}>
                    <StatusCard
                        studyKey={props.studyKey}
                    />
                </Suspense>
            </div>

            <div className='flex'>
                <Suspense fallback={<StatsSkeleton />}>
                    <Stats
                        studyKey={props.studyKey}
                    />
                </Suspense>
            </div>

            <div className=''>
                <Suspense fallback={<SurveysPreviewSkeleton />}>
                    <SurveysPreview
                        studyKey={props.studyKey}
                    />
                </Suspense>
            </div>

            <div>
                <Suspense fallback={<StudyCardSkeleton />}>
                    <StudyCard studyKey={props.studyKey} />
                </Suspense>
            </div>

        </div>
    );
};

export default StudyDashboard;
