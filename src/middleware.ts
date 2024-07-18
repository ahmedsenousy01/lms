import { NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";

import {
  apiAuthPrefix,
  authRoutes,
  publicRoutes,
  DEFAULT_REDIRECT_ROUTE,
} from "@/server/auth/routes";

export default withAuth(
  req => {
    const { nextUrl } = req;
    const isLoggedIn = !!req.nextauth.token;

    const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
    const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
    const isAuthRoute = authRoutes.includes(nextUrl.pathname);

    if (isApiAuthRoute) return NextResponse.next();

    if (isAuthRoute) {
      if (isLoggedIn) {
        return NextResponse.redirect(new URL(DEFAULT_REDIRECT_ROUTE, nextUrl));
      }
      return NextResponse.next();
    }

    if (!isLoggedIn && !isPublicRoute) {
      return NextResponse.redirect(
        new URL(
          `/auth/login?callbackUrl=${nextUrl.pathname ?? DEFAULT_REDIRECT_ROUTE}`,
          nextUrl
        )
      );
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token, // This will authorize if a token exists
    },
  }
);

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
