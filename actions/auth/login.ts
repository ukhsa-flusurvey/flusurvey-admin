'use server';

import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { revalidatePath } from "next/cache";


export const login = async (
    type: string,
    payload?: any
) => {
    try {
        await signIn(type, payload);
    } catch (error: any) {
        if (error instanceof Error) {
            const { type, cause } = error as AuthError;
            console.log(error);
            switch (type) {
                case "CallbackRouteError":
                    return {
                        success: false,
                        error: cause?.err?.toString()
                    }
                default:
                    return {
                        success: false,
                        error: error.message
                    }
            }
        }
    }
    revalidatePath('/');
    return {
        success: true,
    }
}
