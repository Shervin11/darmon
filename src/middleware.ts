import { NextRequest, NextResponse } from 'next/server';

// Routes accessible by specific roles
const ROLE_ROUTES: Record<string, string[]> = {
  admin:  ['/admin'],
  clinic: ['/clinic'],
  doctor: ['/dashboard', '/protocol'],
  client: ['/appointments', '/wishlist'],
};

// Routes accessible to ALL authenticated users
const AUTH_ROUTES = ['/profile', '/ai-companion', '/chat'];

// Public routes (no auth required)
const PUBLIC_ROUTES = ['/', '/about', '/doctors', '/auth', '/api'];

function decodeJWT(token: string): { id: number; role: string } | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString());
    // Check expiration
    if (payload.exp && Date.now() / 1000 > payload.exp) return null;
    return { id: payload.id, role: payload.role };
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public routes and static assets
  if (
    PUBLIC_ROUTES.some((r) => pathname === r || pathname.startsWith(r + '/')) ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Get token from cookie
  const token = request.cookies.get('accessToken')?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  const decoded = decodeJWT(token);
  if (!decoded) {
    // Invalid/expired token — redirect to login
    const response = NextResponse.redirect(new URL('/auth/login', request.url));
    response.cookies.delete('accessToken');
    return response;
  }

  const { role } = decoded;

  // Check role-specific routes
  for (const [routeRole, routes] of Object.entries(ROLE_ROUTES)) {
    if (routes.some((r) => pathname.startsWith(r))) {
      if (role !== routeRole) {
        // Redirect to their own home
        const homeMap: Record<string, string> = {
          admin: '/admin/panel',
          clinic: '/clinic/dashboard',
          doctor: '/dashboard',
          client: '/doctors',
        };
        return NextResponse.redirect(new URL(homeMap[role] || '/', request.url));
      }
      return NextResponse.next();
    }
  }

  // Auth routes — any authenticated user
  if (AUTH_ROUTES.some((r) => pathname.startsWith(r))) {
    return NextResponse.next();
  }

  // Default: allow
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
