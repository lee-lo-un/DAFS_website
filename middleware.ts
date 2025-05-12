import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(request: NextRequest) {
  try {
    // 응답 객체 생성
    const response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    });

    // Supabase 클라이언트 생성
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value;
          },
          set(name: string, value: string, options: any) {
            // 쿠키 설정 시 response 객체에 쿠키 추가
            response.cookies.set({
              name,
              value,
              ...options,
            });
          },
          remove(name: string, options: any) {
            // 쿠키 제거 시 response 객체에서 쿠키 제거
            response.cookies.set({
              name,
              value: "",
              ...options,
            });
          },
        },
      }
    );

    // 세션 새로고침
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError) {
      console.error("Middleware session error:", sessionError);
      // 세션 오류 발생 시 로그인 페이지로 리디렉션하지 않고 계속 진행
      // 이렇게 하면 세션 오류가 발생해도 페이지 접근은 가능
    }

    // 관리자 페이지 접근 제한 - 미들웨어에서는 세션 확인만 하고 관리자 권한은 클라이언트에서 확인
    const isAdminPage = request.nextUrl.pathname.startsWith("/admin");

    if (isAdminPage) {
      // 우회 경로 체크 - 디버깅 목적으로 추가한 코드
      const bypassPaths = ["/admin/no-check", "/admin/bypass", "/admin-fix"];
      const currentPath = request.nextUrl.pathname;

      if (bypassPaths.includes(currentPath)) {
        console.log(`Middleware: ${currentPath} 경로는 세션 체크 우회됨`);
        return response;
      }

      console.log("Middleware: 관리자 페이지 접근 시도", {
        hasSession: !!session,
        url: request.nextUrl.pathname,
      });

      // 임시 조치: 세션 확인을 건너뛰고 접근 허용
      console.log("Middleware: 임시로 세션 확인 건너뛰기");
      return response;
      
      /* 원래 코드 - 임시로 비활성화
      if (!session) {
        console.log("Middleware: 관리자 페이지 접근 시도 - 세션 없음");
        // 세션이 없으면 로그인 페이지로 리디렉션
        const redirectUrl = new URL("/login", request.url);
        redirectUrl.searchParams.set("callbackUrl", request.nextUrl.pathname);
        return NextResponse.redirect(redirectUrl);
      }
      */

      // 세션이 있으면 접근 허용 (관리자 권한은 클라이언트에서 확인)
      console.log("Middleware: 세션 확인 완료, 접근 허용");
    }

    // 세션 쿠키를 응답에 포함시켜 반환
    return response;
  } catch (error) {
    console.error("Middleware error:", error);
    // 오류가 발생하면 기본 응답 반환
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    /*
     * 다음으로 시작하는 모든 요청 경로를 제외합니다:
     * - _next/static (정적 파일)
     * - _next/image (이미지 최적화 파일)
     * - favicon.ico (파비콘 파일)
     * - 이미지 파일 (.svg, .png, .jpg, .jpeg, .gif, .webp)
     * - auth/v1 경로 (Supabase 인증 관련 경로)
     * - admin-direct 경로 (관리자 디버그 페이지)
     */
    "/((?!_next/static|_next/image|favicon.ico|auth/v1|admin-direct|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
