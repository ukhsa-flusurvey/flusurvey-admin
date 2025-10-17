'use client';

import StudyExpressionEditor from '@/components/study-expression-editor/study-expression-editor';
import { useRouter } from 'next/navigation';
import React from 'react';

const Page: React.FC = () => {
    const [mounted, setMounted] = React.useState(false);
    const router = useRouter();

    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <div>loading...</div>
    }


    return (
        <StudyExpressionEditor onExit={() => {
            router.push('/tools/editors')
        }} />
    );
};

export default Page;
