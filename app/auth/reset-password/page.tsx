"use client";

import { useState, useEffect } from "react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import Link from "next/link";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const supabase = createSupabaseClient();

  // 비밀번호 재설정 처리
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 입력값 검증
    if (password.length < 6) {
      setError("비밀번호는 최소 6자 이상이어야 합니다.");
      return;
    }
    
    if (password !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }
    
    setError(null);
    setIsLoading(true);
    
    if (!supabase) {
      setError("인증 서비스에 연결할 수 없습니다.");
      setIsLoading(false);
      return;
    }
    
    try {
      const { error } = await supabase.auth.updateUser({
        password,
      });
      
      if (error) {
        throw error;
      }
      
      setSuccess(true);
      toast({
        title: "비밀번호 변경 완료",
        description: "비밀번호가 성공적으로 변경되었습니다.",
      });
      
      // 3초 후 로그인 페이지로 이동
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (error: any) {
      console.error("비밀번호 재설정 오류:", error);
      setError(error.message || "비밀번호 변경 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-24 px-4 md:px-8">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>비밀번호 재설정</CardTitle>
            <CardDescription>
              새로운 비밀번호를 입력하여 계정 비밀번호를 재설정하세요.
            </CardDescription>
          </CardHeader>
          
          {success ? (
            <CardContent className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-800">
                <p className="font-medium">비밀번호가 성공적으로 변경되었습니다.</p>
                <p className="text-sm mt-2">잠시 후 로그인 페이지로 이동합니다...</p>
              </div>
              <Button
                className="w-full"
                onClick={() => router.push("/login")}
              >
                로그인 페이지로 이동
              </Button>
            </CardContent>
          ) : (
            <form onSubmit={handleResetPassword}>
              <CardContent className="space-y-4">
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
                    <p>{error}</p>
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="password">새 비밀번호</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">비밀번호 확인</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
              </CardContent>
              
              <CardFooter className="flex flex-col space-y-4">
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 처리 중...
                    </>
                  ) : (
                    "비밀번호 변경"
                  )}
                </Button>
                
                <div className="text-center text-sm">
                  <Link href="/login" className="text-amber-600 hover:text-amber-700">
                    로그인 페이지로 돌아가기
                  </Link>
                </div>
              </CardFooter>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
}
