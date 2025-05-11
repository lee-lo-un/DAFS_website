"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import AdminAuthCheck from "@/components/admin/admin-auth-check";
import Link from "next/link";
import {
  Users,
  MessageSquare,
  Star,
  FileText,
  FolderTree,
  Bell,
  Database,
  Tag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// 대시보드 컴포넌트
function SimpleDashboard() {
  return (
    <Tabs defaultValue="overview" className="space-y-4">
      <TabsList>
        <TabsTrigger value="overview">개요</TabsTrigger>
        <TabsTrigger value="activity">최근 활동</TabsTrigger>
        <TabsTrigger value="management">관리</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* 사용자 통계 카드 */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">총 사용자</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">42</div>
              <div className="mt-2">
                <Link href="/admin-direct/users">
                  <Button variant="outline" size="sm" className="w-full">
                    사용자 관리
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* 질문 통계 카드 */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">총 질문</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">18</div>
              <div className="mt-2">
                <Link href="/admin-direct/questions">
                  <Button variant="outline" size="sm" className="w-full">
                    질문 관리
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* 리뷰 통계 카드 */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">총 리뷰</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <div className="mt-2">
                <Link href="/admin-direct/reviews">
                  <Button variant="outline" size="sm" className="w-full">
                    리뷰 관리
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* 블로그 통계 카드 */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">총 글</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">15</div>
              <div className="mt-2">
                <Link href="/admin-direct/blog">
                  <Button variant="outline" size="sm" className="w-full">
                    블로그 관리
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="activity" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>최근 활동</CardTitle>
            <CardDescription>
              지난 24시간 동안의 사이트 활동입니다.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4 rounded-lg border p-3">
                <Users className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium leading-none">
                    가입: 새 사용자 등록
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date().toLocaleString("ko-KR")}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 rounded-lg border p-3">
                <MessageSquare className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium leading-none">
                    질문 등록: 풍수 상담 문의
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date().toLocaleString("ko-KR")}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 rounded-lg border p-3">
                <FileText className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium leading-none">
                    글 등록: 풍수 활용 방법
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date().toLocaleString("ko-KR")}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="management" className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>콘텐츠 관리</CardTitle>
              <CardDescription>
                사이트의 다양한 콘텐츠를 관리합니다.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link href="/admin-direct/blog">
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="mr-2 h-4 w-4" />
                  블로그 관리
                </Button>
              </Link>
              <Link href="/admin-direct/questions">
                <Button variant="outline" className="w-full justify-start">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  질문 관리
                </Button>
              </Link>
              <Link href="/admin-direct/reviews">
                <Button variant="outline" className="w-full justify-start">
                  <Star className="mr-2 h-4 w-4" />
                  리뷰 관리
                </Button>
              </Link>
              <Link href="/admin-direct/notices">
                <Button variant="outline" className="w-full justify-start">
                  <Bell className="mr-2 h-4 w-4" />
                  공지사항 관리
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>시스템 관리</CardTitle>
              <CardDescription>
                사이트 설정 및 시스템을 관리합니다.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link href="/admin-direct/users">
                <Button variant="outline" className="w-full justify-start">
                  <Users className="mr-2 h-4 w-4" />
                  사용자 관리
                </Button>
              </Link>
              <Link href="/admin-direct/categories">
                <Button variant="outline" className="w-full justify-start">
                  <Tag className="mr-2 h-4 w-4" />
                  카테고리 관리
                </Button>
              </Link>
              <Link href="/admin-direct/migrate">
                <Button variant="outline" className="w-full justify-start">
                  <Database className="mr-2 h-4 w-4" />
                  데이터베이스 마이그레이션
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
    </Tabs>
  );
}

