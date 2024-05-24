import React from 'react';
import SurveyEditorClientHandler from './survey-editor-client-handler';
import { getSurveyVersion, getSurveyVersions } from '@/lib/data/studyAPI';
import BackButton from '@/components/BackButton';
import ErrorAlert from '@/components/ErrorAlert';

interface SurveyEditorLoaderProps {
    studyKey: string;
    surveyKey: string;
    versionId: string;
}

const SurveyEditorLoader: React.FC<SurveyEditorLoaderProps> = async (props) => {
    const backUrl = `/tools/study-configurator/${props.studyKey}/surveys/${props.surveyKey}`;
    // download survey
    const resp = await getSurveyVersion(props.studyKey, props.surveyKey, props.versionId);
    const surveyDef = resp.survey;
    if (resp.error || !surveyDef) {
        return <div className='flex flex-col items-center py-6 justify-start h-svh'>
            <div>
                <BackButton
                    label="Back to version overview"
                    href={backUrl}
                />
                <ErrorAlert
                    title='Could not load survey information'
                    error={resp.error || 'Survey definition not found'}
                />
            </div>
        </div>
    }


    const versionsResp = await getSurveyVersions(props.studyKey, props.surveyKey);
    const versions = versionsResp.versions;

    const warnIfNotLatest = versions && versions.length > 0 && versions[0].versionId !== props.versionId;

    return (
        <SurveyEditorClientHandler
            surveyDefinition={surveyDef}
            notLatestVersion={warnIfNotLatest}
        />
    );
};

export default SurveyEditorLoader;
