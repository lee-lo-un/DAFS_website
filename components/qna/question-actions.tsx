"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createSupabaseClient } from "@/utils/supabase/client"
import { useToast } from "@/components/ui/use-toast"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Pencil, Trash } from "lucide-react"

interface QuestionActionsProps {
  questionId: string
  hasAnswers: boolean
}

export default function QuestionActions({ questionId, hasAnswers }: QuestionActionsProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    const supabase = createSupabaseClient()

    try {
      const { error } = await supabase.from("questions").delete().eq("id", questionId)

      if (error) {
        throw error
      }

      toast({
        title: "질문이 삭제되었습니다",
        description: "질문이 성공적으로 삭제되었습니다.",
      })

      router.push("/qna")
      router.refresh()
    } catch (error) {
      console.error("Error deleting question:", error)
      toast({
        title: "질문 삭제 실패",
        description: "질문을 삭제하는 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
      setIsDeleteDialogOpen(false)
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">메뉴 열기</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {!hasAnswers && (
            <DropdownMenuItem asChild>
              <Link href={`/qna/edit/${questionId}`} className="flex items-center">
                <Pencil className="mr-2 h-4 w-4" />
                수정하기
              </Link>
            </DropdownMenuItem>
          )}
          <DropdownMenuItem
            onClick={() => setIsDeleteDialogOpen(true)}
            className="text-destructive focus:text-destructive"
          >
            <Trash className="mr-2 h-4 w-4" />
            삭제하기
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>질문 삭제</AlertDialogTitle>
            <AlertDialogDescription>
              정말로 이 질문을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>취소</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isDeleting} className="bg-destructive">
              {isDeleting ? "삭제 중..." : "삭제"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
