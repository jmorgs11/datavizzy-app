import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  // Public routes that don't require authentication
  publicRoutes: [
    "/",
    "/work",
    "/pricing",
    "/api/webhooks(.*)",
    "/api/webhooks/stripe",
  ],
  // Ignore these routes completely (no Clerk processing at all)
  ignoredRoutes: [
    "/api/webhooks/stripe",
  ],
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
