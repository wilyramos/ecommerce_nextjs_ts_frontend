// middleware.ts
import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
    const token = request.cookies.get("ecommerce-token")?.value;

    if (!token) {
        return NextResponse.redirect(new URL("/auth/login", request.url));
    }

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-auth-token", token);

    return NextResponse.next({
        request: { headers: requestHeaders },
    });
}

export const config = {
    matcher: ["/admin/:path*", "/pos/:path*", "/profile/:path*"],
};