"use client";

/**
 * 이 파일은 관리자 권한 체크를 우회하기 위한 임시 페이지입니다.
 * 관리자 권한 문제 해결 후 삭제하세요.
 */

import { useEffect, useState } from "react";
import { createSupabaseClient } from "@/utils/supabase/client";
import Link from "next/link";
import { Loader2 } from "lucide-react";

export default function NoCheck() {
  const [isLoading, setIsLoading] = useState(true);
  const [debug, setDebug] = useState<any>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkSession = async () => {
      try {
        // Supabase 클라이언트 생성
        const supabase = createSupabaseClient();
        if (!supabase) {
          setError("Supabase 클라이언트 초기화 실패");
          setIsLoading(false);
          return;
        }

        // 세션 확인
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) {
          setError(`세션 오류: ${sessionError.message}`);
          setIsLoading(false);
          return;
        }

        if (!sessionData?.session) {
          setError("로그인이 필요합니다");
          setIsLoading(false);
          return;
        }

        // 프로필 확인
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", sessionData.session.user.id)
          .single();

        // 디버그 정보 저장
        setDebug({
          sessionData,
          profile,
          profileError
        });

        setIsLoading(false);
      } catch (error: any) {
        setError(`오류 발생: ${error.message || "알 수 없는 오류"}`);
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px]">
        <Loader2 className="h-8 w-8 animate-spin mb-4" />
        <p>사용자 정보 확인 중...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">관리자 접근 디버깅 페이지</h1>
        <p className="text-gray-600">현재 관리자 권한 확인 없이 접근 가능한 페이지입니다.</p>
        
        {error && (
          <div className="bg-red-50 text-red-800 p-4 rounded-md my-4">
            <p className="font-bold">오류 발생</p>
            <p>{error}</p>
          </div>
        )}

        <div className="mt-8 space-y-4">
          <section>
            <h2 className="text-xl font-bold mb-2">디버그 정보</h2>
            <pre className="bg-gray-100 p-4 rounded-md overflow-auto max-h-[300px] text-xs">
              {JSON.stringify(debug, null, 2)}
            </pre>
          </section>

          <section className="mt-8">
            <h2 className="text-xl font-bold mb-4">관리자 메뉴</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link 
                href="/admin/users" 
                className="block bg-blue-100 hover:bg-blue-200 transition p-4 rounded-md"
              >
                사용자 관리
              </Link>
              <Link 
                href="/admin/blog" 
                className="block bg-green-100 hover:bg-green-200 transition p-4 rounded-md"
              >
                블로그 관리
              </Link>
              <Link 
                href="/admin/reviews" 
                className="block bg-purple-100 hover:bg-purple-200 transition p-4 rounded-md"
              >
                리뷰 관리
              </Link>
              <Link 
                href="/admin/questions" 
                className="block bg-yellow-100 hover:bg-yellow-200 transition p-4 rounded-md"
              >
                질문 관리
              </Link>
              <Link 
                href="/admin/categories" 
                className="block bg-indigo-100 hover:bg-indigo-200 transition p-4 rounded-md"
              >
                카테고리 관리
              </Link>
              <Link 
                href="/admin/notices" 
                className="block bg-red-100 hover:bg-red-200 transition p-4 rounded-md"
              >
                공지사항 관리
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
