import { notFound } from "next/navigation"
import Link from "next/link"
import { createSupabaseServer } from "@/utils/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { formatDate } from "@/lib/utils"
import { ArrowLeft } from "lucide-react"
import AnswerForm from "@/components/answer-form"
import QuestionActions from "@/components/qna/question-actions"

export const dynamic = "force-dynamic"

export default async function QuestionDetailPage({ params }: { params: { id: string } }) {
  const supabase = createSupabaseServer()

  // 질문 상세 정보 가져오기 (사용자 프로필 정보 포함)
  const { data: question, error } = await supabase
    .from("questions")
    .select(`
      *, 
      profiles(id, full_name, email),
      answers(*, profiles(id, full_name, email, is_admin))
    `)
    .eq("id", params.id)
    .single()

  if (error || !question) {
    console.error("Error fetching question:", error)
    notFound()
  }

  // 현재 로그인한 사용자 정보 가져오기
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // 현재 사용자가 질문 작성자인지 확인
  const isAuthor = user && user.id === question.user_id

  // 현재 사용자가 관리자인지 확인
  let isAdmin = false
  if (user) {
    const { data } = await supabase.from("profiles").select("is_admin").eq("id", user.id).single()
    isAdmin = data?.is_admin || false
  }

  const answers = question.answers || []

  // 사용자 이름 가져오기 (full_name이 없으면 이메일 사용, 둘 다 없으면 "익명 사용자")
  const getUserName = (profile: any) => {
    if (!profile) return "익명 사용자"
    return profile.full_name || profile.email?.split("@")[0] || "익명 사용자"
  }

  // 아바타 이니셜 가져오기
  const getInitials = (profile: any) => {
    if (!profile) return "?"
    if (profile.full_name) return profile.full_name.charAt(0).toUpperCase()
    if (profile.email) return profile.email.charAt(0).toUpperCase()
    return "?"
  }

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-24 px-4 md:px-8 relative overflow-hidden">
        {/* 배경 효과 */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-background" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full -translate-y-1/3 translate-x-1/3 blur-3xl" />

        <div className="container-width relative z-10">
          <div className="mb-6 flex justify-between items-center">
            <Button asChild variant="outline" size="sm">
              <Link href="/qna" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                질문 목록으로
              </Link>
            </Button>
          </div>

          <div className="max-w-3xl mx-auto">
            <Card className="mb-6">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl">{question.title}</CardTitle>
                    <CardDescription className="mt-2">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback>{getInitials(question.profiles)}</AvatarFallback>
                        </Avatar>
                        <span>{getUserName(question.profiles)}</span>
                        <span>•</span>
                        <span>{question.category}</span>
                        <span>•</span>
                        <span>{formatDate(new Date(question.created_at))}</span>
                      </div>
                    </CardDescription>
                  </div>
                  {isAuthor && <QuestionActions questionId={question.id} hasAnswers={answers.length > 0} />}
                </div>
              </CardHeader>
              <CardContent>
                <div className="whitespace-pre-wrap">{question.content}</div>
              </CardContent>
            </Card>

            {answers.length > 0 ? (
              <div className="mb-6">
                <h2 className="text-xl font-bold mb-4">답변</h2>
                {answers.map((answer) => (
                  <Card key={answer.id} className="mb-4 border-primary">
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback>{getInitials(answer.profiles)}</AvatarFallback>
                        </Avatar>
                        <CardTitle className="text-lg">
                          {getUserName(answer.profiles)}
                          {answer.profiles?.is_admin && " (관리자)"}
                        </CardTitle>
                      </div>
                      <CardDescription>{formatDate(new Date(answer.created_at))}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="whitespace-pre-wrap">{answer.content}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="mb-6 text-center py-6 bg-muted rounded-lg">
                <p className="text-muted-foreground">아직 답변이 등록되지 않았습니다.</p>
              </div>
            )}

            {isAdmin && answers.length === 0 && (
              <div className="mb-6">
                <h2 className="text-xl font-bold mb-4">답변 작성</h2>
                <AnswerForm questionId={question.id} />
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
