import Breadcrumbs from '@/components/Breadcrumbs';
import NotImplemented from '@/components/NotImplemented';
import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import React from 'react';
import StudyRuleEditActions from './StudyRuleEditActions';
import StudyActionsCard from './StudyActionsCard';

interface PageProps {
    params: {
        studyKey: string
    }
}

export const dynamic = 'force-dynamic';

const Page: React.FC<PageProps> = async (props) => {
    const session = await getServerSession();
    if (!session || !session.user?.email) {
        redirect(`/auth/login?callbackUrl=/tools/study-configurator/${props.params.studyKey}/rules`);
    }

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
                                title: `Study Rules`,
                            }
                        ]
                    }
                />
                <main className="py-unit-lg">
                    <div className="grid grid-cols-2 gap-unit-md">
                        <NotImplemented >
                            show rule history (list of rules published)
                        </NotImplemented>

                        <StudyRuleEditActions
                            studyKey={props.params.studyKey}
                        />

                        <StudyActionsCard studyKey={props.params.studyKey} />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Page;
