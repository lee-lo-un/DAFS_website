import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function BlogNotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
      <h1 className="text-4xl font-bold mb-4">게시물을 찾을 수 없습니다</h1>
      <p className="text-muted-foreground text-lg mb-8 text-center max-w-md">
        요청하신 블로그 게시물이 존재하지 않거나 삭제되었을 수 있습니다.
      </p>
      <Button asChild>
        <Link href="/blog">블로그 목록으로 돌아가기</Link>
      </Button>
    </div>
  )
}
