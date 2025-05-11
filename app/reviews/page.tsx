export const dynamic = "force-dynamic"

import { createSupabaseServer } from "@/utils/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { formatDate } from "@/lib/utils"
import Link from "next/link"
import { Star, ArrowRight } from "lucide-react"
import ReviewActions from "@/components/reviews/review-actions"
import ReviewUserActions from "@/components/reviews/review-user-actions"
import { Pagination } from "@/components/ui/pagination"

export default async function ReviewsPage({ searchParams }: { searchParams: any }) {
  // 최신 Next.js에서는 searchParams가 async context API로 동작할 수 있으므로, await 보장
  const params = typeof searchParams.then === "function" ? await searchParams : searchParams;
  const supabase = await createSupabaseServer()


  const currentPage = Number(params.page) || 1
  const perPage = Number(params.per_page) || 6

  // 총 후기 수 조회
  const { count, error: countError } = await supabase.from("reviews").select("*", { count: "exact" })

  if (countError) {
    console.error("Error counting reviews:", countError)
  }

  // 페이지네이션 적용하여 후기 조회
  const { data: reviews, error } = await supabase
    .from("reviews")
    .select("*, products(name)")
    .order("created_at", { ascending: false })
    .range((currentPage - 1) * perPage, currentPage * perPage - 1)

  if (error) {
    console.error("Error fetching reviews:", error)
  }

  const totalItems = count || 0
  const totalPages = Math.ceil(totalItems / perPage)

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-24 px-4 md:px-8 relative overflow-hidden">
        {/* 배경 효과 */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-background" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full -translate-y-1/3 translate-x-1/3 blur-3xl" />

        <div className="container-width relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">고객 후기</h1>
            <p className="text-xl text-foreground/70 mb-8">
              모던 풍수의 컨설팅을 경험한 고객들의 생생한 후기를 확인하세요.
            </p>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-16 px-4 md:px-8 relative">
        <div className="container-width relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews && reviews.length > 0 ? (
              reviews.map((review: any) => (
                <Card
                  key={review.id}
                  className="border-2 border-primary/10 hover:border-primary/30 transition-all duration-300"
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${i < review.rating ? "fill-accent text-accent" : "fill-muted text-muted"}`}
                            />
                          ))}
                        </div>
                        <CardTitle>익명</CardTitle>
                      </div>
                      {/* 본인 후기인 경우 수정 버튼 표시 */}
                      <ReviewUserActions userId={review.user_id} review={review} />
                    </div>
                    <CardDescription>
                      {review.products?.name || "풍수 컨설팅"} | {formatDate(new Date(review.created_at))}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{review.content}</p>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-10">
                <p className="text-muted-foreground">등록된 후기가 없습니다.</p>
              </div>
            )}
          </div>

          {/* 페이지네이션 */}
          {totalItems > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              perPage={perPage}
              totalItems={totalItems}
              baseUrl="/reviews"
            />
          )}

          <div className="mt-12 text-center">
            <Button asChild className="group">
              <Link href="/reviews/write">
                후기 작성하기
                <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
