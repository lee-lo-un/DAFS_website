"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { createSupabaseClient } from "@/utils/supabase/client";

export default function AdminAuthCheck({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    const checkAdminAccess = async () => {
      let debug = "관리자 권한 확인 시작...\n";
      console.log("----- 관리자 권한 디버깅 시작 -----");
      try {
        setIsLoading(true);
        setError(null);

        debug += "Supabase 클라이언트 초기화 중...\n";
        console.log("1. Supabase 클라이언트 초기화 중...");
        const supabase = createSupabaseClient();
        if (!supabase) {
          debug += "❌ Supabase 클라이언트 초기화 실패\n";
          console.error("❌ 1-X. Supabase 클라이언트 초기화 실패");
          setError("Supabase 클라이언트 초기화에 실패했습니다");
          setDebugInfo(debug);
          setIsLoading(false);
          return;
        }
        debug += "✅ Supabase 클라이언트 초기화 성공\n";
        console.log("✅ 1-O. Supabase 클라이언트 초기화 성공");

        // 세션 확인
        debug += "세션 확인 중...\n";
        console.log("2. 세션 확인 중...");
        const { data: sessionData, error: sessionError } =
          await supabase.auth.getSession();

        console.log("2-1. 세션 데이터:", sessionData);

        if (sessionError) {
          debug += `❌ 세션 오류: ${sessionError.message}\n`;
          console.error("❌ 2-X. 세션 오류:", sessionError);
          setError("세션 확인 중 오류가 발생했습니다");
          setDebugInfo(debug);
          setIsLoading(false);
          return;
        }

        if (!sessionData?.session) {
          debug += "❌ 세션 없음 - 로그인 필요\n";
          console.log("❌ 2-X. 세션 없음 - 로그인 필요");
          setError("로그인이 필요합니다");
          setDebugInfo(debug);
          setIsLoading(false);
          return;
        }

        const userId = sessionData.session.user.id;
        console.log("✅ 2-O. 세션 확인 성공:", {
          userId,
          email: sessionData.session.user.email,
        });

        debug += `✅ 세션 확인 성공: ${userId}\n`;

        // 관리자 권한 확인
        debug += "관리자 권한 확인 중...\n";
        console.log("3. 관리자 권한 확인 중...");

        try {
          // profiles 테이블 체크
          console.log("3-1. profiles 테이블 확인");
          const { data: allProfiles, error: tableError } = await supabase
            .from("profiles")
            .select("*")
            .limit(1);
          if (tableError) {
            console.error("❌ 3-X. profiles 테이블 없음:", tableError);
          } else {
            console.log("✅ 3-O. profiles 테이블 확인 성공:", {
              sampleProfile: allProfiles[0],
            });
          }
        } catch (tableCheckError) {
          console.error("❌ 3-X. 테이블 확인 중 오류:", tableCheckError);
        }

        // 현재 사용자 프로필 조회
        console.log("3-2. 현재 사용자 프로필 조회 시도");
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("*") // is_admin 값만이 아닌 전체 프로필 정보
          .eq("id", userId)
          .single();

        if (profileError) {
          debug += `❌ 프로필 조회 오류: ${profileError.message}\n`;
          console.error("❌ 3-X. 프로필 조회 오류:", {
            error: profileError,
            code: profileError.code,
            userId,
          });

          // 추가 오류 진단
          if (profileError.code === "PGRST116") {
            // 데이터 없음
            debug += "❌ 사용자 프로필이 존재하지 않습니다\n";
            console.log("❌ 3-X. 사용자 프로필이 존재하지 않음");
          }

          setError("프로필 정보를 가져오는 중 오류가 발생했습니다");
          setDebugInfo(debug);
          setIsLoading(false);
          return;
        }

        debug += `프로필 조회 결과: ${JSON.stringify(profile)}\n`;
        console.log("✅ 3-O. 프로필 조회 결과:", profile);
        console.log(`현재 is_admin 값: ${profile?.is_admin}`);

        if (!profile?.is_admin) {
          debug += "❌ 관리자 권한 없음\n";
          console.log("❌ 3-X. 관리자 권한 없음 (is_admin=false)");
          setError("관리자 권한이 없습니다");
          setDebugInfo(debug);
          setIsLoading(false);
          return;
        }

        // 관리자 권한 확인 성공
        debug += "✅ 관리자 권한 확인 성공 (is_admin=true)\n";
        console.log("✅ 3-O. 관리자 권한 확인 성공 (is_admin=true)");
        setIsAdmin(true);
        setDebugInfo(debug);
        setIsLoading(false);
      } catch (error: any) {
        debug += `❌ 예외 발생: ${error?.message || "알 수 없는 오류"}\n`;
        console.error("Admin 페이지 접근 확인 중 오류:", error);
        setError("관리자 페이지 접근 확인 중 오류가 발생했습니다");
        setDebugInfo(debug);
        setIsLoading(false);
      }
    };

    checkAdminAccess();
  }, []);

  // 로딩 중이면 로딩 표시
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px]">
        <Loader2 className="h-8 w-8 animate-spin mb-4" />
        <p>관리자 권한을 확인하는 중입니다...</p>
      </div>
    );
  }

  // 오류가 있으면 오류 메시지 표시
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px]">
        <div className="bg-red-50 text-red-800 p-4 rounded-md mb-4 max-w-lg w-full">
          <p className="font-medium">오류 발생</p>
          <p>{error}</p>

          {/* 디버그 정보 표시 */}
          <details className="mt-4">
            <summary className="cursor-pointer font-medium">
              디버그 정보
            </summary>
            <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto max-h-[300px]">
              {debugInfo}
            </pre>
          </details>

          <div className="mt-4 flex gap-2">
            <Link
              href="/login"
              className="text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
            >
              로그인 페이지로 이동
            </Link>
            <button
              onClick={() => window.location.reload()}
              className="text-blue-600 border border-blue-600 px-4 py-2 rounded hover:bg-blue-50"
            >
              새로고침
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 관리자가 아니면 접근 거부 메시지 표시
  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px]">
        <div className="bg-yellow-50 text-yellow-800 p-4 rounded-md mb-4 max-w-lg w-full">
          <p className="font-medium">접근 거부</p>
          <p>관리자 권한이 필요한 페이지입니다.</p>

          {/* 디버그 정보 표시 */}
          <details className="mt-4">
            <summary className="cursor-pointer font-medium">
              디버그 정보
            </summary>
            <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto max-h-[300px]">
              {debugInfo}
            </pre>
          </details>

          <div className="mt-4">
            <Link
              href="/"
              className="text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
            >
              홈페이지로 돌아가기
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 관리자인 경우 자식 컴포넌트 렌더링
  return <>{children}</>;
}
