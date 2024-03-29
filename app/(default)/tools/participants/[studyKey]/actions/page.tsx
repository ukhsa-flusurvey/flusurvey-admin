import Breadcrumbs from '@/components/Breadcrumbs';
import React from 'react';
import StudyActionsCard from './StudyActionsCard';

interface PageProps {
    params: {
        studyKey: string
    }
}

export const dynamic = 'force-dynamic';

const Page: React.FC<PageProps> = async (props) => {
    return (
        <div className="px-6 bg-white/60 h-full">
            <div className="py-2">
                <Breadcrumbs
                    homeLink="/tools/study-configurator"
                    links={
                        [
                            {
                                title: props.params.studyKey,
                                href: `/tools/study-configurator/${props.params.studyKey}`,
                            },
                            {
                                title: `Actions`,
                            }
                        ]
                    }
                />
                <main className="py-6">
                    <div className="grid grid-cols-2 gap-4">
                        <StudyActionsCard studyKey={props.params.studyKey} />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Page;
