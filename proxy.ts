import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  // 1. Lire un cookie d'authentification (ex: "auth_token")
  // Le nom dépend de la façon dont tu gères tes cookies à la connexion
  const token = request.cookies.get('auth_token')?.value;

  // 2. Si pas de token, on redirige vers /login
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 3. Sinon, on laisse passer l'utilisateur
  return NextResponse.next();
}

// 4. Configurer les routes sur lesquelles le proxy s'active
export const config = {
  // On protège tout le site SAUF login, signin, l'api et les fichiers statiques (_next, favicon)
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|login|signin).*)'],
};
