import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";

console.log("in proxy");

function isPublicAuthRoute(req: NextRequest) {
  console.log("in isPublicAuthRoute");
  const pathname = req.nextUrl.pathname;
  const signInUrl = process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL ?? "/sign-in";
  const signUpUrl = process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL ?? "/sign-up";

  return (
    pathname === signInUrl ||
    pathname.startsWith(`${signInUrl}/`) ||
    pathname === signUpUrl ||
    pathname.startsWith(`${signUpUrl}/`)
  );
}

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicAuthRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
    "/__clerk/(.*)",
  ],
};
