/**
 * An array of all the public routes that should be available to the user
 * without requiring authentication.
 * @type {string[]}
 * */
export const publicRoutes = ["/warmup", "/api/warmup", "/api/uploadthing"];

/**
 * An array of routes used for authentication.
 * these routes will redirect logged in users to the home page.
 * @type {string[]}
 * */
export const authRoutes = ["/auth/login", "/auth/register"];

/**
 * The prefix for API authentication routes.
 * Routes that start with this prefix will be used for API authentication.
 * @type {string}
 * */
export const apiAuthPrefix = "/api/auth";

export const DEFAULT_REDIRECT_ROUTE = "/";
