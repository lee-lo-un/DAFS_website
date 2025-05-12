"use client";

import type React from "react";

import { useState } from "react";
import type { User } from "@supabase/supabase-js";
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
import { createSupabaseClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface ProfileClientProps {
  user: User;
  profile: any | null;
  profileError?: string;
}

export default function ProfileClient({
  user,
  profile,
  profileError,
}: ProfileClientProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [fullName, setFullName] = useState(profile?.full_name || "");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const supabase = createSupabaseClient();
  
  if (!supabase) {
    return (
      <div className="p-4 bg-destructive/10 text-destructive rounded-md">
        <p>Supabase 클라이언트를 초기화할 수 없습니다. 나중에 다시 시도해주세요.</p>
      </div>
    );
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.from("profiles").upsert({
        id: user.id,
        full_name: fullName,
        updated_at: new Date().toISOString(),
      });

      if (error) throw error;

      toast({
        title: "프로필 업데이트 성공",
        description: "프로필 정보가 성공적으로 업데이트되었습니다.",
      });

      router.refresh();
    } catch (error: any) {
      toast({
        title: "프로필 업데이트 실패",
        description: error.message || "프로필 업데이트 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signOut();

      if (error) throw error;

      toast({
        title: "로그아웃 성공",
        description: "성공적으로 로그아웃되었습니다.",
      });

      router.push("/");
      router.refresh();
    } catch (error: any) {
      toast({
        title: "로그아웃 실패",
        description: error.message || "로그아웃 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // 회원탈퇴 처리 함수
  const handleDeleteAccount = async () => {
    setIsLoading(true);
    
    try {
      // 이메일 가입자인지 확인
      const isEmailUser = !user.app_metadata?.provider;
      
      // 1. 프로필 데이터 삭제
      const { error: profileError } = await supabase
        .from("profiles")
        .delete()
        .eq("id", user.id);
      
      if (profileError) {
        throw profileError;
      }
      
      // 2. 이메일 가입자의 경우 계정 삭제 처리
      if (isEmailUser) {
        // 비밀번호 재설정 이메일 전송 (사용자가 직접 삭제할 수 있도록)
        const { error: resetError } = await supabase.auth.resetPasswordForEmail(user.email || '', {
          redirectTo: `${window.location.origin}/delete-account-confirm`,
        });
        
        if (resetError) {
          console.warn('비밀번호 재설정 이메일 전송 오류:', resetError);
          throw resetError;
        }
        
        toast({
          title: "회원탈퇴 이메일 발송",
          description: "회원탈퇴를 완료하기 위한 이메일이 발송되었습니다. 이메일을 확인해주세요.",
        });
      }
      
      // 로그아웃 처리
      await supabase.auth.signOut();
      
      // 홈페이지로 리디렉션
      router.push("/");
      router.refresh();
    } catch (error: any) {
      toast({
        title: "회원탈퇴 처리 실패",
        description: error.message || "계정 삭제 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setDeleteDialogOpen(false);
    }
  };

  // Display user's email or provider-specific information
  const userIdentifier =
    user.email ||
    (user.app_metadata?.provider
      ? `${user.app_metadata.provider} 계정`
      : "사용자");

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-24 px-4 md:px-8 relative overflow-hidden">
        {/* 배경 효과 */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-background" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full -translate-y-1/3 translate-x-1/3 blur-3xl" />

        <div className="container-width relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">내 프로필</h1>
            <p className="text-xl text-foreground/70 mb-8">
              계정 정보를 관리하고 프로필을 업데이트하세요
            </p>
          </div>
        </div>
      </section>

      {/* Profile Section */}
      <section className="py-16 px-4 md:px-8 relative">
        <div className="container-width relative z-10">
          <div className="max-w-md mx-auto">
            {profileError && (
              <div className="mb-6 p-4 bg-destructive/10 text-destructive rounded-md">
                <p>
                  프로필 정보를 불러오는 중 오류가 발생했습니다: {profileError}
                </p>
              </div>
            )}

            <Card>
              <CardHeader className="flex flex-col items-center">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage src={user.user_metadata?.avatar_url || ""} />
                  <AvatarFallback className="text-2xl">
                    {fullName
                      ? fullName.charAt(0).toUpperCase()
                      : userIdentifier.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <CardTitle>{fullName || userIdentifier}</CardTitle>
                <CardDescription>{userIdentifier}</CardDescription>
              </CardHeader>
              <form onSubmit={handleUpdateProfile}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">이름</Label>
                    <Input
                      id="fullName"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="이름을 입력하세요"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>이메일</Label>
                    <Input value={user.email || ""} disabled />
                    <p className="text-xs text-muted-foreground">
                      이메일은 변경할 수 없습니다.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label>로그인 방식</Label>
                    <Input
                      value={user.app_metadata?.provider || "이메일/비밀번호"}
                      disabled
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "저장 중..." : "프로필 저장"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={handleSignOut}
                    disabled={isLoading}
                  >
                    {isLoading ? "처리 중..." : "로그아웃"}
                  </Button>
                  
                  <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                    <AlertDialogTrigger asChild>
                      <Button
                        type="button"
                        variant="destructive"
                        className="w-full mt-4"
                        disabled={isLoading}
                      >
                        {isLoading ? "처리 중..." : "회원탈퇴"}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>회원탈퇴를 진행하시겠습니까?</AlertDialogTitle>
                        <AlertDialogDescription>
                          회원탈퇴를 진행하면 모든 개인 정보가 삭제되며 이 작업은 취소할 수 없습니다.
                          이메일 회원의 경우 이메일로 출력되는 회원탈퇴 링크를 클릭해야 탈퇴가 완료됩니다.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>취소</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteAccount} className="bg-destructive hover:bg-destructive/90">
                          회원탈퇴 확인
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </CardFooter>
              </form>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
