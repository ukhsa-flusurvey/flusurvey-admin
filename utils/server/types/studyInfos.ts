import { Expression, LocalizedString } from 'survey-engine/data_types';

export interface SurveyInfos {
    infos: Array<{
        surveyKey: string;
        studyKey: string;
        name: LocalizedString;
        description: LocalizedString;
        typicalDuration: LocalizedString;
    }>
}

export interface Study {
    key: string;
    status: string;
    secretKey: string;
    props: {
        name: LocalizedString[];
        description: LocalizedString[];
        tags: LocalizedString[][];
        systemDefaultStudy: boolean;
    }
    configs: {
        idMappingMethod: string;
        participantFileUploadRule: Expression;
    }
    stats: {
        participantCount: number;
        tempParticipantCount: number;
        responseCount: number;
    };
    rules: Expression[];
}
