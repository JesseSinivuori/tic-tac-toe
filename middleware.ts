import { NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(req) {
    const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-inline' ${
      process.env.NODE_ENV === "development" ? `'unsafe-eval'` : ""
    };
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data: https://avatars.githubusercontent.com/;
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
    worker-src 'self' blob:;
    connect-src 'self' ${
      process.env.NODE_ENV === "development"
        ? "wss://sensible-guineapig-904.convex.cloud/"
        : "wss://rapid-mule-590.convex.cloud/"
    };;
`;

    const requestHeaders = new Headers(req.headers);

    // Setting request headers
    requestHeaders.set(
      "Content-Security-Policy",
      // Replace newline characters and spaces
      cspHeader.replace(/\s{2,}/g, " ").trim(),
    );

    return NextResponse.next({
      headers: requestHeaders,
      request: {
        headers: requestHeaders,
      },
    });
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        if (req.nextUrl.pathname.startsWith("/api/openai")) {
          // Sign in is required for ChatGPT API
          return token ? true : false; // If there is a token, the user is authenticated
        }
        return true;
      },
    },
  },
);

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    {
      source: "/((?!api|_next/static|_next/image|favicon.ico).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
