import type { Metadata } from "next"
import Link from "next/link"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import BlogSidebar from "@/components/blog/blog-sidebar"
import BlogImage from "@/components/blog/blog-image"
import { formatDate } from "@/lib/utils"
import { Pagination } from "@/components/ui/pagination"
import { Suspense } from "react"

export const metadata: Metadata = {
  title: "블로그 - 현대 풍수",
  description: "현대 풍수에 관한 다양한 정보와 팁을 제공합니다.",
}

// 페이지 캐싱 전략 설정: 10분마다 재검증
export const revalidate = 600

// 데이터 가져오기 함수 - 캐싱 제거
async function getPostsData(category: string, page: number, perPage: number) {
  try {
    console.log("블로그 페이지: 데이터 가져오기 시작")
    console.log("Supabase URL:", process.env.NEXT_PUBLIC_SUPABASE_URL ? "설정됨" : "설정안됨")
    console.log("Supabase Key:", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "설정됨" : "설정안됨")

    // 환경 변수 확인
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      console.error("Supabase 환경 변수가 설정되지 않았습니다.")
      throw new Error("데이터베이스 연결 정보가 설정되지 않았습니다.")
    }

    // 쿠키 스토어 가져오기
    const cookieStore = await cookies();

    // Supabase 클라이언트 생성 - 올바른 쿠키 메서드 구현
    const supabase = createServerClient(supabaseUrl, supabaseKey, {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: any) {
          cookieStore.set({ name, value: "", ...options });
        },
      },
    });

    // 선택된 카테고리 정보 가져오기
    let selectedCategory = null
    let categoryId = null

    if (category) {
      try {
        const { data: categoryData, error: categoryError } = await supabase
          .from("categories")
          .select("id, name, slug")
          .eq("slug", category)
          .single()

        if (categoryError) {
          console.error(`카테고리 조회 실패: ${categoryError.message}`)
          throw categoryError
        } else {
          selectedCategory = categoryData
          categoryId = categoryData?.id
        }
      } catch (error: any) {
        console.error(`카테고리 조회 중 예외 발생: ${error.message}`)
        throw new Error(`카테고리 '${category}'를 찾을 수 없습니다.`)
      }
    }

    // 게시물 총 개수 먼저 조회
    let count = 0
    try {
      let countQuery = supabase.from("blog_posts").select("id", { count: "exact" })
      if (categoryId) {
        countQuery = countQuery.eq("category_id", categoryId)
      }
      const { count: postCount, error: countError } = await countQuery

      if (countError) {
        console.error(`게시물 수 조회 실패: ${countError.message}`)
        throw countError
      } else {
        count = postCount || 0
      }
    } catch (error: any) {
      console.error(`게시물 수 조회 중 예외 발생: ${error.message}`)
      throw new Error("게시물 수를 조회할 수 없습니다.")
    }

    // 게시물 쿼리 구성
    let posts = []
    try {
      let query = supabase.from("blog_posts").select("*, categories(*)")

      // 카테고리 필터 적용
      if (categoryId) {
        query = query.eq("category_id", categoryId)
      }

      // 페이지네이션 및 정렬 적용
      const { data: postsData, error } = await query
        .order("published_at", { ascending: false })
        .range((page - 1) * perPage, page * perPage - 1)

      if (error) {
        console.error(`게시물 조회 실패: ${error.message}`)
        throw error
      } else {
        posts = postsData
      }
    } catch (error: any) {
      console.error(`게시물 조회 중 예외 발생: ${error.message}`)
      throw new Error("게시물을 조회할 수 없습니다.")
    }

    // 각 게시물에 카테고리 정보 추가
    const postsWithCategories = posts.map((post) => {
      if (!post.category_id) {
        return { ...post, category: { name: "일반", slug: "general" } }
      }

      if (post.categories) {
        return { ...post, category: post.categories }
      }

      return post
    })

    const totalPages = count ? Math.ceil(count / perPage) : 0

    return {
      posts: postsWithCategories,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: count || 0,
        perPage,
      },
      category: selectedCategory,
    }
  } catch (error: any) {
    console.error("블로그 데이터 가져오기 오류:", error)
    throw error
  }
}

