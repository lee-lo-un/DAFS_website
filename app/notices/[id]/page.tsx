import { createSupabaseServer } from "@/utils/supabase/server"
import { notFound } from "next/navigation"
import { formatDate } from "@/lib/utils"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"

export async function generateMetadata({ params }: { params: { id: string } }) {
  try {
    const supabase = await createSupabaseServer()
    const { data: notice } = await supabase.from("notices").select("title").eq("id", params.id).single()

    if (!notice) {
      return {
        title: "간산안내를 찾을 수 없습니다 - 동아풍수문화연구원",
      }
    }

    return {
      title: `${notice.title} - 동아풍수문화연구원 간산안내`,
    }
  } catch (error) {
    console.error("공지사항 메타데이터 오류:", error)
    return {
      title: "간산안내 - 동아풍수문화연구원",
    }
  }
}

export default async function NoticePage({ params }: { params: { id: string } }) {
  try {
    const supabase = await createSupabaseServer()
    const { data: notice, error } = await supabase
      .from("notices")
      .select("id, title, content, published_at, author_id")
      .eq("id", params.id)
      .single()

    if (error || !notice) {
      console.error("공지사항 조회 오류:", error)
      notFound()
    }

    return (
      <div className="container mx-auto py-24 px-4 md:px-8">
        <div className="mb-6">
          <Button variant="ghost" size="sm" asChild className="mb-4">
            <Link href="/notices" className="flex items-center">
              <ChevronLeft className="mr-1 h-4 w-4" />
              간산안내 목록으로
            </Link>
          </Button>
        </div>

        <article className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
          <div className="p-6 md:p-8">
            <h1 className="text-2xl md:text-3xl font-bold mb-4 dark:text-white">{notice.title}</h1>
            {/* 공지사항 상세 페이지에서도 날짜 처리 부분을 수정합니다. */}
            <div className="flex items-center text-gray-500 dark:text-gray-300 text-sm mb-8">
              <time dateTime={notice.published_at}>{formatDate(notice.published_at)}</time>
            </div>

            <div className="prose dark:prose-invert max-w-none">
              {notice.content.split("\n").map((paragraph, index) => (
                <p key={index} className="mb-4">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </article>
      </div>
    )
  } catch (error) {
    console.error("공지사항 상세 페이지 오류:", error)

    return (
      <div className="container mx-auto py-24 px-4 md:px-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold mb-4 text-red-700">일시적인 오류가 발생했습니다</h2>
          <p className="mb-6 text-gray-700">공지사항을 불러오는 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.</p>
          <Button asChild>
            <Link href="/notices">간산안내 목록으로</Link>
          </Button>
        </div>
      </div>
    )
  }
}
