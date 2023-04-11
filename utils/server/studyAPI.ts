import { Survey } from "survey-engine/data_types";
import caseAdminAPIInstance, { getTokenHeader } from "./api";

export const getStudies = (accessToken: string) => caseAdminAPIInstance.get(`/v1/studies`, { headers: { ...getTokenHeader(accessToken) } });
export const createStudy = (study: any, accessToken: string) => caseAdminAPIInstance.post(`/v1/studies`, { study }, { headers: { ...getTokenHeader(accessToken) } });

export const getSurveysForStudy = (studyKey: string, accessToken: string) => caseAdminAPIInstance.get(`/v1/study/${studyKey}/surveys`, { headers: { ...getTokenHeader(accessToken) } });
export const saveSurveyForStudy = (studyKey: string, survey: Survey, accessToken: string) => caseAdminAPIInstance.post(`/v1/study/${studyKey}/surveys`, { survey }, { headers: { ...getTokenHeader(accessToken) } });
