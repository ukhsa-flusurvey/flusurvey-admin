'use client';
import SurveyEditor from "@/components/survey-editor/SurveyEditor";
import { useRouter } from "next/navigation";
import React from 'react';


const EditorWrapper: React.FC = () => {
    const router = useRouter();
    return (
        <SurveyEditor
            simulatorUrl="/tools/survey-simulator"
            onExit={() => {
                router.push('/tools/editors')
            }}
        />
    );
};

export default EditorWrapper;
