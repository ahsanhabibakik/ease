import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const supportedLocales = ['en', 'hi', 'bn', 'fr'];
const defaultLocale = 'en';

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

  // Set locale cookie based on Accept-Language if not already set
  if (!request.cookies.has('ease-locale')) {
    const acceptLanguage = request.headers.get('accept-language');
    let locale = defaultLocale;
    
    if (acceptLanguage) {
      const preferredLocale = supportedLocales.find(
        loc => acceptLanguage.toLowerCase().includes(loc)
      );
      if (preferredLocale) locale = preferredLocale;
    }
    
    const response = NextResponse.next();
    response.cookies.set('ease-locale', locale, { 
      path: '/', 
      maxAge: 60 * 60 * 24 * 365 // 1 year
    });
    return response;
  }
}

export const config = {
  matcher: [
    // Skip all internal paths (_next)
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
