// File: frontend/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const maintenanceMode = process.env.NEXT_PUBLIC_MAINTENANCE_MODE || 'true';

  if (maintenanceMode === 'true' && url.pathname !== '/proximamente') {
    return NextResponse.redirect(new URL('/proximamente', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|proximamente|logogophone.png|logow.svg).*)'],
};