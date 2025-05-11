"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createSupabaseClient } from "@/utils/supabase/client"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
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
} from "@/components/ui/alert-dialog"
import { Trash2 } from "lucide-react"

export default function DeleteQuestionButton({ questionId }: { questionId: string }) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const supabase = createSupabaseClient()

  const handleDelete = async () => {
    setIsLoading(true)

    try {
      // 현재 사용자 확인
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        toast({
          title: "로그인이 필요합니다",
          description: "질문을 삭제하려면 먼저 로그인해주세요.",
          variant: "destructive",
        })
        return
      }

      // 질문 정보 가져오기
      const { data: question, error: questionError } = await supabase
        .from("questions")
        .select("user_id")
        .eq("id", questionId)
        .single()

      if (questionError || !question) {
        throw new Error("질문을 찾을 수 없습니다.")
      }

      // 작성자 확인
      if (question.user_id !== user.id) {
        throw new Error("자신이 작성한 질문만 삭제할 수 있습니다.")
      }

      // 질문 삭제
      const { error: deleteError } = await supabase.from("questions").delete().eq("id", questionId)

      if (deleteError) {
        throw deleteError
      }

      toast({
        title: "질문 삭제 성공",
        description: "질문이 성공적으로 삭제되었습니다.",
      })

      // 질문 목록 페이지로 이동
      router.push("/qna")
      router.refresh()
    } catch (error: any) {
      toast({
        title: "질문 삭제 실패",
        description: error.message || "질문을 삭제하는 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      setIsOpen(false)
    }
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm">
          <Trash2 className="h-4 w-4 mr-2" />
          삭제
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>질문 삭제</AlertDialogTitle>
          <AlertDialogDescription>
            정말로 이 질문을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>취소</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={isLoading}>
            {isLoading ? "삭제 중..." : "삭제"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
