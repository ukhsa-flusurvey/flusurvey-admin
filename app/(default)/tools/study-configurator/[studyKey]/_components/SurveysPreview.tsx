
import { Card } from '@/components/ui/card';
import React from 'react';
import LinkButton, { LinkButtonSkeleton } from './LinkButton';
import { Skeleton } from '@/components/ui/skeleton';
import ErrorAlert from '@/components/ErrorAlert';
import { BsCardChecklist } from 'react-icons/bs';
import { getSurveyInfos, getSurveyVersions } from '@/lib/data/studyAPI';
import { Survey } from 'survey-engine/data_types';
import SurveyLinkCard from './SurveyLinkCard';
import { GripVertical } from 'lucide-react';


interface SurveysPreviewProps {
    studyKey: string;
}

const NoSurveys: React.FC = () => {
    return (
        <div className='mx-auto text-center'>
            <BsCardChecklist className="text-3xl mx-auto text-neutral-300 mb-1" />
            <p className='font-bold text-sm'>No surveys yet</p>
            <p className='text-neutral-500  text-xs'>Create a new survey to start collecting data.</p>
        </div>
    );
}


const SurveysPreview: React.FC<SurveysPreviewProps> = async (props) => {
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
        content = <>
            <span>
                <GripVertical className='text-neutral-400' />
            </span>
            {
                surveyVersions.map((survey, index) => (
                    <SurveyLinkCard key={index} studyKey={props.studyKey} surveyKey={survey.surveyKey} versions={survey.versions || []}
                        className='snap-start'
                    />
                ))
            }
            <span>
                <GripVertical className='text-neutral-400' />
            </span>
        </>
    }


    return (
        <Card
            variant={'opaque'}
            className='p-6'
        >
            <h3 className='font-semibold mb-2'>
                Surveys <span className='text-cyan-800'>({surveyVersions.length})</span>
            </h3>


            <div className='w-full max-w-full flex flex-nowrap gap-3 items-center snap-mandatory snap-x py-4 overflow-x-scroll'>
                {content}
            </div>

            <LinkButton
                href={'/tools/study-configurator/' + props.studyKey + '/surveys'}
                text={'Open survey management'}
            />
        </Card>
    );
};

export default SurveysPreview;

export const SurveysPreviewSkeleton: React.FC = () => {
    return (
        <Card
            variant={'opaque'}
            className='p-6'
        >
            <h3 className='font-semibold mb-2'>
                Surveys <span className='text-cyan-800 inline-flex items-center'>(<Skeleton
                    className='h-6 w-4 inline-block'
                />)</span>
            </h3>


            <div className='w-full max-w-full flex flex-nowrap gap-3 snap-mandatory snap-x py-4 overflow-x-scroll'>
                {Array.from({ length: 3 }).map((_, index) => (
                    <Skeleton key={index} className="w-52 h-16"></Skeleton>
                ))}

            </div>

            <LinkButtonSkeleton
                text={'Open survey management'}
            />
        </Card>
    );
}
