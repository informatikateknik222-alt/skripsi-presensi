import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Ambil token dari cookie
  const token = request.cookies.get('access_token')?.value;

  // Protect semua route di dalam /dashboard
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    if (!token) {
      // Jika tidak ada token, redirect ke halaman login
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Jika sudah login, cegah akses kembali ke halaman login
  if (request.nextUrl.pathname === '/login') {
    if (token) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard', '/dashboard/:path*', '/login'],
};
