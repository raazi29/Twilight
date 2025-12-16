import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
    // Routes that can be accessed while signed out
    publicRoutes: [
        "/sign-in(.*)",
        "/sign-up(.*)",
        "/sso-callback(.*)",
        "/api/(.*)",  // Allow API routes publicly (auth handled at page level)
    ],
    // Routes that don't require authentication
    ignoredRoutes: [
        "/api/(.*)",
    ],
});

export const config = {
    matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
