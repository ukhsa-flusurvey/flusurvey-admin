'use server';

import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { revalidatePath } from "next/cache";


export const login = async (
    type: string,
    payload?: Parameters<typeof signIn>[1]
) => {
    try {
        await signIn(type, payload);
    } catch (error: unknown) {
        if (error instanceof AuthError) {
            console.log(error);
            switch (error.type) {
                case "CallbackRouteError":
                    return {
                        success: false,
                        error: error.cause?.err?.toString()
                    }
                default:
                    return {
                        success: false,
                        error: error.message
                    }
            }
        }

        if (error instanceof Error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
    revalidatePath('/');
    return {
        success: true,
    }
}
