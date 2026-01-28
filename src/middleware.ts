import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // Skip auth for voice API endpoints (Twilio webhooks), audio files, and landing page
  if (request.nextUrl.pathname.startsWith('/api/voice') ||
      request.nextUrl.pathname.startsWith('/audio') ||
      request.nextUrl.pathname === '/') {
    return NextResponse.next();
  }

  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options?: CookieOptions }[]) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If user is not signed in and trying to access protected routes
  // Allow access to dashboard and other pages for demo purposes
  // In production, you would want stricter auth
  if (
    !user &&
    !request.nextUrl.pathname.startsWith('/login') &&
    !request.nextUrl.pathname.startsWith('/dashboard') &&
    !request.nextUrl.pathname.startsWith('/leads') &&
    !request.nextUrl.pathname.startsWith('/clientes') &&
    !request.nextUrl.pathname.startsWith('/whatsapp') &&
    !request.nextUrl.pathname.startsWith('/call-center') &&
    !request.nextUrl.pathname.startsWith('/calid-ai') &&
    !request.nextUrl.pathname.startsWith('/estudios') &&
    !request.nextUrl.pathname.startsWith('/referidos') &&
    !request.nextUrl.pathname.startsWith('/recordatorios')
  ) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // If user is signed in and trying to access login page
  if (user && request.nextUrl.pathname.startsWith('/login')) {
    const url = request.nextUrl.clone();
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|logos|.*\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
