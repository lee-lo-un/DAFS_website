import { Suspense } from "react"
import QnaClientContent from "@/components/qna/qna-client-content"
import { Skeleton } from "@/components/ui/skeleton"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export const dynamic = "force-dynamic"

export default async function QnaPage({
  searchParams,
}: {
  searchParams: { category?: string; page?: string; per_page?: string }
}) {
  const params = searchParams;
  const supabase = createServerComponentClient({ cookies })

  // 질문 목록 가져오기 (profiles 테이블 조인 포함)
  const { data: questions, error } = await supabase
    .from("questions")
    .select(`
      id, 
      title, 
      content, 
      category, 
      created_at, 
      user_id,
      profiles(id, full_name, email),
      answers(id, content, admin_id, created_at, profiles(id, full_name, email, is_admin))
    `)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching questions:", error)
  }

  // 현재 로그인한 사용자 정보 가져오기
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // 자주 묻는 질문 (하드코딩)
  const faqs = [
    {
      question: "풍수 컨설팅은 어떤 과정으로 진행되나요?",
      answer:
        "초기 상담 → 현장 방문 및 분석 → 맞춤형 솔루션 제안 → 적용 및 사후 관리의 과정으로 진행됩니다. 각 단계마다 고객과의 충분한 소통을 통해 최적의 결과를 도출합니다.",
    },
    {
      question: "풍수 컨설팅의 효과는 언제 나타나나요?",
      answer:
        "공간의 에너지 흐름 개선은 즉각적으로 시작되지만, 가시적인 변화는 개인과 환경에 따라 다르게 나타납니다. 일반적으로 3개월 이내에 긍정적인 변화를 경험하시게 됩니다.",
    },
    {
      question: "원격으로도 풍수 컨설팅이 가능한가요?",
      answer:
        "네, 가능합니다. 도면과 사진을 통한 원격 컨설팅 서비스를 제공하고 있습니다. 다만, 보다 정확한 분석을 위해서는 현장 방문을 권장드립니다.",
    },
    {
      question: "풍수 컨설팅 비용은 어떻게 되나요?",
      answer:
        "컨설팅 비용은 공간의 크기, 용도, 필요한 서비스 수준에 따라 달라집니다. 기본 주거 공간 컨설팅은 15만원부터 시작하며, 자세한 내용은 서비스 페이지에서 확인하실 수 있습니다.",
    },
    {
      question: "풍수 컨설팅 후 추가 비용이 발생하나요?",
      answer:
        "기본 컨설팅 비용 외에 추가 비용은 발생하지 않습니다. 다만, 제안된 솔루션을 실행하기 위한 인테리어 변경이나 가구 구매 등의 비용은 별도입니다.",
    },
  ]

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-24 px-4 md:px-8 relative overflow-hidden">
        {/* 배경 효과 */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-background" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full -translate-y-1/3 translate-x-1/3 blur-3xl" />

        <div className="container-width relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">질문과 답변</h1>
            <p className="text-xl text-foreground/70 mb-8">풍수에 관한 궁금한 점을 질문하고 답변을 받아보세요</p>
          </div>
        </div>
      </section>

      {/* QnA Content Section */}
      <section className="py-16 px-4 md:px-8 relative">
        <div className="container-width relative z-10">
          <Suspense fallback={<Skeleton className="h-[600px] w-full" />}>
            <QnaClientContent faqs={faqs} questions={questions as any || []} currentUser={user as any} />
          </Suspense>
        </div>
      </section>
    </div>
  )
}
