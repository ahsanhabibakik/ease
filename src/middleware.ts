import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const supportedLocales = ['en', 'hi', 'bn', 'fr'];
const defaultLocale = 'en';

function getLocale(request: NextRequest): string {
  // Check if locale is in pathname
  const pathname = request.nextUrl.pathname;
  const pathnameIsMissingLocale = supportedLocales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  if (pathnameIsMissingLocale) {
    // Check for stored preference in cookie
    const locale = request.cookies.get('ease-locale')?.value;
    if (locale && supportedLocales.includes(locale)) {
      return locale;
    }
    
    // Check Accept-Language header
    const acceptLanguage = request.headers.get('accept-language');
    if (acceptLanguage) {
      const preferredLocale = supportedLocales.find(
        locale => acceptLanguage.toLowerCase().includes(locale)
      );
      if (preferredLocale) return preferredLocale;
    }
  }

  return defaultLocale;
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Skip middleware for API routes, static files, and Next.js internals
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.includes('.') ||
    pathname.startsWith('/favicon')
  ) {
    return;
  }

  // List of existing non-localized routes
  const existingRoutes = [
    '/add-worry',
    '/companion', 
    '/calm-corner',
    '/easeboard',
    '/profile',
    '/worry-reflection',
    '/challenge-worry',
    '/auth/signin'
  ];

  // If it's an existing route, don't redirect
  if (existingRoutes.some(route => pathname.startsWith(route))) {
    return;
  }

  const pathnameIsMissingLocale = supportedLocales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  if (pathnameIsMissingLocale) {
    const locale = getLocale(request);
    
    // Only redirect root path and paths that don't exist as regular routes
    if (pathname === '/') {
      // For root, redirect to locale-specific home
      const redirectUrl = new URL(`/${locale}`, request.url);
      return NextResponse.redirect(redirectUrl);
    }
  }
}

export const config = {
  matcher: [
    // Skip all internal paths (_next)
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
