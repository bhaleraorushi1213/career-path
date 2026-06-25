import { NextRequest, NextResponse } from "next/server";
import { getSession } from "./lib/auth/auth";

export default async function proxy(request: NextRequest) {
	const session = await getSession();

	const isLandingPage = request.nextUrl.pathname === "/";
	if (isLandingPage && session?.user) {
		return NextResponse.redirect(new URL("/dashboard", request.url));
	}

  const isDashboardPage = request.nextUrl.pathname.startsWith("/dashboard");
	if (isDashboardPage && !session?.user) {
		return NextResponse.redirect(new URL("/login", request.url));
	}

  const isLoginPage = request.nextUrl.pathname.startsWith("/login");
  const isSignUpPage = request.nextUrl.pathname.startsWith("/signup");

	if ((isLoginPage || isSignUpPage) && session?.user) {
		return NextResponse.redirect(new URL("/dashboard", request.url));
	}
	
  return NextResponse.next();
}
