"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Users, MessageSquare, Star, FileText, Bell, Tag, Database } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface DashboardStats {
  userCount: number
  questionCount: number
  reviewCount: number
  blogCount: number
  recentActivity: Array<{
    type: string
    id: string
    title: string
    date: string
    action: string
  }>
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    userCount: 0,
    questionCount: 0,
    reviewCount: 0,
    blogCount: 0,
    recentActivity: [],
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchDashboardStats() {
      try {
        setLoading(true)
        setError(null)

        console.log("대시보드 통계 데이터 요청 시작")
        const response = await fetch("/api/stats/summary", {
          method: "GET",
          headers: {
            "Cache-Control": "no-cache",
          },
        })

        console.log("대시보드 통계 응답 상태:", response.status)

        if (!response.ok) {
          const errorText = await response.text()
          console.error("API 응답 오류:", errorText)
          throw new Error(`통계 데이터를 가져오는데 실패했습니다. 상태 코드: ${response.status}`)
        }

        const data = await response.json()
        console.log("대시보드 통계 데이터:", data)

        if (!data) {
          throw new Error("API에서 데이터를 반환하지 않았습니다")
        }

        setStats({
          userCount: data.userCount || 0,
          questionCount: data.questionCount || 0,
          reviewCount: data.reviewCount || 0,
          blogCount: data.blogCount || 0,
          recentActivity: data.recentActivity || [],
        })
      } catch (err) {
        console.error("대시보드 통계 데이터 가져오기 오류:", err)
        setError(err instanceof Error ? err.message : "통계 데이터를 불러오는 중 오류가 발생했습니다.")
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardStats()
  }, [])

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {error}
          <div className="mt-2">
            <Button variant="outline" size="sm" onClick={() => window.location.reload()} className="mr-2">
              페이지 새로고침
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    )
  }

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
              {loading ? (
                <Skeleton className="h-7 w-20" />
              ) : (
                <div className="text-2xl font-bold">{stats.userCount}</div>
              )}
              <div className="mt-2">
                <Link href="/admin/users">
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
              {loading ? (
                <Skeleton className="h-7 w-20" />
              ) : (
                <div className="text-2xl font-bold">{stats.questionCount}</div>
              )}
              <div className="mt-2">
                <Link href="/admin/questions">
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
              {loading ? (
                <Skeleton className="h-7 w-20" />
              ) : (
                <div className="text-2xl font-bold">{stats.reviewCount}</div>
              )}
              <div className="mt-2">
                <Link href="/admin/reviews">
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
              <CardTitle className="text-sm font-medium">총 블로그 포스트</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-7 w-20" />
              ) : (
                <div className="text-2xl font-bold">{stats.blogCount}</div>
              )}
              <div className="mt-2">
                <Link href="/admin/blog">
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
            <CardDescription>사이트의 최근 활동 내역입니다.</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-2">
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
              </div>
            ) : stats.recentActivity && stats.recentActivity.length > 0 ? (
              <div className="space-y-4">
                {stats.recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center gap-4 rounded-lg border p-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                      {activity.type === "user" && <Users className="h-4 w-4 text-primary" />}
                      {activity.type === "question" && <MessageSquare className="h-4 w-4 text-primary" />}
                      {activity.type === "review" && <Star className="h-4 w-4 text-primary" />}
                      {activity.type === "blog" && <FileText className="h-4 w-4 text-primary" />}
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {activity.action}: {activity.title}
                      </p>
                      <p className="text-xs text-muted-foreground">{new Date(activity.date).toLocaleString("ko-KR")}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-muted-foreground">최근 활동이 없습니다.</div>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="management" className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>콘텐츠 관리</CardTitle>
              <CardDescription>사이트의 다양한 콘텐츠를 관리합니다.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link href="/admin/blog">
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="mr-2 h-4 w-4" />
                  블로그 관리
                </Button>
              </Link>
              <Link href="/admin/questions">
                <Button variant="outline" className="w-full justify-start">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  질문 관리
                </Button>
              </Link>
              <Link href="/admin/reviews">
                <Button variant="outline" className="w-full justify-start">
                  <Star className="mr-2 h-4 w-4" />
                  리뷰 관리
                </Button>
              </Link>
              <Link href="/admin/notices">
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
              <CardDescription>사이트 설정 및 시스템을 관리합니다.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link href="/admin/users">
                <Button variant="outline" className="w-full justify-start">
                  <Users className="mr-2 h-4 w-4" />
                  사용자 관리
                </Button>
              </Link>
              <Link href="/admin/categories">
                <Button variant="outline" className="w-full justify-start">
                  <Tag className="mr-2 h-4 w-4" />
                  카테고리 관리
                </Button>
              </Link>
              <Link href="/admin/migrate">
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
  )
}