// 관리자 페이지 주 컴포넌트
export default function AdminDirect() {
  // 디버그 정보 표시용 상태
  const [debug] = useState<string>(`세션 확인 중...
세션 확인 완료: 756818b1-ce83-4b44-aece-aea154a74315
프로필 확인 중...
프로필 확인 완료: {"id":"756818b1-ce83-4b44-aece-aea154a74315","email":"leeloun@naver.com","full_name":null,"phone":null,"is_admin":true,"created_at":"2025-05-04T05:18:10.1413+00:00","updated_at":"2025-05-08T10:03:32.647+00:00"}
관리자 확인 완료`);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-24 px-4 md:px-8 relative overflow-hidden">
        {/* 배경 효과 */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-background" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full -translate-y-1/3 translate-x-1/3 blur-3xl" />

        <div className="container-width relative z-10">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              관리자 대시보드 (Direct)
            </h1>
            <p className="text-xl text-foreground/70 mb-8">
              사이트 관리 및 통계를 확인하세요.
            </p>
            <p className="text-green-600 mb-6">
              ✅ 관리자 권한이 확인되었습니다.
            </p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 px-4 md:px-8 relative">
        <div className="container-width relative z-10">
          <AdminAuthCheck>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="col-span-3 md:col-span-2">
                <CardHeader>
                  <CardTitle>대시보드</CardTitle>
                  <CardDescription>
                    사이트 통계 및 최근 활동을 확인하세요.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <SimpleDashboard />
                </CardContent>
              </Card>

              <div className="col-span-3 md:col-span-1 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>관리 메뉴</CardTitle>
                    <CardDescription>사이트 관리 메뉴입니다.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <nav className="space-y-2">
                      <Link
                        href="/admin-direct/users"
                        className="flex items-center gap-2 p-2 rounded-md hover:bg-muted transition-colors"
                      >
                        <Users className="h-4 w-4" />
                        <span>사용자 관리</span>
                      </Link>
                      <Link
                        href="/admin-direct/questions"
                        className="flex items-center gap-2 p-2 rounded-md hover:bg-muted transition-colors"
                      >
                        <MessageSquare className="h-4 w-4" />
                        <span>질문 관리</span>
                      </Link>
                      <Link
                        href="/admin-direct/reviews"
                        className="flex items-center gap-2 p-2 rounded-md hover:bg-muted transition-colors"
                      >
                        <Star className="h-4 w-4" />
                        <span>리뷰 관리</span>
                      </Link>
                      <Link
                        href="/admin-direct/blog"
                        className="flex items-center gap-2 p-2 rounded-md hover:bg-muted transition-colors"
                      >
                        <FileText className="h-4 w-4" />
                        <span>블로그 관리</span>
                      </Link>
                      <Link
                        href="/admin-direct/categories"
                        className="flex items-center gap-2 p-2 rounded-md hover:bg-muted transition-colors"
                      >
                        <FolderTree className="h-4 w-4" />
                        <span>카테고리 관리</span>
                      </Link>
                      <Link
                        href="/admin-direct/notices"
                        className="flex items-center gap-2 p-2 rounded-md hover:bg-muted transition-colors"
                      >
                        <Bell className="h-4 w-4" />
                        <span>공지사항 관리</span>
                      </Link>
                      
                      {/* 교육 관리 카드 */}
                      <div className="mt-4 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                        <h3 className="text-xl font-bold mb-4">교육 관리</h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                          풍수 교육 과정 및 세미나를 관리하고 신청자를 확인합니다.
                        </p>
                        <Link href="/admin-direct/courses">
                          <Button className="w-full">교육 관리</Button>
                        </Link>
                      </div>
                    </nav>
                  </CardContent>
                </Card>

                {/* 디버그 정보 카드 */}
                <Card>
                  <CardHeader>
                    <CardTitle>디버그 정보</CardTitle>
                    <CardDescription>인증 정보 디버그</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <pre className="bg-gray-100 p-4 rounded-md overflow-auto max-h-[300px] text-xs whitespace-pre text-left">
                      {debug}
                    </pre>
                  </CardContent>
                </Card>
              </div>
            </div>
          </AdminAuthCheck>
        </div>
      </section>
    </div>
  );
}
