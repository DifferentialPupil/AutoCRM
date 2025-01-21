import { NextResponse } from "next/server";
import { supabase } from '@/lib/supabase';
import { EmailOtpType, VerifyTokenHashParams } from "@supabase/supabase-js";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const token = requestUrl.searchParams.get("token");
  const type = requestUrl.searchParams.get("type");

  // If no token provided, redirect to login
  if (!token || !type) {
    return NextResponse.redirect(new URL("/login", requestUrl.origin));
  }

  try {
    // Create a response to handle cookies
    const response = NextResponse.redirect(new URL("/dashboard", requestUrl.origin));
    
    // Verify the token
    const { data: { session }, error } = await supabase.auth.verifyOtp({
      token_hash: token,
      type: type as EmailOtpType
    } as VerifyTokenHashParams);
    
    if (error) {
      console.error("Auth error:", error.message);
      return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent(error.message)}`, requestUrl.origin));
    }

    if (session) {
      // Set the auth cookie
      response.cookies.set('sb-auth-token', session.access_token, {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7 // 1 week
      });
    }

    return response;
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.redirect(new URL("/login?error=An unexpected error occurred", requestUrl.origin));
  }
} 