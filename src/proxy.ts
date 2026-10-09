import type { NextFetchEvent, NextRequest } from 'next/server';
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from './libs/I18nRouting';

const handleI18nRouting = createMiddleware(routing);

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/:locale/dashboard(.*)',
]);

const isAuthPage = createRouteMatcher([
  '/sign-in(.*)',
  '/:locale/sign-in(.*)',
  '/sign-up(.*)',
  '/:locale/sign-up(.*)',
]);

// The order form is public (guests can order), but when a signed-in customer orders we want
// Clerk to run so the order is linked to their account. Guests (no Clerk cookies) skip Clerk entirely.
const isOrderPage = createRouteMatcher([
  '/catalog(.*)',
  '/:locale/catalog(.*)',
]);

const hasClerkSession = (request: NextRequest) =>
  request.cookies.has('__session') || request.cookies.has('__client_uat');

export default async function proxy(
  request: NextRequest,
  event: NextFetchEvent,
) {
  // Clerk keyless mode doesn't work with i18n, this is why we need to run the middleware conditionally
  if (
    isAuthPage(request) || isProtectedRoute(request) || (isOrderPage(request) && hasClerkSession(request))
  ) {
    return clerkMiddleware(async (auth, req) => {
      // Check if the current route is protected and requires authentication
      // If user is not authenticated, redirect them to the sign-in page with proper locale
      if (isProtectedRoute(req)) {
        const locale = req.nextUrl.pathname.match(/(\/.*)\/dashboard/)?.at(1) ?? '';

        const signInUrl = new URL(`${locale}/sign-in`, req.url);

        await auth.protect({
          unauthenticatedUrl: signInUrl.toString(),
        });
      }

      return handleI18nRouting(req);
    })(request, event);
  }

  return handleI18nRouting(request);
}

export const config = {
  // Match all pathnames except for
  // - … if they start with `/_next`, `/_vercel` or `monitoring`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: '/((?!api|_next|_vercel|monitoring|.*\\..*).*)',
};
