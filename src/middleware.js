import { NextResponse } from 'next/server';

const RESERVED_ROUTES = ['login', 'signup', 'dashboard', 'api', '_next', 'favicon.ico', 'static', 'gate']; // (gate was just a test, ensure it's handled properly)

export async function middleware(request) {
  const url = request.nextUrl;
  const pathSegments = url.pathname.split('/').filter(Boolean);
  const shortCode = pathSegments[0];

  const RESERVED = ['login', 'signup', 'dashboard', 'api', '_next', 'favicon.ico', 'static'];

  if (!shortCode || RESERVED.includes(shortCode)) {
    return NextResponse.next();
  }

  try {
    // Construct an absolute URL using request.url origin for Vercel production safety
    const apiURL = new URL(`/api/redirect?code=${shortCode}`, request.url);
    const apiRes = await fetch(apiURL.toString(), {
      method: 'GET',
      headers: {
        Cookie: request.headers.get('cookie') || '',
      },
    });

    if (!apiRes.ok) {
      return NextResponse.next();
    }

    const data = await apiRes.json();

    if (data && data.originalUrl) {
      return NextResponse.redirect(data.originalUrl);
    }
  } catch (error) {
    console.error('Middleware redirect error:', error);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};