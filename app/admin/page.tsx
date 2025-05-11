"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Users, MessageSquare, Star, FileText, FolderTree, Bell, Database, Tag } from "lucide-react"
import AdminAuthCheck from "@/components/admin/admin-auth-check"
// 파일 상단에 Dashboard 컴포넌트 import 추가
import Dashboard from "@/components/admin/dashboard"
import { Button } from "@/components/ui/button"

export default function AdminPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-24 px-4 md:px-8 relative overflow-hidden">
        {/* 배경 효과 */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-background" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full -translate-y-1/3 translate-x-1/3 blur-3xl" />

        <div className="container-width relative z-10">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">관리자 대시보드</h1>
            <p className="text-xl text-foreground/70 mb-8">사이트 관리 및 통계를 확인하세요.</p>
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
                  <CardDescription>사이트 통계 및 최근 활동을 확인하세요.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Dashboard />
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
                        href="/admin/users"
                        className="flex items-center gap-2 p-2 rounded-md hover:bg-muted transition-colors"
                      >
                        <Users className="h-4 w-4" />
                        <span>사용자 관리</span>
                      </Link>
                      <Link
                        href="/admin/questions"
                        className="flex items-center gap-2 p-2 rounded-md hover:bg-muted transition-colors"
                      >
                        <MessageSquare className="h-4 w-4" />
                        <span>질문 관리</span>
                      </Link>
                      <Link
                        href="/admin/reviews"
                        className="flex items-center gap-2 p-2 rounded-md hover:bg-muted transition-colors"
                      >
                        <Star className="h-4 w-4" />
                        <span>리뷰 관리</span>
                      </Link>
                      <Link
                        href="/admin/blog"
                        className="flex items-center gap-2 p-2 rounded-md hover:bg-muted transition-colors"
                      >
                        <FileText className="h-4 w-4" />
                        <span>블로그 관리</span>
                      </Link>
                      <Link
                        href="/admin/categories"
                        className="flex items-center gap-2 p-2 rounded-md hover:bg-muted transition-colors"
                      >
                        <FolderTree className="h-4 w-4" />
                        <span>카테고리 관리</span>
                      </Link>
                      <Link
                        href="/admin/notices"
                        className="flex items-center gap-2 p-2 rounded-md hover:bg-muted transition-colors"
                      >
                        <Bell className="h-4 w-4" />
                        <span>공지사항 관리</span>
                      </Link>
                      {/* 교육 관리 카드 추가 */}
                      <div className="mt-4 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                        <h3 className="text-xl font-bold mb-4">교육 관리</h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                          풍수 교육 과정 및 세미나를 관리하고 신청자를 확인합니다.
                        </p>
                        <Link href="/admin/courses">
                          <Button className="w-full">교육 관리</Button>
                        </Link>
                      </div>
                    </nav>
                  </CardContent>
                </Card>
              </div>
            </div>
          </AdminAuthCheck>
        </div>
      </section>
    </div>
  )
}
