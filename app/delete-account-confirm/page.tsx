"use client";

import { useEffect, useState } from "react";
import { createSupabaseClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";

export default function DeleteAccountConfirmPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();
  const supabase = createSupabaseClient();

  useEffect(() => {
    // 현재 세션 확인
    const checkSession = async () => {
      if (!supabase) return;
      
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          setError(error.message);
          return;
        }
        
        if (!data.session) {
          setError("세션이 만료되었습니다. 다시 로그인해주세요.");
          return;
        }
        
        setUser(data.session.user);
      } catch (err: any) {
        setError(err.message || "세션 확인 중 오류가 발생했습니다.");
      }
    };
    
    checkSession();
  }, [supabase]);

  const handleDeleteAccount = async () => {
    if (!supabase || !user) return;
    
    setIsLoading(true);
    
    try {
      // 사용자 ID 확인
      console.log('삭제할 사용자 ID:', user.id);
      
      // 프로필 조회 테스트
      const { data: profileData, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (fetchError) {
        console.error('프로필 조회 실패:', fetchError);
      } else {
        console.log('삭제할 프로필 데이터:', profileData);
      }
      
      // 기본 방식으로 프로필 데이터 삭제
      console.log('프로필 삭제 시도 - ID:', user.id);
      
      const { error: deleteError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', user.id);
      
      if (deleteError) {
        console.error('프로필 삭제 실패:', deleteError);
        throw deleteError;
      }
      
      console.log('프로필 삭제 요청 완료!');
      
      console.log('프로필 삭제 요청 완료!');
      
      // 사용자 데이터 업데이트
      const { error: updateError } = await supabase.auth.updateUser({
        data: { profile_deleted: true, deleted_at: new Date().toISOString() }
      });
      
      if (updateError) {
        console.warn('사용자 데이터 업데이트 실패:', updateError);
      } else {
        console.log('사용자 데이터 업데이트 성공!');
      }
      
      // 로그아웃 처리
      await supabase.auth.signOut();
      
      toast({
        title: "회원탈퇴 완료",
        description: "계정이 성공적으로 삭제되었습니다.",
      });
      
      // 홈페이지로 리디렉션
      router.push("/");
    } catch (error: any) {
      console.error('회원탈퇴 처리 중 오류:', error);
      toast({
        title: "회원탈퇴 실패",
        description: error.message || "계정 삭제 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!supabase) {
    return (
      <div className="container mx-auto py-24 px-4 md:px-8 text-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
          <h2 className="text-xl font-semibold mb-4 text-red-700">오류가 발생했습니다</h2>
          <p className="mb-6 text-gray-700">Supabase 클라이언트를 초기화할 수 없습니다.</p>
          <Link href="/" className="bg-amber-500 hover:bg-amber-600 text-white py-2 px-4 rounded-md transition-colors">
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-24 px-4 md:px-8 text-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
          <h2 className="text-xl font-semibold mb-4 text-red-700">오류가 발생했습니다</h2>
          <p className="mb-6 text-gray-700">{error}</p>
          <Link href="/login" className="bg-amber-500 hover:bg-amber-600 text-white py-2 px-4 rounded-md transition-colors">
            로그인 페이지로 이동
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-24 px-4 md:px-8">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>회원탈퇴 확인</CardTitle>
            <CardDescription>
              계정을 삭제하면 모든 개인 정보와 데이터가 영구적으로 삭제됩니다.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-destructive font-semibold mb-4">
              이 작업은 되돌릴 수 없습니다. 정말로 계정을 삭제하시겠습니까?
            </p>
            <p className="text-sm text-muted-foreground mb-2">
              삭제될 계정 이메일: {user?.email}
            </p>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button
              variant="destructive"
              className="w-full"
              onClick={handleDeleteAccount}
              disabled={isLoading}
            >
              {isLoading ? "처리 중..." : "계정 영구 삭제"}
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => router.push("/profile")}
              disabled={isLoading}
            >
              취소하고 프로필로 돌아가기
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}