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
    currentStudySession?: string;
    flags: { [key: string]: string };
    linkingCodes?: { [key: string]: string };
    lastSubmissions: { [key: string]: number };
    assignedSurveys: AssignedSurvey[];
    messages: ParticipantMessage[];
}

export const pStateFromAPI = (pState: any): ParticipantState => {
    // convert enteredAt to number
    if (pState.enteredAt && typeof (pState.enteredAt) === 'string') {
        pState.enteredAt = parseInt(pState.enteredAt);
    }

    // convert lastSubmissions to numbers
    if (pState.lastSubmissions) {
        for (const key in pState.lastSubmissions) {
            if (typeof (pState.lastSubmissions[key]) === 'string') {
                pState.lastSubmissions[key] = parseInt(pState.lastSubmissions[key]);
            }
        }
    }

    // convert assignedSurveys to numbers
    if (pState.assignedSurveys) {
        pState.assignedSurveys = pState.assignedSurveys.map((s: any) => {
            if (typeof (s.validFrom) === 'string') {
                s.validFrom = parseInt(s.validFrom);
            }
            if (typeof (s.validUntil) === 'string') {
                s.validUntil = parseInt(s.validUntil);
            }
            return s;
        });
    }

    // convert messages to numbers
    if (pState.messages) {
        pState.messages = pState.messages.map((m: any) => {
            if (typeof (m.scheduledFor) === 'string') {
                m.scheduledFor = parseInt(m.scheduledFor);
            }
            return m;
        });
    }

    return pState
}
