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
        <div className="px-unit-lg bg-white/60 h-full">
            <div className="py-unit-sm">
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
                <main className="py-unit-lg">
                    <div className="grid grid-cols-2 gap-unit-md">
                        <StudyActionsCard studyKey={props.params.studyKey} />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Page;
