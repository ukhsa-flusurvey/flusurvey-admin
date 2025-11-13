export enum StudyVariableType {
    STRING = 'string',
    INTEGER = 'int',
    FLOAT = 'float',
    BOOLEAN = 'boolean',
    DATE = 'date',
}

export interface StudyVariableIntConfig {
    min?: number;
    max?: number;
}

export interface StudyVariableFloatConfig {
    min?: number;
    max?: number;
}

export interface StudyVariableDateConfig {
    min?: string;
    max?: string;
}

export interface StudyVariableStringConfig {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    possibleValues?: string[];
}

export interface StudyVariable {
    id?: string;
    createdAt: string;
    configUpdatedAt: string;
    valueUpdatedAt: string;

    studyKey: string;

    key: string;
    value: string | number | boolean | Date;
    type: StudyVariableType;

    // Metadata
    label?: string;
    description?: string;
    uiType?: string;
    uiPriority?: number;

    configs?: StudyVariableIntConfig | StudyVariableFloatConfig | StudyVariableDateConfig | StudyVariableStringConfig;
}

// Slim payloads used for create/update of variable definitions (no timestamps/value)
export interface StudyVariableDefinitionBase {
    type: StudyVariableType;
    uiType?: string;
    uiPriority?: number;
    label?: string;
    description?: string;
    configs?: StudyVariableIntConfig | StudyVariableFloatConfig | StudyVariableDateConfig | StudyVariableStringConfig;
}

export interface CreateStudyVariablePayload extends StudyVariableDefinitionBase {
    key: string;
}

export type UpdateStudyVariableConfigsPayload = StudyVariableDefinitionBase;
