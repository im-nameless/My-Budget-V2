import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if user is authenticated (simplified check)
  const hasUser = request.cookies.get("user") || (typeof window !== "undefined" && localStorage.getItem("user"))

  // Public routes that don't require authentication
  const publicRoutes = ["/login"]
  const isPublicRoute = publicRoutes.includes(pathname)

  // If user is not authenticated and trying to access protected route
  if (!hasUser && !isPublicRoute) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // If user is authenticated and trying to access login page
  if (hasUser && pathname === "/login") {
    return NextResponse.redirect(new URL("/", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
