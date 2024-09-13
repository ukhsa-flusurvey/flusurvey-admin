import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface PageProps {
    params: {
        studyKey: string
    }
}

export const dynamic = 'force-dynamic';

const Page: React.FC<PageProps> = async (props) => {
    return (
        <div className="flex items-center justify-center h-full grow py-6 text-muted-foreground">
            <span>
                <ArrowLeft className="size-5 me-1" />

            </span>
            Select an action type on the left to get started.
        </div>
    );
};

export default Page;
