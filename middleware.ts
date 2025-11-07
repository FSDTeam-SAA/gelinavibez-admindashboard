
// // middleware.ts
// import { NextResponse } from 'next/server'
// import type { NextRequest } from 'next/server'
// import { getToken } from 'next-auth/jwt'

// export async function middleware(request: NextRequest) {
//   const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
//   const { pathname } = request.nextUrl

//   // Define public routes that don't require authentication
//   const publicRoutes = [
//     '/login',
//     '/forgot-password',
//     '/reset-password',
//     '/verify-email',
//     '/api/auth',
//     '/_next',
//     '/favicon.ico'
//   ]

//   // Check if the current route is public
//   const isPublicRoute = publicRoutes.some(route => 
//     pathname.startsWith(route)
//   )
  
//   // Allow public routes to pass through
//   if (isPublicRoute) {
//     return NextResponse.next()
//   }

//   // Redirect to login if not authenticated
//   if (!token) {
//     const loginUrl = new URL('/login', request.url)
//     // Add callback URL for redirect after login
//     loginUrl.searchParams.set('callbackUrl', pathname)
//     return NextResponse.redirect(loginUrl)
//   }

//   return NextResponse.next()
// }

// export const config = {
//   matcher: [

//     '/((?!_next/static|_next/image|favicon.ico).*)',
//   ],
// }


// middleware.ts
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
  const { pathname } = request.nextUrl

  const publicRoutes = [
    "/login",
    "/forgot-password",
    "/reset-password",
    "/verify-email",
    "/api/auth",
    "/_next",
    "/favicon.ico",
  ]
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route))
  if (isPublicRoute) return NextResponse.next()

  // Not logged in
  if (!token) {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(loginUrl)
  }

  const userRole = token.role

  // Superadmin → full access
  if (userRole === "superadmin") {
    return NextResponse.next()
  }

  if (userRole === "admin") {
    const adminBlockedRoutes = ["/newsletter", "/admin-request"]

    const isBlocked = adminBlockedRoutes.some((route) => pathname.startsWith(route))

    if (isBlocked) {
      const url = new URL("/not-access", request.url)
      url.searchParams.set("error", "unauthorized")
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next|api/auth).*)"],
}
