// import { NextResponse } from "next/server";
// import { NextRequest } from "next/server";
// import * as jose from "jose";

// export async function proxy(request: NextRequest) {
//   const response = NextResponse.next();
//   const path = request.nextUrl.pathname;

//   response.headers.set("Access-Control-Allow-Origin", "https://docs-rho-wine.vercel.app");
//   response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
//   response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

//   // Define protected routes
//   const isProtectedRoute = path.startsWith("/admin") && !path.includes("/admin/login");

//   if (isProtectedRoute) {
//     const token = request.cookies.get("adminToken")?.value || "";

//     if (!token) {
//       return NextResponse.redirect(new URL("/admin/login", request.url));
//     }

//     try {
//       const secret = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key");
//       await jose.jwtVerify(token, secret);
//       return NextResponse.next();
//     } catch (error) {
//       console.log(error);
//       return NextResponse.redirect(new URL("/admin/login", request.url));
//     }
//   }

//   return response;
// }

// export const config = {
//   matcher: ["/api/:path*", "/admin/:path*"],
// };

import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import * as jose from "jose";

function generateNonce() {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return btoa(String.fromCharCode(...array));
}

function applySecurityHeaders(response: NextResponse, nonce: string) {
  const csp = `
default-src 'self';
script-src 'self' 'nonce-${nonce}' https://www.google.com https://www.gstatic.com https://cdn.tiny.cloud;
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.tiny.cloud;
img-src 'self' data: blob: https:;
font-src 'self' https://fonts.gstatic.com https://cdn.tiny.cloud;
connect-src 'self' https://www.google.com https://cdn.tiny.cloud https://api.resend.com;
frame-src 'self' https://www.google.com;
media-src 'self' https://dl.dropboxusercontent.com blob:;
object-src 'none';
base-uri 'self';
form-action 'self';
frame-ancestors 'self';
upgrade-insecure-requests;
`.replace(/\n/g, "");

  response.headers.set("Content-Security-Policy", csp);
  response.headers.set("x-nonce", nonce);

  // your existing CORS
  response.headers.set(
    "Access-Control-Allow-Origin",
    "https://docs-rho-wine.vercel.app",
  );
  response.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS",
  );
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization",
  );

  return response;
}

export async function proxy(request: NextRequest) {
  const nonce = generateNonce();
  const path = request.nextUrl.pathname;

  let response = NextResponse.next();

  // ---------- AUTH ----------
  const isProtectedRoute =
    path.startsWith("/admin") && !path.includes("/admin/login");

  if (isProtectedRoute) {
    const token = request.cookies.get("adminToken")?.value || "";

    if (!token) {
      response = NextResponse.redirect(new URL("/admin/login", request.url));
      return applySecurityHeaders(response, nonce);
    }

    try {
      const secret = new TextEncoder().encode(
        process.env.JWT_SECRET || "your-secret-key",
      );
      await jose.jwtVerify(token, secret);
    } catch {
      response = NextResponse.redirect(new URL("/admin/login", request.url));
      return applySecurityHeaders(response, nonce);
    }
  }

  return applySecurityHeaders(response, nonce);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
