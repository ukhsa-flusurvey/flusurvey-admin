import NextAuth from "next-auth"
import "next-auth"

import CredentialsProvider from "next-auth/providers/credentials";
import { loginWithEmailRequest, renewTokenRequest } from "./utils/server/api";
import { ERROR_SECOND_FACTOR_NEEDED } from "./utils/server/types/authAPI";

const CASECredentialProvider = CredentialsProvider({
    id: "credentials",
    credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
        verificationCode: { label: "Verification Code", type: "text" },
    },
    async authorize(credentials: any, req) {
        if (!credentials || !credentials.email || !credentials.password) {
            console.error('Missing credentials');
            return null;
        }

        try {
            const response = await loginWithEmailRequest({
                email: credentials.email,
                password: credentials.password,
                verificationCode: credentials.verificationCode,
                instanceId: process.env.INSTANCE_ID ? process.env.INSTANCE_ID : 'default',
            });
            if (response.secondFactorNeeded) {
                throw new Error(ERROR_SECOND_FACTOR_NEEDED);
            }

            const now = new Date();
            return {
                id: response.user.id,
                email: response.user.account.accountId,
                name: response.user.account.accountId,
                account: {
                    accessToken: response.token.accessToken,
                    expiresAt: new Date(now.getTime() + response.token.expiresIn * 60000),
                    refreshToken: response.token.refreshToken,
                }
            };
        } catch (error: any) {
            if (error.error) {
                throw new Error(error.error);
            }
            console.error('Unexpected error when logging in with credentials: ', error);
            throw error;
        }
    },
})

export const {
    handlers: { GET, POST },
    auth,
    signIn,
    signOut
} = NextAuth({
    providers: [
        CASECredentialProvider
    ],
    pages: {
        signIn: '/auth/login',
    },
    callbacks: {
        async jwt({ token, user, account }) {
            if (account) {
                if (account.provider === 'credentials') {
                    // console.log(account, user)
                    return {
                        ...token,
                        accessToken: user.account.accessToken as string || '',
                        expiresAt: user.account.expiresAt.getTime(),
                        refreshToken: user.account.refreshToken,
                    }
                }
            } else if (token.expiresAt !== undefined && Date.now() < token.expiresAt) {
                // If the access token has not expired yet, return it
                return token
            } else {
                console.log('refreshing token');
                if (!token.refreshToken || !token.accessToken) {
                    return {
                        error: 'RefreshAccessTokenError' as const,
                    }
                }
                try {
                    const response = await renewTokenRequest(token.refreshToken, token.accessToken);
                    return {
                        ...token,
                        accessToken: response.accessToken,
                        expiresAt: new Date().getTime() + response.expiresIn * 60000,
                        refreshToken: response.refreshToken,
                    }
                } catch (error) {
                    console.error(error);
                    return {
                        error: 'RefreshAccessTokenError' as const,
                    }
                }
            }
            return token
        },
        async session({ session, token }) {
            session.accessToken = token.accessToken;
            session.tokenExpiresAt = token.expiresAt;
            return session
        }
    },
    logger: {
        debug: (...args) => console.log(...args),
        error: (...args) => console.error(...args),
        warn: (...args) => console.warn(...args),
    }
})

declare module "next-auth" {
    interface User {
        /** The user's postal address. */
        account: {
            accessToken: string;
            expiresAt: Date;
            refreshToken: string;
        }
    }

    interface Session {
        accessToken?: string
        tokenExpiresAt?: number;
    }

}

declare module "@auth/core/jwt" {
    /** Returned by the `jwt` callback and `auth`, when using JWT sessions */
    interface JWT {
        accessToken?: string
        expiresAt?: number
        refreshToken?: string
        error?: "RefreshAccessTokenError" | "LoginFailed"
    }
}


/*
const CASEOAuthProvider = (process.env.OPENID_CONFIG && process.env.OAUTH_CLIENT_ID && process.env.OAUTH_CLIENT_SECRET) ? {
    id: "management-user-oauth",
    name: "Management User OAuth",
    type: "oauth",
    wellKnown: process.env.OPENID_CONFIG,
    clientId: process.env.OAUTH_CLIENT_ID,
    clientSecret: process.env.OAUTH_CLIENT_SECRET,
    authorization: { params: { scope: "openid email profile" } },
    idToken: true,

    profile(profile) {
        return {
            id: profile.sub,
            name: profile.name,
            email: profile.email,
        }
    },

} as Provider : null;

const providers: Provider[] = [
    CASECredentialProvider,
];

if (CASEOAuthProvider) {
    providers.push(CASEOAuthProvider);
}


*/
