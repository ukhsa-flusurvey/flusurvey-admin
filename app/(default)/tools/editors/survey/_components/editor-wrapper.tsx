'use client';
import SurveyEditor from "@/components/survey-editor/SurveyEditor";
import { useRouter } from "next/navigation";
import React from 'react';

interface EditorWrapperProps {
}

const EditorWrapper: React.FC<EditorWrapperProps> = (props) => {
    const router = useRouter();
    return (
        <SurveyEditor

            onExit={() => {
                router.push('/tools/editors')
            }}
        />
    );
};

export default EditorWrapper;
