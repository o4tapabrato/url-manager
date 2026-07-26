import { NextResponse } from 'next/server';

const RESERVED_ROUTES = ['login', 'signup', 'dashboard', 'api', '_next', 'favicon.ico', 'static'];

export async function middleware(request) {
  const url = request.nextUrl;
  const pathSegments = url.pathname.split('/').filter(Boolean);
  const shortCode = pathSegments[0];

  // If there's no path, or it's a reserved system route, let it pass normally
  if (!shortCode || RESERVED_ROUTES.includes(shortCode)) {
    return NextResponse.next();
  }

  try {
    // Call your internal API route to handle the lookup and click increment securely
    const apiRes = await fetch(new URL(`/api/redirect?code=${shortCode}`, request.url), {
      method: 'GET',
    });

    if (!apiRes.ok) {
      return NextResponse.next(); // Let Next.js handle 404 naturally
    }

    const data = await apiRes.json();

    if (data && data.originalUrl) {
      // Perform the redirect to the target destination
      return NextResponse.redirect(data.originalUrl);
    }
  } catch (error) {
    console.error('Middleware redirect error:', error);
  }

  return NextResponse.next();
}

// Match all routes except static files
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};