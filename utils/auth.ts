
export const RenewAzureToken = async (refreshToken: string) => {
    const url = process.env.AZURE_TOKEN_ENDPOINT;

    if (!url) {
        throw new Error('Azure Token Endpoint not set');
    }

    const params = new URLSearchParams();
    params.append('client_id', process.env.AZURE_AD_CLIENT_ID || '');
    params.append('scope', 'openid offline_access');
    params.append('refresh_token', refreshToken);
    params.append('client_secret', process.env.AZURE_AD_CLIENT_SECRET || '');
    params.append('grant_type', 'refresh_token');

    const response = await fetch(url, {
        method: 'POST',
        body: params.toString(),
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });

    return await response.json();
}
