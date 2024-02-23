'use server'

import { getCASEManagementAPIURL, getTokenHeader } from "./api";

export const fetchCASEManagementAPI = async (
    pathname: string,
    accessToken: string,
    headers: { [key: string]: string } = {},
    method: string = 'GET',
    body?: BodyInit,
    revalidate: number = 0,
) => {
    const url = getCASEManagementAPIURL(pathname);
    const response = await fetch(url, {
        method,
        headers: {
            ...getTokenHeader(accessToken),
            ...headers,
        },
        body: body,
        next: {
            revalidate: revalidate,
        }
    });

    try {
        const responseBody = await response.json();
        return {
            status: response.status,
            body: responseBody,
        };
    } catch (e) {
        return {
            status: response.status,
            body: { error: response.statusText },
        };
    }
}
