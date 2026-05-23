export interface AssignedSurvey {
    surveyKey: string;
    validFrom?: number;
    validUntil?: number;
    studyKey?: string;
    category?: string;
    profileId?: string;
}

export interface ParticipantMessage {
    id: string;
    type: string;
    scheduledFor: number;
}

export interface ParticipantState {
    id: string;
    participantId: string;
    studyStatus: string;
    enteredAt: number;
    modifiedAt?: number;
    currentStudySession?: string;
    flags: { [key: string]: string };
    linkingCodes?: { [key: string]: string };
    lastSubmissions: { [key: string]: number };
    assignedSurveys: AssignedSurvey[];
    messages: ParticipantMessage[];
}

const parseTimestamp = (value: number | string | undefined): number | undefined => {
    if (typeof value === "string") {
        return parseInt(value, 10);
    }

    return value;
};

type APIAssignedSurvey = Omit<AssignedSurvey, "validFrom" | "validUntil"> & {
    validFrom?: number | string;
    validUntil?: number | string;
};

type APIParticipantMessage = Omit<ParticipantMessage, "scheduledFor"> & {
    scheduledFor: number | string;
};

type APIParticipantState = Omit<ParticipantState, "enteredAt" | "modifiedAt" | "lastSubmissions" | "assignedSurveys" | "messages"> & {
    enteredAt: number | string;
    modifiedAt?: number | string;
    lastSubmissions?: Record<string, number | string>;
    assignedSurveys?: APIAssignedSurvey[];
    messages?: APIParticipantMessage[];
};

export const pStateFromAPI = (pState: APIParticipantState): ParticipantState => {
    const lastSubmissions = Object.fromEntries(
        Object.entries(pState.lastSubmissions ?? {}).map(([key, value]) => [key, parseTimestamp(value) ?? 0]),
    );

    return {
        ...pState,
        enteredAt: parseTimestamp(pState.enteredAt) ?? 0,
        modifiedAt: parseTimestamp(pState.modifiedAt),
        lastSubmissions,
        assignedSurveys: (pState.assignedSurveys ?? []).map((survey) => ({
            ...survey,
            validFrom: parseTimestamp(survey.validFrom),
            validUntil: parseTimestamp(survey.validUntil),
        })),
        messages: (pState.messages ?? []).map((message) => ({
            ...message,
            scheduledFor: parseTimestamp(message.scheduledFor) ?? 0,
        })),
    };
}
