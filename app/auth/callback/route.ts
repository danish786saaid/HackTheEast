import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const { searchParams } = url;
  const code = searchParams.get("code");
  const errorCode = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");
  const next = searchParams.get("next") ?? "/dashboard";
  const origin = request.headers.get("origin") || url.origin;

  if (errorCode) {
    const errorUrl = new URL("/onboarding/login", origin);
    errorUrl.searchParams.set("error", errorDescription || errorCode);
    return NextResponse.redirect(errorUrl);
  }

  if (code) {
    const supabase = await createClient();
    if (!supabase) {
      return NextResponse.redirect(`${origin}/onboarding/login?error=Supabase+not+configured`);
    }
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      return NextResponse.redirect(
        `${origin}/onboarding/login?error=${encodeURIComponent(error.message)}`
      );
    }
    const redirectTo = next.startsWith("/") ? next : "/";
    return NextResponse.redirect(`${origin}${redirectTo}`);
  }

  return NextResponse.redirect(`${origin}/onboarding/login?error=No+auth+code`);
}
