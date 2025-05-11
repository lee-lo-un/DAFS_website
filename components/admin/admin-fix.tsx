"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertCircle, Check } from "lucide-react";
import { createSupabaseClient } from "@/utils/supabase/client";

export default function AdminFix() {
  const [isLoading, setIsLoading] = useState(true);
  const [status, setStatus] = useState<"checking" | "fixed" | "error">("checking");
  const [debug, setDebug] = useState<string>("");
  const [userId, setUserId] = useState<string | null>(null);
  
  useEffect(() => {
    const fixAdminAccess = async () => {
      try {
        setIsLoading(true);
        let debugLog = "관리자 권한 문제 진단 시작...\n";
        
        // Supabase 클라이언트 초기화
        debugLog += "Supabase 클라이언트 생성 중...\n";
        const supabase = createSupabaseClient();
        if (!supabase) {
          throw new Error("Supabase 클라이언트 초기화 실패");
        }
        debugLog += "✅ Supabase 클라이언트 생성 성공\n";
        
        // 현재 로그인한 사용자 확인
        debugLog += "현재 로그인한 사용자 확인 중...\n";
        const { data: userData, error: userError } = await supabase.auth.getUser();
        
        if (userError) {
          debugLog += `❌ 사용자 정보 가져오기 실패: ${userError.message}\n`;
          throw new Error(`사용자 정보 가져오기 실패: ${userError.message}`);
        }
        
        if (!userData?.user) {
          debugLog += "❌ 로그인된 사용자 없음\n";
          throw new Error("로그인된 사용자가 없습니다");
        }
        
        const currentUserId = userData.user.id;
        setUserId(currentUserId);
        debugLog += `✅ 현재 사용자 ID: ${currentUserId}\n`;
        debugLog += `✅ 현재 사용자 이메일: ${userData.user.email}\n`;
        
        // 프로필 정보 조회
        debugLog += "프로필 정보 조회 중...\n";
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", currentUserId)
          .single();
        
        if (profileError) {
          debugLog += `❌ 프로필 조회 실패: ${profileError.message}\n`;
          
          // 프로필이 없는 경우 생성
          if (profileError.code === "PGRST116") { // 데이터 없음 오류
            debugLog += "프로필이 없어 새로 생성 시도 중...\n";
            
            const { data: newProfile, error: createError } = await supabase
              .from("profiles")
              .insert([{ 
                id: currentUserId,
                email: userData.user.email,
                is_admin: true 
              }])
              .select();
              
            if (createError) {
              debugLog += `❌ 프로필 생성 실패: ${createError.message}\n`;
              throw new Error(`프로필 생성 실패: ${createError.message}`);
            }
            
            debugLog += "✅ 프로필 생성 및 관리자 권한 부여 성공\n";
            setStatus("fixed");
            setDebug(debugLog);
            setIsLoading(false);
            return;
          } else {
            throw new Error(`프로필 조회 실패: ${profileError.message}`);
          }
        }
        
        debugLog += `현재 is_admin 값: ${profile.is_admin}\n`;
        
        // 관리자 권한 확인
        if (!profile.is_admin) {
          debugLog += "❌ 관리자 권한이 없음 (is_admin=false)\n";
          debugLog += "❌ Supabase 관리자가 직접 권한을 부여해야 합니다\n";
          throw new Error("관리자 권한이 없습니다. Supabase의 profiles 테이블에서 가입한 사용자의 is_admin 값을 true로 변경해야 합니다.");
        } else {
          debugLog += "✅ 이미 관리자 권한이 있음 (is_admin=true)\n";
        }
        
        // 쿠키 재설정 및 세션 갱신
        debugLog += "세션 갱신 중...\n";
        const { error: refreshError } = await supabase.auth.refreshSession();
        
        if (refreshError) {
          debugLog += `❌ 세션 갱신 실패: ${refreshError.message}\n`;
          throw new Error(`세션 갱신 실패: ${refreshError.message}`);
        }
        
        debugLog += "✅ 세션 갱신 성공\n";
        debugLog += "✅ 관리자 권한 확인 및 수정 완료\n";
        
        setStatus("fixed");
        setDebug(debugLog);
        setIsLoading(false);
        
      } catch (error: any) {
        console.error("관리자 권한 수정 오류:", error);
        setStatus("error");
        setDebug(prev => prev + `❌ 오류 발생: ${error.message || "알 수 없는 오류"}\n`);
        setIsLoading(false);
      }
    };
    
    fixAdminAccess();
  }, []);
  
  return (
    <div className="space-y-4 p-4 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold">관리자 권한 문제 해결</h2>
      
      {isLoading ? (
        <div className="flex items-center space-x-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>관리자 권한 확인 및 수정 중...</span>
        </div>
      ) : status === "fixed" ? (
        <Alert className="bg-green-50 border-green-200">
          <Check className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            <p className="font-medium">관리자 권한이 정상적으로 설정되었습니다.</p>
            <p className="mt-2">이제 관리자 페이지에 접근할 수 있습니다.</p>
            <div className="mt-4 space-x-2">
              <Button 
                onClick={() => window.location.href = "/admin"}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                관리자 페이지로 이동
              </Button>
              <Button 
                className="border border-gray-300 bg-white hover:bg-gray-50" 
                onClick={() => window.location.reload()}
              >
                페이지 새로고침
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      ) : (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <p className="font-medium">관리자 권한 설정 중 오류가 발생했습니다.</p>
            <p className="mt-2">아래 디버그 정보를 확인하고 다시 시도해 주세요.</p>
            <div className="mt-4 space-x-2">
              <Button 
                className="border border-gray-300 bg-white hover:bg-gray-50" 
                onClick={() => window.location.reload()}
              >
                다시 시도
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}
      
      <div className="mt-6">
        <details>
          <summary className="cursor-pointer font-medium">디버그 정보</summary>
          <pre className="mt-2 p-4 bg-gray-100 rounded-md overflow-auto text-xs whitespace-pre-wrap">{debug}</pre>
        </details>
      </div>
    </div>
  );
}
