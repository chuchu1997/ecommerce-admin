import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/auth/utils";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  console.log("MIDDLE WARE CALL !!! ");

  // Check if the current path is a public path
  //   const isPublicPath = publicPaths.includes(request.nextUrl.pathname)

  if (token) {
    // If logged in and trying to access login/register, redirect to dashboard
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (!token) {
    // Not authenticated, redirect to login
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    // Verify token
    const decoded = verifyToken(token);

    if (!decoded) {
      // Invalid token
      return NextResponse.redirect(new URL("/login", request.url));
    }
  } catch (error) {
    // Token verification failed
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

// Matching paths for middleware
// export const config = {
//   matcher: [
//     '/',
//     '/login',
//     '/register',
//     '/dashboard/:path*',
//     '/profile/:path*'
//   ]
// }
