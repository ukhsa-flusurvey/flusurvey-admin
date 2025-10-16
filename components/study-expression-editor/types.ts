import { StudyVariableType } from "@/utils/server/types/study-variables";
import { Expression } from "../expression-editor/utils";

export interface KeyValuePairDefs {
    key: string;
    possibleValues: string[];
}

export interface StudyVariableDef {
    key: string;
    type: StudyVariableType;
}


// Type guards
export function isStudyVariableDef(value: unknown): value is StudyVariableDef {
    if (value === null || typeof value !== 'object') {
        return false;
    }
    const candidate = value as Record<string, unknown>;
    return typeof candidate.key === 'string' && 'type' in candidate;
}

export function isKeyValuePairDefs(value: unknown): value is KeyValuePairDefs {
    if (value === null || typeof value !== 'object') {
        return false;
    }
    const candidate = value as Record<string, unknown>;
    const possibleValues = candidate.possibleValues as unknown;
    return (
        typeof candidate.key === 'string' &&
        Array.isArray(possibleValues) &&
        possibleValues.every((v) => typeof v === 'string')
    );
}



export type StudyContext = {
    surveyKeys?: string[];
    messageKeys?: string[];
    customEventKeys?: string[];
    linkingCodeKeys?: string[];
    participantFlags?: Array<KeyValuePairDefs>,
    reportKeys?: Array<KeyValuePairDefs>,
    externalEventHandlers?: Array<KeyValuePairDefs>,
    studyVariables?: Array<StudyVariableDef>,
}


export type StudyExpressionEditorMode = 'action' | 'study-rules';

export type Session = {
    meta?: {
        editorVersion: string;
        fileTypeId: string;
    };
    id: string;
    name?: string;
    mode: StudyExpressionEditorMode;
    rules?: Expression[];
    studyContext?: StudyContext;
    lastModified: number;
};
