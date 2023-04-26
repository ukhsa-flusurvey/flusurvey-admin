import 'server-only';
import { Expression, Survey } from "survey-engine/data_types";
import caseAdminAPIInstance, { getCASEManagementAPIURL, getTokenHeader } from "./api";
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';


export const createStudy = (study: any, accessToken: string) => caseAdminAPIInstance.post(`/v1/studies`, { study }, { headers: { ...getTokenHeader(accessToken) } });

export const saveStudyRules = (studyKey: string, rules: Expression[], accessToken: string) => caseAdminAPIInstance.post(`/v1/study/${studyKey}/rules`, { studyKey, rules }, { headers: { ...getTokenHeader(accessToken) } });
export const getSurveysForStudy = (studyKey: string, accessToken: string) => caseAdminAPIInstance.get(`/v1/study/${studyKey}/surveys`, { headers: { ...getTokenHeader(accessToken) } });
export const saveSurveyForStudy = (studyKey: string, survey: Survey, accessToken: string) => caseAdminAPIInstance.post(`/v1/study/${studyKey}/surveys`, { survey }, { headers: { ...getTokenHeader(accessToken) } });


export const getStudies = async () => {
    const session = await getServerSession(authOptions);
    if (!session || session.error || session.accessToken === undefined) {
        throw new Error('Unauthorized');
    }

    const url = getCASEManagementAPIURL(`/v1/studies`);

    const response = await fetch(url,
        {
            headers: {
                ...getTokenHeader(session.accessToken)
            },
            next: {
                revalidate: 10
            }
        });
    if (response.status !== 200) {
        try {
            const err = await response.json();
            throw new Error(err.error);
        } catch (error) {
            throw new Error(`Error ${response.status} when fetching studies`);
        }
    }
    const data = await response.json();
    return data;
}
