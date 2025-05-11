"use client"

import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { formatDate } from "@/lib/utils"
import BlogImage from "@/components/blog/blog-image"
import { Suspense } from "react"
import { getPostData } from "./getPostData"

// 관련 포스트 가져오기 함수 - 캐싱 제거
async function getRelatedPosts(currentPostId: string, categoryId: string | null) {
  try {
    const cookieStore = cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
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
      },
    )

    console.log(`블로그 상세: ID ${currentPostId}의 관련 포스트 가져오기 시작`)

    let query = supabase
      .from("blog_posts")
      .select("id, title, published_at, image_url")
      .neq("id", currentPostId)
      .order("published_at", { ascending: false })
      .limit(3)

    if (categoryId) {
      query = query.eq("category_id", categoryId)
    }

    const { data, error } = await query

    if (error) {
      console.error(`블로그 상세: 관련 포스트 조회 오류 - ${error.message}`)
      return []
    }

    console.log(`블로그 상세: ID ${currentPostId}의 관련 포스트 가져오기 성공 (${data.length}개)`)
    return data
  } catch (error) {
    console.error("블로그 상세: 관련 포스트 가져오기 중 예상치 못한 오류 발생", error)
    return []
  }
}

// 관련 포스트 컴포넌트
function RelatedPosts({ posts }: { posts: any[] }) {
  if (!posts || posts.length === 0) return null

  return (
    <div className="mt-12 pt-8 border-t">
      <h2 className="text-2xl font-bold mb-6">관련 게시물</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/blog/${post.id}`}
            className="group overflow-hidden rounded-lg border bg-card shadow-sm hover:shadow-md"
          >
            <div className="aspect-video w-full overflow-hidden">
              <BlogImage
                src={post.image_url || "/placeholder.svg?height=200&width=300&query=풍수+블로그"}
                alt={post.title}
                className="h-full w-full object-cover transition-transform group-hover:scale-105"
              />
            </div>
            <div className="p-4">
              <h3 className="font-medium line-clamp-2 group-hover:text-primary transition-colors">{post.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">{formatDate(new Date(post.published_at))}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default function BlogPostPageClient({ params }: { params: { id: string } }) {
  console.log(`블로그 상세 페이지 렌더링 시작: ID ${params.id}`)

  // 포스트 데이터 가져오기

  const getBlogData = async () => {
    const post = await getPostData(params.id)

    // 포스트가 없으면 404 페이지 표시
    if (!post) {
      console.log(`블로그 상세: ID ${params.id}의 포스트를 찾을 수 없음, 404 반환`)
      notFound()
    }

    // 관련 포스트 가져오기
    const relatedPosts = await getRelatedPosts(params.id, post.category_id)

    return { post, relatedPosts }
  }

  const data = getBlogData()

  return (
    <Suspense fallback={<p>Loading...</p>}>
      <BlogContent params={params} promise={data} />
    </Suspense>
  )
}

async function BlogContent({
  params,
  promise,
}: { params: { id: string }; promise: Promise<{ post: any; relatedPosts: any[] | null }> }) {
  const { post, relatedPosts } = await promise

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-24 px-4 md:px-8 relative overflow-hidden">
        {/* 배경 효과 */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-background" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full -translate-y-1/3 translate-x-1/3 blur-3xl" />

        <div className="container-width relative z-10">
          <div className="mb-8">
            <Button asChild variant="outline" size="sm">
              <Link href="/blog" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                블로그 목록으로
              </Link>
            </Button>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <Link href="/blog" className="hover:text-primary transition-colors">
                블로그
              </Link>
              <span>•</span>
              {post.categories && (
                <Link
                  href={`/blog?category=${post.categories.slug}`}
                  className="bg-primary/10 text-primary px-2 py-0.5 rounded-full text-xs hover:bg-primary/20 transition-colors"
                >
                  {post.categories.name}
                </Link>
              )}
              <span>•</span>
              <time dateTime={post.published_at}>{formatDate(new Date(post.published_at))}</time>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold mb-6">{post.title}</h1>
            {post.clean_content && <p className="text-xl text-foreground/70 mb-8">{post.clean_content}</p>}
          </div>
        </div>
      </section>

      {/* Blog Content Section */}
      <section className="flex-grow py-8 px-4 md:px-8">
        <div className="container-width">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 lg:col-start-3">
              {/* 메인 이미지 */}
              {post.image_url && (
                <div className="mb-8 rounded-lg overflow-hidden">
                  <BlogImage src={post.image_url} alt={post.title} className="w-full h-auto object-cover" priority />
                </div>
              )}

              {/* 본문 내용 */}
              <div className="blog-content prose prose-lg max-w-none">
                <style jsx global>{`
                  .blog-content img {
                    display: block;
                    max-width: 100%;
                    height: auto;
                    margin: 2rem auto;
                    border-radius: 0.5rem;
                  }
                  .blog-content p {
                    margin-bottom: 1.5rem;
                  }
                  .blog-content a {
                    color: #3A7B89;
                    text-decoration: underline;
                  }
                `}</style>
                <div
                  dangerouslySetInnerHTML={{
                    __html:
                      post.content?.replace(
                        /<img(.*?)src="(?!http|\/)(.*?)"(.*?)>/g,
                        (match, p1, p2, p3) =>
                          `<img${p1}src="${p2}"${p3} style="max-width:100%;height:auto;display:block;margin:2rem auto;">`,
                      ) || "",
                  }}
                />
              </div>

              {/* 관련 게시물 */}
              <Suspense
                fallback={
                  <div className="mt-12 pt-8 border-t">
                    <p>관련 게시물 로딩 중...</p>
                  </div>
                }
              >
                <RelatedPosts posts={relatedPosts} />
              </Suspense>

              {/* 뒤로 가기 버튼 */}
              <div className="mt-8">
                <Link
                  href="/blog"
                  className="inline-flex items-center text-primary hover:text-primary/80 transition-colors"
                >
                  ← 블로그 목록으로 돌아가기
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
