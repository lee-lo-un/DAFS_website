import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  // 디버깅 로그
  console.log("Auth 콜백 호출됨, 코드 존재:", !!code);

  if (code) {
    try {
      // 쿠키 객체 생성
      const cookieStore = cookies();

      // Supabase 클라이언트 생성
      const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

      // 코드 교환
      const { error } = await supabase.auth.exchangeCodeForSession(code);

      if (error) {
        console.error("코드 교환 오류:", error.message);
        return NextResponse.redirect(
          `${requestUrl.origin}/login?error=${encodeURIComponent(
            error.message
          )}`
        );
      }

      console.log("코드 교환 성공, 세션 설정됨");
    } catch (error: any) {
      console.error("콜백 처리 오류:", error.message);
      return NextResponse.redirect(
        `${requestUrl.origin}/login?error=${encodeURIComponent(
          error.message || "알 수 없는 오류"
        )}`
      );
    }
  }

  // 홈페이지로 리디렉션
  return NextResponse.redirect(requestUrl.origin);
}
