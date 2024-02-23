export const PUBLIC_ROUTES = [
    { path: '/', exact: true },
    { path: '/service-status', exact: true },

    // These routes and its children will be public
    { path: '/api/auth', exact: false },
    { path: '/tools/editors', exact: false },
]

export const ADMIN_ROUTES = [
    { path: '/tools/user-management', exact: false },
]

export const AuthPages = ['/auth/login']
