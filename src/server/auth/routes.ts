/**
 * An array of all the public routes that should be available to the user
 * without requiring authentication.
 * */
export const publicRoutes = ["/", "/warmup", "/api/warmup", "/api/uploadthing"];

/**
 * An array of routes used for authentication.
 * these routes will redirect logged in users to the home page.
 * */
export const authRoutes = ["/auth/login", "/auth/register"];

/**
 * The prefix for API authentication routes.
 * Routes that start with this prefix will be used for API authentication.
 * */
export const apiAuthPrefix = "/api/auth";

export const DEFAULT_REDIRECT_ROUTE = "/";
