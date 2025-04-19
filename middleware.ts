import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

// Lấy JWT_SECRET từ môi trường (cần phải set trong .env)
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "");

// Danh sách các origin được phép
const allowedOrigins = [
  'https://happyfurniture.logtech.vn',
  'https://admin.happyfurniture.logtech.vn',
  // Thêm domain khác nếu cần
];

export async function middleware(request: NextRequest) {
  // Danh sách các path công khai không yêu cầu token
  const publicPaths = ["/login", "/register", "/public", "/api"];

  // Lấy token từ cookies
  const token = request.cookies.get("token")?.value || "";
  const res = NextResponse.next();

  // Lấy path hiện tại của request
  const pathname = request.nextUrl.pathname;

  // // Lấy origin từ headers
  // const origin = 
  //   request.headers.get("origin") ||
  //   request.headers.get("referer")?.split("/").slice(0, 3).join("/") || // fallback từ referer
  //   `https://${request.headers.get("host")}`; // fallback nếu không có origin

  // console.log("🧭 Origin:", origin);
  // const origin2 =  request.headers.get("origin");
  // console.log("ORI2",origin2)

  // // Tạo một response cho request tiếp theo
  // const res = NextResponse.next();


  //   // Clear any existing CORS headers that might have been set

  // res.headers.delete("Access-Control-Allow-Origin");
  // res.headers.delete("Access-Control-Allow-Credentials");
  // res.headers.delete("Access-Control-Allow-Methods");
  // res.headers.delete("Access-Control-Allow-Headers");


  // if (origin && allowedOrigins.includes(origin)) {
  //   res.headers.set("Access-Control-Allow-Origin", origin);
  //   res.headers.set("Access-Control-Allow-Credentials", "true");
  // } else {
  //   res.headers.set("Access-Control-Allow-Origin", "*");
  // }
  
  // res.headers.set("Access-Control-Allow-Methods", "GET, DELETE, PATCH, POST, PUT");
  // res.headers.set(
  //   "Access-Control-Allow-Headers",
  //   "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  // );
  if (publicPaths.some((publicPath) => pathname.startsWith(publicPath))) {
    return res;
  }

  // Nếu chưa có token, redirect về login
  if (!token) {
    return NextResponse.redirect(
      new URL("/login", `${request.nextUrl.protocol}//${request.headers.get("host")}`)
    );
  }

  try {
    // Kiểm tra tính hợp lệ của token
    let isValidToken = await jwtVerify(token, JWT_SECRET);
    if (!isValidToken) {
      // Nếu token không hợp lệ, redirect về login
      return NextResponse.redirect(
        new URL("/login", `${request.nextUrl.protocol}//${request.headers.get("host")}`)
      );
    }

    // Nếu token hợp lệ, tiếp tục request
    return res;
  } catch (error) {
    console.error("🔴 Lỗi khi xác thực token:", error);
    return NextResponse.redirect(
      new URL("/login", `${request.nextUrl.protocol}//${request.headers.get("host")}`)
    );
  }
}

// Cấu hình để middleware áp dụng cho các API routes, ngoại trừ _next/static, _next/image, favicon.ico
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"], // Đảm bảo không áp dụng middleware cho các file static
};
