import { auth } from "./auth"
import { PUBLIC_ROUTES } from "./routes";

export default auth((req) => {
    const { nextUrl } = req;
    const isLoggedIn = !!req.auth;

    const isPublicRoute = PUBLIC_ROUTES.some((route) => {
        if (route.exact) {
            return route.path === nextUrl.pathname;
        }
        return nextUrl.pathname.startsWith(route.path);
    });

    if (process.env.NODE_ENV === 'development') {
        console.log("middleware", { path: nextUrl.pathname, login: isLoggedIn, isPublicRoute });
    }

    if (isPublicRoute) {
        return null;
    }

    if (!isLoggedIn) {
        const redirectUrl = new URL(`/auth/login?callback=${nextUrl.pathname}`, nextUrl);
        return Response.redirect(redirectUrl);
    }

    // TODO: handle admin routes
})

export const config = {
    matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
}
