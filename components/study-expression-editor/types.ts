import { Expression } from "../expression-editor/utils";

export interface KeyValuePairDefs {
    key: string;
    possibleValues: string[];
}

export type StudyContext = {
    surveyKeys?: string[];
    messageKeys?: string[];
    customEventKeys?: string[];
    participantFlags?: Array<KeyValuePairDefs>,
    reportKeys?: Array<KeyValuePairDefs>,
}


export type StudyExpressionEditorMode = 'action' | 'study-rules';

export type Session = {
    id: string;
    name?: string;
    mode: StudyExpressionEditorMode;
    rules?: Expression[];
    studyContext?: StudyContext;
    lastModified: number;
};