// 블로그 포스트 컴포넌트 - 성능 최적화를 위해 분리
function BlogPosts({ posts, baseUrl }: { posts: any[]; baseUrl: string }) {
  if (posts.length === 0) {
    return (
      <div className="text-center py-12 bg-muted/50 rounded-lg">
        <p className="text-muted-foreground mb-4">게시물이 없습니다.</p>
        <p className="text-sm text-muted-foreground">
          아직 블로그 게시물이 등록되지 않았거나 데이터를 불러오는 중 문제가 발생했습니다.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post: any) => (
        <Link
          href={`/blog/${post.id}`}
          key={post.id}
          className="group overflow-hidden rounded-lg border bg-card shadow-sm transition-all hover:shadow-md"
          prefetch={false} // 필요할 때만 프리페치
        >
          <div className="aspect-video w-full overflow-hidden">
            <BlogImage
              src={post.image_url || "/placeholder.svg?height=400&width=600&query=풍수+블로그"}
              alt={post.title}
              className="h-full w-full object-cover transition-transform group-hover:scale-105"
            />
          </div>
          <div className="p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full text-xs">
                {post.category?.name || "일반"}
              </span>
              <span>•</span>
              <time dateTime={post.published_at}>{formatDate(new Date(post.published_at))}</time>
            </div>
            <h3 className="text-xl font-semibold leading-tight mb-2 group-hover:text-primary transition-colors">
              {post.title}
            </h3>
            <p className="text-muted-foreground line-clamp-2">
              {post.clean_content || post.content?.substring(0, 100)}
            </p>
          </div>
        </Link>
      ))}
    </div>
  )
}

// 페이지네이션 컴포넌트 - 성능 최적화를 위해 분리
function BlogPagination({ pagination, baseUrl }: { pagination: any; baseUrl: string }) {
  if (pagination.totalItems <= 0) {
    return null
  }

  return (
    <Pagination
      currentPage={pagination.currentPage}
      totalPages={pagination.totalPages}
      perPage={pagination.perPage}
      totalItems={pagination.totalItems}
      baseUrl={baseUrl}
    />
  )
}

