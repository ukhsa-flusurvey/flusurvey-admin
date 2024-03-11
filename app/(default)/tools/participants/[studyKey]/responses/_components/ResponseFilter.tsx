import React from 'react';
import ResponseFilterForm from './ResponseFilterForm';
import CogLoader from '@/components/CogLoader';
import { toast } from 'sonner';
import { getSurveyInfos } from '@/lib/data/studyAPI';

interface ResponseFilterProps {
    studyKey: string;
}

const ResponseFilter: React.FC<ResponseFilterProps> = async (props) => {
    let surveyKeys: string[] = [];
    try {
        const resp = await getSurveyInfos(props.studyKey)

        if (resp.surveys) {
            surveyKeys = resp.surveys.map(s => s.key);
        }
    } catch (e) {
        toast.error('Failed to fetch survey keys');
        console.error(e);
    }

    return (
        <div>
            <ResponseFilterForm
                surveyKeys={surveyKeys}
            />
        </div>
    );
};

export default ResponseFilter;

export const ResponseFilterSkeleton: React.FC = () => {
    return (
        <CogLoader
            label='Loading survey keys...'
        />
    );
};
