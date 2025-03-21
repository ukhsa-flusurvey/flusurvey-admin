import { Expression } from "../expression-editor/utils";

export type StudyContext = {
    surveyKeys?: string[];
    messageKeys?: string[];
    customEventKeys?: string[];
    participantFlags?: {
        [key: string]: {
            possibleValues: string[];
        }
    },
    reportKeys?: {
        [key: string]: {
            attributeKeys: string[];
        }
    }
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
