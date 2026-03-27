import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  exp: number;
  [key: string]: unknown;
}

const PUBLIC_ROUTES = ['/login', '/signin'];


// in next.js 16.2 we need to use proxy instead of middleware to handle authentication
// this is a simple implementation of authentication
export function proxy(request: NextRequest) {
  const url = request.nextUrl.pathname;

  const token = request.cookies.get('auth_token')?.value;
  const isPublicRoute = PUBLIC_ROUTES.includes(url);


  // 1. Pas de token = laisser passer les pages publiques, sinon rediriger vers /login
  if (!token) {
    if (isPublicRoute) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Redirection immédiate de la racine vers le dashboard
  if (url === '/') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // 2. Vérifier la validité du token
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    const isExpired = decoded.exp * 1000 < Date.now();

    if (isExpired) {
      const response = isPublicRoute
        ? NextResponse.next()
        : NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('auth_token');
      return response;
    }
  } catch {
    const response = isPublicRoute
      ? NextResponse.next()
      : NextResponse.redirect(new URL('/login', request.url));
    response.cookies.delete('auth_token');
    return response;
  }

  // 3. Token valide + page publique → rediriger vers /dashboard
  if (isPublicRoute) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // 4. Token valide, on laisse passer
  return NextResponse.next();
}

// 5. Configurer les routes sur lesquelles le proxy s'active
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|\\.well-known).*)'],
};
