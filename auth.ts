import NextAuth from "next-auth"
import "next-auth"

import { Provider } from "next-auth/providers"
import AzureADProvider from "next-auth/providers/microsoft-entra-id";
import { extendSessionRequest, getRenewTokenRequest, signInWithIdPRequest } from "./utils/server/api";
import { RenewAzureToken } from "./utils/auth";


const MsEntraIDProvider = AzureADProvider({
    id: "ms-entra-id",
    name: "Management User Azure AD",
    clientId: process.env.AZURE_AD_CLIENT_ID,
    clientSecret: process.env.AZURE_AD_CLIENT_SECRET,
    tenantId: process.env.AZURE_AD_TENANT_ID || '',
    authorization: { params: { scope: "openid email profile offline_access" } },
    profile: (profile) => {
        return {
            sub: profile.sub,
            name: profile.name,
            roles: profile.roles,
            email: profile.email,
            image: profile.picture,
        }
    }
})


const providers: Provider[] = [
    MsEntraIDProvider
]

export const {
    handlers: { GET, POST },
    auth,
    signIn,
    signOut
} = NextAuth({
    providers: providers,
    trustHost: true,
    basePath: '/api/auth',
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: '/auth/login',
    },
    callbacks: {
        async jwt({ token, user, account }) {
            if (account) {
                token.provider = account.provider;
                if (account.provider === 'ms-entra-id') {
                    if (!user.sub) {
                        return {
                            error: 'LoginFailed' as const
                        }
                    }

                    try {
                        const response = await signInWithIdPRequest({
                            instanceId: process.env.INSTANCE_ID ? process.env.INSTANCE_ID : 'default',
                            sub: user.sub,
                            name: user.name || undefined,
                            email: user.email || undefined,
                            imageURL: user.image || undefined,
                            provider: account.provider,
                            roles: user.roles,
                            renewToken: account.refresh_token
                        })
                        token.CASESessionID = response.sessionID
                        token.CASEaccessToken = response.accessToken
                        token.expiresAt = response.expiresAt
                        token.renewSessionAt = Math.floor((response.expiresAt + (Date.now() / 1000)) / 2)
                        token.isAdmin = response.isAdmin
                    } catch (e) {
                        console.error(e)
                        return {
                            error: 'LoginFailed' as const
                        }
                    }
                    token.user = {
                        name: user.name,
                        email: user.email,
                        image: user.image
                    }
                    return token
                }
            } else if (token.renewSessionAt !== undefined && Date.now() > token.renewSessionAt * 1000) {
                if (token.provider === 'ms-entra-id') {
                    console.log('refreshing token');

                    if (!token.CASEaccessToken || !token.CASESessionID) {
                        console.log(token)
                        console.error('No token or session id found')
                        return {
                            ...token,
                            error: 'RefreshAccessTokenError' as const,
                        }
                    }

                    // get refresh token from CASE session
                    try {
                        const resp = await getRenewTokenRequest(token.CASEaccessToken, token.CASESessionID)

                        if (!resp.renewToken) {
                            return token;
                        }

                        // renew token by azure ad
                        const refreshTokenResp = await RenewAzureToken(resp.renewToken);
                        const newRenewToken = refreshTokenResp.refresh_token;

                        if (!newRenewToken) {
                            return token;
                        }

                        // get new JWT from CASE backend
                        const newTokenResp = await extendSessionRequest(token.CASEaccessToken, newRenewToken);
                        token.CASEaccessToken = newTokenResp.accessToken;
                        token.CASESessionID = newTokenResp.sessionID;
                        token.expiresAt = newTokenResp.expiresAt;
                        token.renewSessionAt = Math.floor((newTokenResp.expiresAt + (Date.now() / 1000)) / 2);
                        token.isAdmin = newTokenResp.isAdmin;

                        return token;
                    } catch (err: unknown) {
                        console.error(err)
                        // console.error(e)
                        return token;
                    }
                }
                return token
            }
            return token
        },
        async session({ session, token }) {
            session.CASEaccessToken = token.CASEaccessToken;
            session.tokenExpiresAt = token.expiresAt;
            session.isAdmin = token.isAdmin;
            return session
        }
    },
    logger: {
        //debug: (...args) => console.log(...args),
        error: (...args) => console.error(...args),
        warn: (...args) => console.warn(...args),
    }
})

declare module "next-auth" {
    interface User {
        sub?: string;
        roles?: string[];
    }

    interface Session {
        CASESessionID?: string;
        CASEaccessToken?: string;
        isAdmin?: boolean;
        tokenExpiresAt?: number;
    }

}

declare module "@auth/core/jwt" {
    /** Returned by the `jwt` callback and `auth`, when using JWT sessions */
    interface JWT {
        provider?: string
        CASEaccessToken?: string
        CASESessionID?: string
        expiresAt?: number
        renewSessionAt?: number
        isAdmin?: boolean
        error?: "RefreshAccessTokenError" | "LoginFailed"
    }
}
