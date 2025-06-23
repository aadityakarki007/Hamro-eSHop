// middleware.ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// Public routes – no auth needed
const isPublicRoute = createRouteMatcher([
  '/',
  '/all-products',
  '/product/(.*)',
  '/api/product/list',
  '/api/product/all',
  '/api/product/(.*)',
  '/api/webhook/(.*)',
  '/api/user/(.*)',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/termsofservice(.*)',
  '/privacy-policy(.*)',
  '/about-us(.*)',
  '/terms&conditions(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
  // 1) Let API requests through if they have a Bearer token
  const authHeader = req.headers.get('authorization'); // header names are case-insensitive
  if (authHeader?.startsWith('Bearer ')) {
    return NextResponse.next();
  }

  // 2) Block everything that isn't public
  if (!isPublicRoute(req)) {
    const { userId } = await auth();
    if (!userId) {
      const signInUrl = new URL('/sign-in', req.url);
      signInUrl.searchParams.set('redirect_url', req.url);
      return NextResponse.redirect(signInUrl);
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
