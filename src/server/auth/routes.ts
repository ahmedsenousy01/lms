/**
 * An array of all the public routes that should be available to the user
 * without requiring authentication.
 * @type {string[]}
 * */
export const publicRoutes = ["/warmup"];

/**
 * An array of routes used for authentication.
 * these routes will redirect logged in users to the home page.
 * @type {string[]}
 * */
export const authRoutes = ["/auth/login", "/auth/register"];

export const DEFAULT_REDIRECT_ROUTE = "/";
