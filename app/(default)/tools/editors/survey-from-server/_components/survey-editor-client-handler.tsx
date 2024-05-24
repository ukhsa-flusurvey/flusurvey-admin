'use client';

import SurveyEditor from "@/components/survey-editor/SurveyEditor";
import { useRouter } from "next/navigation";

import React from 'react';
import { Survey } from "survey-engine/data_types";

interface SurveyEditorClientHandlerProps {
    surveyDefinition: Survey;
    notLatestVersion?: boolean;
}

const SurveyEditorClientHandler: React.FC<SurveyEditorClientHandlerProps> = (props) => {
    const router = useRouter();
    return (
        <SurveyEditor
            initialSurvey={props.surveyDefinition}
            notLatestVersion={props.notLatestVersion}
            embedded={true}
            onUploadNewVersion={(survey) => {
                console.log('upload new version', survey)
            }}
            onExit={() => {
                router.back();
            }}
        />
    );
};

export default SurveyEditorClientHandler;

