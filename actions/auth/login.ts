'use server';

import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { revalidatePath } from "next/cache";


export const login = async (
    type: 'credentials',
    payload?: any
) => {
    if (type === 'credentials') {
        try {
            await signIn(type, payload);
        } catch (error: any) {
            if (error instanceof Error) {
                const { type, cause } = error as AuthError;
                switch (type) {
                    case "CredentialsSignin":
                        return {
                            success: false,
                            error: "Invalid credentials."
                        }
                    case "CallbackRouteError":
                        return {
                            success: false,
                            error: cause?.err?.toString()
                        }
                    default:
                        throw error;
                }
            }
        }
    } else {
        throw new Error(`Unsupported login type: ${type}`);
    }

    revalidatePath('/');
    return {
        success: true,
    }
}
