"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createSupabaseClient } from "@/utils/supabase/client"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
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
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { formatDate } from "@/lib/utils"
import { Search, MessageSquare, Trash2, Loader2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface Question {
  id: string
  title: string
  content: string
  category: string
  created_at: string
  answers: any[]
}

export default function QuestionManagement() {
  const router = useRouter()
  const { toast } = useToast()
  const [questions, setQuestions] = useState<Question[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null)
  const [answerContent, setAnswerContent] = useState("")
  const [showAnswerDialog, setShowAnswerDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [questionToDelete, setQuestionToDelete] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 질문 데이터 로드
  useEffect(() => {
    async function loadQuestions() {
      try {
        setLoading(true)
        setError(null)

        const supabase = createSupabaseClient()
        if (!supabase) {
          setError("Supabase 클라이언트 초기화에 실패했습니다")
          setLoading(false)
          return
        }

        console.log("질문 관리: 데이터 로딩 시작")

        // 질문 목록 가져오기
        const { data: questionsData, error: questionsError } = await supabase
          .from("questions")
          .select("*")
          .order("created_at", { ascending: false })

        if (questionsError) {
          console.error("질문 로딩 오류:", questionsError)
          setError("질문 데이터를 불러오는 중 오류가 발생했습니다")
          setLoading(false)
          return
        }

        console.log("질문 관리: 질문 로딩 완료", questionsData?.length || 0)

        // 각 질문에 대한 답변 가져오기
        const questionsWithAnswers = await Promise.all(
          questionsData.map(async (question) => {
            const { data: answers, error: answersError } = await supabase
              .from("answers")
              .select("*")
              .eq("question_id", question.id)
              .order("created_at", { ascending: true })

            if (answersError) {
              console.error(`질문 ${question.id}의 답변 로딩 오류:`, answersError)
              return { ...question, answers: [] }
            }

            return { ...question, answers: answers || [] }
          }),
        )

        setQuestions(questionsWithAnswers)
      } catch (error) {
        console.error("질문 데이터 로딩 오류:", error)
        setError("질문 데이터를 불러오는 중 오류가 발생했습니다")
      } finally {
        setLoading(false)
      }
    }

    loadQuestions()
  }, [])

  // 검색 필터링
  const filteredQuestions = questions.filter(
    (question) =>
      question.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      question.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      question.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // 답변 다이얼로그 열기
  const openAnswerDialog = (question: Question) => {
    setSelectedQuestion(question)
    setShowAnswerDialog(true)
  }

  // 삭제 다이얼로그 열기
  const openDeleteDialog = (questionId: string) => {
    setQuestionToDelete(questionId)
    setShowDeleteDialog(true)
  }

  // 답변 제출
  const handleSubmitAnswer = async (questionId: string) => {
    setIsSubmitting(true)

    try {
      const supabase = createSupabaseClient()
      if (!supabase) {
        toast({
          title: "오류 발생",
          description: "Supabase 클라이언트 초기화에 실패했습니다",
          variant: "destructive",
        })
        setIsSubmitting(false)
        return
      }

      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        toast({
          title: "로그인이 필요합니다",
          description: "답변을 작성하려면 먼저 로그인해주세요.",
          variant: "destructive",
        })
        return
      }

      if (!answerContent.trim()) {
        toast({
          title: "답변을 입력해주세요",
          description: "답변 내용을 입력해주세요.",
          variant: "destructive",
        })
        setIsSubmitting(false)
        return
      }

      const { error } = await supabase.from("answers").insert({
        question_id: questionId,
        admin_id: user.id,
        content: answerContent,
      })

      if (error) throw error

      toast({
        title: "답변 등록 성공",
        description: "답변이 성공적으로 등록되었습니다.",
      })

      // 질문 목록 업데이트
      const updatedQuestions = questions.map((q) => {
        if (q.id === questionId) {
          return {
            ...q,
            answers: [
              ...q.answers,
              {
                id: Date.now().toString(),
                content: answerContent,
                created_at: new Date().toISOString(),
              },
            ],
          }
        }
        return q
      })

      setQuestions(updatedQuestions)
      setSelectedQuestion(null)
      setAnswerContent("")
      setShowAnswerDialog(false)
    } catch (error: any) {
      toast({
        title: "답변 등록 실패",
        description: error.message || "답변을 등록하는 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // 질문 삭제 함수를 수정합니다
  const handleDeleteQuestion = async () => {
    if (!questionToDelete) return

    setIsSubmitting(true)

    try {
      const supabase = createSupabaseClient()
      if (!supabase) {
        toast({
          title: "오류 발생",
          description: "Supabase 클라이언트 초기화에 실패했습니다",
          variant: "destructive",
        })
        setIsSubmitting(false)
        return
      }

      console.log("Deleting question with ID:", questionToDelete)

      // 먼저 질문에 연결된 답변 삭제
      const { error: answersError } = await supabase.from("answers").delete().eq("question_id", questionToDelete)

      if (answersError) {
        console.error("Error deleting answers:", answersError)
      }

      // 질문 삭제
      const { error } = await supabase.from("questions").delete().eq("id", questionToDelete)

      if (error) {
        console.error("Error deleting question:", error)
        throw error
      }

      toast({
        title: "질문 삭제 성공",
        description: "질문이 성공적으로 삭제되었습니다.",
      })

      // 질문 목록 업데이트
      setQuestions(questions.filter((q) => q.id !== questionToDelete))
      setQuestionToDelete(null)
      setShowDeleteDialog(false)

      // 페이지 새로고침
      router.refresh()
    } catch (error: any) {
      console.error("Error deleting question:", error)
      toast({
        title: "질문 삭제 실패",
        description: error.message || "질문을 삭제하는 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px]">
        <Loader2 className="h-8 w-8 animate-spin mb-4" />
        <p>질문 데이터를 불러오는 중입니다...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-800 p-4 rounded-md">
        <p className="font-medium">오류 발생</p>
        <p>{error}</p>
        <Button variant="outline" className="mt-2" onClick={() => window.location.reload()}>
          새로고침
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      {/* 검색 필드 */}
      <div className="mb-6 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="제목, 내용 또는 카테고리로 검색"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* 질문 테이블 */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>제목</TableHead>
              <TableHead>카테고리</TableHead>
              <TableHead>작성일</TableHead>
              <TableHead>상태</TableHead>
              <TableHead className="text-right">작업</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredQuestions.length > 0 ? (
              filteredQuestions.map((question) => (
                <TableRow key={question.id}>
                  <TableCell className="font-medium">{question.title}</TableCell>
                  <TableCell>{question.category}</TableCell>
                  <TableCell>{formatDate(new Date(question.created_at))}</TableCell>
                  <TableCell>
                    {question.answers && question.answers.length > 0 ? (
                      <Badge
                        variant="outline"
                        className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                      >
                        답변 완료
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                      >
                        답변 대기
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex space-x-2 justify-end">
                      <Button variant="outline" size="sm" onClick={() => openAnswerDialog(question)}>
                        <MessageSquare className="h-4 w-4 mr-1" />
                        답변
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => openDeleteDialog(question.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4">
                  {searchTerm ? "검색 결과가 없습니다." : "등록된 질문이 없습니다."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* 답변 다이얼로그 */}
      {selectedQuestion && (
        <Dialog open={showAnswerDialog} onOpenChange={setShowAnswerDialog}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>{selectedQuestion.title}</DialogTitle>
              <DialogDescription>
                {selectedQuestion.category} | {formatDate(new Date(selectedQuestion.created_at))}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="bg-muted p-4 rounded-md">
                <p className="whitespace-pre-wrap">{selectedQuestion.content}</p>
              </div>
              {selectedQuestion.answers && selectedQuestion.answers.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium">기존 답변</h4>
                  {selectedQuestion.answers.map((answer, index) => (
                    <div key={index} className="bg-primary/10 p-4 rounded-md">
                      <p className="whitespace-pre-wrap">{answer.content}</p>
                      <p className="text-xs text-muted-foreground mt-2">{formatDate(new Date(answer.created_at))}</p>
                    </div>
                  ))}
                </div>
              )}
              <div className="space-y-2">
                <h4 className="font-medium">
                  {selectedQuestion.answers && selectedQuestion.answers.length > 0 ? "추가 답변" : "답변 작성"}
                </h4>
                <Textarea
                  value={answerContent}
                  onChange={(e) => setAnswerContent(e.target.value)}
                  placeholder="답변을 작성해주세요..."
                  className="min-h-[150px]"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setShowAnswerDialog(false)
                  setAnswerContent("")
                }}
              >
                취소
              </Button>
              <Button onClick={() => handleSubmitAnswer(selectedQuestion.id)} disabled={isSubmitting}>
                {isSubmitting ? "제출 중..." : "답변 제출"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* 삭제 확인 다이얼로그 */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>질문 삭제</AlertDialogTitle>
            <AlertDialogDescription>
              정말로 이 질문을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setQuestionToDelete(null)}>취소</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteQuestion}
              disabled={isSubmitting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isSubmitting ? "삭제 중..." : "삭제"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
