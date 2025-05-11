"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"

interface Category {
  id: string
  name: string
  slug: string
  count?: number
}

interface BlogSidebarProps {
  activeCategory?: string
}

export default function BlogSidebar({ activeCategory = "" }: BlogSidebarProps) {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [totalPostCount, setTotalPostCount] = useState(0)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchCategories() {
      try {
        setIsLoading(true)
        console.log("블로그 사이드바: 카테고리 API 호출 시작")

        // API를 통해 카테고리 데이터 가져오기
        const response = await fetch("/api/blog/categories", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          // 캐시 방지를 위한 타임스탬프 추가
          cache: "no-store",
        })

        if (!response.ok) {
          throw new Error(`카테고리 API 오류: ${response.status}`)
        }

        const data = await response.json()
        console.log("블로그 사이드바: 카테고리 API 응답", data)

        // API 응답 구조 확인 및 처리
        if (Array.isArray(data)) {
          // 배열 형태로 직접 반환된 경우
          setCategories(data)
          // 총 게시물 수 계산
          const total = data.reduce((sum, category) => sum + (category.count || 0), 0)
          setTotalPostCount(total)
        } else if (data.categories && Array.isArray(data.categories)) {
          // {categories: [...]} 형태로 반환된 경우
          setCategories(data.categories)
          setTotalPostCount(data.totalPosts || 0)
        } else {
          console.error("예상치 못한 API 응답 형식:", data)
          setCategories([])
          setTotalPostCount(0)
        }

        setError(null)
      } catch (err) {
        console.error("블로그 사이드바: 카테고리 로딩 오류", err)
        setError(err instanceof Error ? err.message : "카테고리를 불러올 수 없습니다")
        setCategories([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchCategories()
  }, [])

  if (isLoading) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">카테고리 로딩 중...</p>
        <div className="space-y-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-4">
        <p className="text-sm font-medium text-foreground">카테고리를 불러올 수 없습니다.</p>
        <p className="text-xs text-muted-foreground mb-4">{error}</p>
        <div className="space-y-2">
          <Link
            href="/blog"
            className="block px-3 py-2 rounded-md transition-colors bg-primary text-primary-foreground"
          >
            전체 보기
          </Link>
        </div>
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-xs text-red-600">데이터베이스 연결에 문제가 있습니다. 관리자에게 문의하세요.</p>
        </div>
      </div>
    )
  }

  if (categories.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">카테고리</h2>
          <div className="space-y-1">
            <Link
              href="/blog"
              className={`block px-3 py-2 rounded-md transition-colors ${
                activeCategory === "" ? "bg-primary text-primary-foreground" : "hover:bg-muted text-foreground"
              }`}
            >
              전체 보기 ({totalPostCount})
            </Link>
            <p className="text-sm text-muted-foreground p-2">등록된 카테고리가 없습니다.</p>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">소개</h2>
          <div className="bg-muted p-4 rounded-lg">
            <p className="text-sm text-muted-foreground">
              현대 풍수 블로그에서는 전통 풍수를 현대적 관점에서 재해석하여 일상 생활에 적용할 수 있는 다양한 정보를
              제공합니다.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">카테고리</h2>
        <div className="space-y-1">
          <Link
            href="/blog"
            className={`block px-3 py-2 rounded-md transition-colors ${
              activeCategory === "" ? "bg-primary text-primary-foreground" : "hover:bg-muted text-foreground"
            }`}
          >
            전체 보기 ({totalPostCount})
          </Link>
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/blog?category=${category.slug}`}
              className={`block px-3 py-2 rounded-md transition-colors ${
                activeCategory === category.slug
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted text-foreground"
              }`}
            >
              {category.name} ({category.count || 0})
            </Link>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">소개</h2>
        <div className="bg-muted p-4 rounded-lg">
          <p className="text-sm text-muted-foreground">
            현대 풍수 블로그에서는 전통 풍수를 현대적 관점에서 재해석하여 일상 생활에 적용할 수 있는 다양한 정보를
            제공합니다.
          </p>
        </div>
      </div>
    </div>
  )
}
