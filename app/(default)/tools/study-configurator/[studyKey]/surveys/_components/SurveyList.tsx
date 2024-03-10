import CogLoader from '@/components/CogLoader';
import ErrorAlert from '@/components/ErrorAlert';
import { ItemListCardWrapperWithAddButton } from '@/components/ItemListCardWrapperWithAddButton';
import { getSurveyInfos, getSurveyVersions } from '@/lib/data/studyAPI';
import React from 'react';
import { Survey } from 'survey-engine/data_types';
import { NoSurveys } from '../../_components/SurveysPreview';
import { LinkMenu } from '@/components/LinkMenu';
import SurveyLinkCard from '../../_components/SurveyLinkCard';

interface SurveyListProps {
    studyKey: string;
}

const SurveyListWrapper = (props: {
    studyKey: string;
    children: React.ReactNode
}) => {
    return (
        <ItemListCardWrapperWithAddButton
            title="Surveys"
            description="Select a survey to edit or create a new one."
            addHref={`/tools/study-configurator/${props.studyKey}/surveys/new`}
            addLabel="Create a new survey"
            isLoading={false}
            className='w-full sm:w-1/2 sm:min-w-[400px]'
        >
            {props.children}
        </ItemListCardWrapperWithAddButton>
    );
}

const SurveyList: React.FC<SurveyListProps> = async (props) => {
    let error: string | undefined = undefined;
    const resp = await getSurveyInfos(props.studyKey);
    error = resp.error;
    const surveyInfos = resp.surveys;
    let surveyVersions: Array<{
        surveyKey: string;
        versions?: Array<Survey>
    }> = [];

    if (!error && surveyInfos !== undefined) {
        const surveyKeys = surveyInfos.map(s => s.key);

        surveyVersions = await Promise.all(surveyKeys.map(async (surveyKey) => {
            const resp = await getSurveyVersions(props.studyKey, surveyKey);
            return {
                surveyKey: surveyKey,
                versions: resp.versions
            }
        }));
    }


    let content: React.ReactNode;
    if (error) {
        content = <ErrorAlert
            title="Error loading surveys"
            error={error}
        />
    } else if (!surveyInfos || surveyInfos.length === 0) {
        content = <NoSurveys />
    } else {
        content = <LinkMenu
            className='max-h-[520px] overflow-y-auto'
        >
            {
                surveyVersions.map((survey, index) => (
                    <li key={index}>
                        <SurveyLinkCard key={index} studyKey={props.studyKey} surveyKey={survey.surveyKey} versions={survey.versions || []}
                            className='snap-start w-auto border-none bg-transparent shadow-none'
                        />
                    </li>
                ))
            }
        </LinkMenu>
    }


    return (
        <SurveyListWrapper
            studyKey={props.studyKey}
        >
            {content}
        </SurveyListWrapper>
    );
};

export default SurveyList;

export const SurveyListSkeleton: React.FC<SurveyListProps> = (props) => {
    return (
        <SurveyListWrapper
            studyKey={props.studyKey}
        >
            <CogLoader
                label='Loading surveys...'
            />
        </SurveyListWrapper>
    );
}
