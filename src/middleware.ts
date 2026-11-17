import { NextRequest, NextResponse } from 'next/server';
import { ROLE_HOME, ROLE_ROUTES } from '@/lib/roles';

const PUBLIC_ROUTES = ['/', '/about', '/doctors', '/clinics', '/privacy', '/auth', '/api'];

/**
 * Reads the JWT payload for routing only. The signature is checked by the backend
 * on every API call, so a forged token here only shows an empty page.
 */
function decodeJWT(token: string): { id: number; role: string } | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString());
    if (payload.exp && Date.now() / 1000 > payload.exp) return null;
    return { id: payload.id, role: payload.role };
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    PUBLIC_ROUTES.some((r) => pathname === r || pathname.startsWith(r + '/')) ||
    pathname.startsWith('/_next') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  const token = request.cookies.get('accessToken')?.value;
  const decoded = token ? decodeJWT(token) : null;
  if (!decoded) {
    const response = NextResponse.redirect(new URL('/auth/login', request.url));
    if (token) response.cookies.delete('accessToken');
    return response;
  }

  const rule = ROLE_ROUTES.find(([prefix]) => pathname === prefix || pathname.startsWith(prefix + '/'));
  if (rule && !rule[1].includes(decoded.role)) {
    return NextResponse.redirect(new URL(ROLE_HOME[decoded.role] || '/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
