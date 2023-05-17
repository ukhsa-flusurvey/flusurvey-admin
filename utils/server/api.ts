import axios from 'axios';
import * as fs from 'fs';
import * as https from 'https';
import { LoginMsg, LoginResponse, TokenResponse } from './types/authAPI';

export const getCASEManagementAPIURL = (path: string): URL => {
    return new URL(path, process.env.MANAGEMENT_API_URL ? process.env.MANAGEMENT_API_URL : '');
}


export const getTokenHeader = (accessToken?: string): {} | { Autorization: string } => {
    if (!accessToken) {
        return {};
    }
    return {
        'Authorization': `Bearer ${accessToken}`
    }
}

const postToCASEManagementAPI = async (path: string, data: any, accessToken?: string) => {
    const url = getCASEManagementAPIURL(path);
    const response = await fetch(url.toString(), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...getTokenHeader(accessToken)
        },
        body: JSON.stringify(data)
    });
    if (!response.ok || response.status > 299) {
        throw response.json();
    }
    return await response.json();
}


const caseAdminAPIInstance = axios.create({
    baseURL: process.env.MANAGEMENT_API_URL ? process.env.MANAGEMENT_API_URL : '',
    httpsAgent: process.env.USE_MUTUAL_TLS === 'true' ? new https.Agent({
        key: fs.readFileSync(process.env.MUTUAL_TLS_CLIENT_KEY_PATH ? process.env.MUTUAL_TLS_CLIENT_KEY_PATH : ''),
        cert: fs.readFileSync(process.env.MUTUAL_TLS_CLIENT_CERTIFICATE_PATH ? process.env.MUTUAL_TLS_CLIENT_CERTIFICATE_PATH : ''),
        ca: fs.readFileSync(process.env.MUTUAL_TLS_CA_CERTIFICATE_PATH ? process.env.MUTUAL_TLS_CA_CERTIFICATE_PATH : '')
    }) : undefined,
});


// Auth API
export const loginWithEmailRequest = async (creds: LoginMsg): Promise<LoginResponse> => {
    return postToCASEManagementAPI('/v1/auth/login-with-email', creds);
}


export const renewTokenRequest = (refreshToken: string, accessToken: string) => caseAdminAPIInstance.post<TokenResponse>('/v1/auth/renew-token', { refreshToken }, { headers: { ...getTokenHeader(accessToken) } });

export default caseAdminAPIInstance;
