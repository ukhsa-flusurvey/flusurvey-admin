import { ExpressionArg } from "survey-engine/data_types";

export interface HeaderOverrides {
    from: string;
    sender: string;
    replyTo: string[];
    noReplyTo: boolean;
}

export interface EmailTemplate {
    messageType: string;
    defaultLanguage: string;
    headerOverrides?: HeaderOverrides;
    translations: {
        lang: string;
        subject: string;
        templateDef: string;
    }[];
}

export interface MessageSchedule {
    id: string;
    template: EmailTemplate;
    type: 'all-users' | 'study-participants';
    studyKey: string;
    condition?: ExpressionArg;
    nextTime: number; // when is the next time the message should be triggered
    period: number; // how often it should be triggered
    label: string; // short description to describe intent of the message
    until?: number; // until when the message should be triggered
}
