import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // Log all incoming requests for debugging
  // console.log('Middleware Triggered');
  // console.log('Current Path:', request.nextUrl.pathname);
  // console.log('Full URL:', request.url);

  // Define public paths that don't require authentication
  const publicPaths = [
    "/login",
    "/register",
    "/public",
    "/api",
    // '/api/auth/login',
    // '/api/auth/verify',
    // '/api/auth/register',
    // '/api/stores/'
  ];
  

  const res = NextResponse.next();
  res.headers.set('Access-Control-Allow-Credentials', "true");
  res.headers.set('Access-Control-Allow-Origin', '*'); // replace this with your actual origin
  res.headers.set('Access-Control-Allow-Methods', 'GET,DELETE,PATCH,POST,PUT');
  res.headers.set(
      'Access-Control-Allow-Headers',
      'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );


  const path = request.nextUrl.pathname;
  const token = request.cookies.get("token")?.value || "";

  // console.log('Token Present:', token);
  // console.log('Is Public Path:', publicPaths.includes(path));

  // If it's a public path, allow access
  if (publicPaths.some((publicPath) => path.startsWith(publicPath))) {
    // console.log('Accessing Public Path');
    return res;
  }

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    // Create a new request to the verify endpoint

    const verifyResponse = await fetch(
      new URL("/api/auth/verify", request.url),
      {
        method: "GET",
        headers: {
          Cookie: `token=${token}`, // Pass the token in the request headers
          "Content-Type": "application/json",
        },
      }
    );

    // console.log("Verify Response Status:", verifyResponse.status);

    if (verifyResponse.status !== 200) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    return res;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    // console.error('Verification Error:', error);
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

// Specify which routes this middleware should run on

export const config = {
  matcher: [
    // Protect these routes
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
// export const config = {

//   matcher: [
//     // Protect these routes
//     '/((?!_next/static|_next/image|favicon.ico).*)',
//   ],
// };