// 초기 데이터 생성 함수 - 오류 처리 개선
const ensureInitialData = async () => {
  try {
    console.log("블로그 페이지: 초기 데이터 생성 시작")

    // 환경 변수 확인
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      console.error("Supabase 환경 변수가 설정되지 않았습니다.")
      throw new Error("데이터베이스 연결 정보가 설정되지 않았습니다.")
    }

    // 쿠키 스토어 가져오기
    const cookieStore = await cookies()

    const supabase = createServerClient(supabaseUrl, supabaseKey, {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          cookieStore.set({ name, value, ...options })
        },
        remove(name: string, options: any) {
          cookieStore.set({ name, value: "", ...options })
        },
      },
    })

    // 카테고리 테이블 확인 - 오류 처리 개선
    try {
      const { count: categoryCount, error: categoryCountError } = await supabase
        .from("categories")
        .select("*", { count: "exact", head: true })

      if (categoryCountError) {
        console.error("카테고리 테이블 확인 오류:", categoryCountError)
        return false
      }

      // 카테고리가 없으면 기본 카테고리 생성
      if (categoryCount === 0) {
        const defaultCategories = [
          {
            name: "풍수 기초",
            slug: "basics",
            description: "풍수의 기본 원리와 개념",
            color: "#4CAF50",
            display_order: 1,
            is_default: true,
          },
          {
            name: "인테리어 팁",
            slug: "interior",
            description: "풍수를 적용한 인테리어 팁",
            color: "#2196F3",
            display_order: 2,
            is_default: false,
          },
          {
            name: "풍수 사례",
            slug: "case-studies",
            description: "실제 풍수 적용 사례",
            color: "#FF9800",
            display_order: 3,
            is_default: false,
          },
        ]

        const { error: insertError } = await supabase.from("categories").insert(defaultCategories)

        if (insertError) {
          console.error("기본 카테고리 생성 오류:", insertError)
        } else {
          console.log("기본 카테고리가 생성되었습니다.")
        }
      }
    } catch (error) {
      console.error("카테고리 테이블 처리 중 예외 발생:", error)
    }

    return true
  } catch (error) {
    console.error("초기 데이터 생성 오류:", error)
    return false
  }
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: { category?: string; page?: string; per_page?: string }
}) {
  const params = await searchParams
  const category = params.category || ""
  const currentPage = Number(params.page) || 1
  const perPage = Number(params.per_page) || 6

  // 초기 데이터 확인 및 생성 - 오류가 발생해도 계속 진행
  try {
    await ensureInitialData()
  } catch (error) {
    console.error("초기 데이터 생성 중 오류 발생:", error)
  }

  // 데이터 가져오기 시도
  let data
  let errorMessage = null

  try {
    // 캐시 없이 데이터 가져오기
    data = await getPostsData(category, currentPage, perPage)
  } catch (error: any) {
    console.error("블로그 데이터 가져오기 실패:", error)
    errorMessage = error.message || "블로그 데이터를 가져오는 중 오류가 발생했습니다."

    // 오류 발생 시 빈 데이터 설정
    data = {
      posts: [],
      pagination: {
        currentPage: 1,
        totalPages: 0,
        totalItems: 0,
        perPage,
      },
      category: null,
    }
  }

  const { posts, pagination, category: selectedCategory } = data

  // 페이지네이션 URL 생성
  const baseUrl = category ? `/blog?category=${category}` : "/blog"

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-24 px-4 md:px-8 relative overflow-hidden">
        {/* 배경 효과 */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-background" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full -translate-y-1/3 translate-x-1/3 blur-3xl" />

        <div className="container-width relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">현대 풍수 블로그</h1>
            <p className="text-xl text-foreground/70 mb-8">현대적 관점에서 바라본 풍수 지식과 인테리어 팁</p>
          </div>
        </div>
      </section>

      {/* Blog Content Section */}
      <section className="py-16 px-4 md:px-8 relative">
        <div className="container-width relative z-10">
          {errorMessage && (
            <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 font-medium">{errorMessage}</p>
              <p className="text-red-600 text-sm mt-2">데이터베이스 연결에 문제가 있습니다. 관리자에게 문의하세요.</p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1 border border-muted rounded-lg p-4">
              <Suspense
                fallback={
                  <div className="space-y-4">
                    <div className="h-6 bg-muted rounded w-3/4"></div>
                    <div className="space-y-2">
                      <div className="h-10 bg-muted rounded"></div>
                      <div className="h-10 bg-muted rounded"></div>
                      <div className="h-10 bg-muted rounded"></div>
                    </div>
                  </div>
                }
              >
                <BlogSidebar activeCategory={category} />
              </Suspense>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* 카테고리 제목 표시 */}
              {category && selectedCategory && (
                <div className="mb-8">
                  <h2 className="text-2xl font-bold">카테고리: {selectedCategory.name}</h2>
                </div>
              )}

              {/* 블로그 포스트 그리드 */}
              <Suspense
                fallback={
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="rounded-lg border bg-card shadow-sm overflow-hidden">
                        <div className="aspect-video w-full bg-muted"></div>
                        <div className="p-4 space-y-3">
                          <div className="h-4 bg-muted rounded w-1/3"></div>
                          <div className="h-6 bg-muted rounded w-full"></div>
                          <div className="h-4 bg-muted rounded w-full"></div>
                          <div className="h-4 bg-muted rounded w-2/3"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                }
              >
                <BlogPosts posts={posts} baseUrl={baseUrl} />
              </Suspense>

              {/* 페이지네이션 */}
              <div className="mt-8">
                <BlogPagination pagination={pagination} baseUrl={baseUrl} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
