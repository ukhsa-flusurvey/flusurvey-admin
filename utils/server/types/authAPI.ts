import { Profile, User } from "./user";

export const ERROR_SECOND_FACTOR_NEEDED = 'Second factor needed';

export interface LoginMsg {
    email: string;
    password: string;
    instanceId: string;
    verificationCode?: string;
}

export interface LoginResponse {
    token: TokenResponse;
    user: User;
    secondFactorNeeded: boolean;
}

export interface TokenResponse {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    profiles: Profile[];
    selectedProfileId: string;
    preferredLanguage: string;
}
