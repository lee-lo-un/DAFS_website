import { createSupabaseServerClient } from "@/utils/supabase/server"

// 동적 렌더링 설정
export const dynamic = "force-dynamic"

export default async function EnvCheckPage() {
  // 환경 변수 확인
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // 연결 테스트
  let connectionTest = { success: false, error: "테스트가 실행되지 않았습니다." }

  try {
    const supabase = createSupabaseServerClient()
    const { data, error } = await supabase.from("profiles").select("count(*)", { count: "exact", head: true })

    if (error) {
      connectionTest = { success: false, error: error.message }
    } else {
      connectionTest = { success: true, data }
    }
  } catch (error: any) {
    connectionTest = { success: false, error: error.message }
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">환경 변수 및 연결 확인</h1>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">환경 변수 상태</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 border rounded-md">
            <p className="font-medium">NEXT_PUBLIC_SUPABASE_URL</p>
            <p className={supabaseUrl ? "text-green-600" : "text-red-600"}>
              {supabaseUrl ? "설정됨" : "설정되지 않음"}
            </p>
            {supabaseUrl && <p className="text-sm text-gray-500 mt-2 break-all">값: {supabaseUrl}</p>}
          </div>

          <div className="p-4 border rounded-md">
            <p className="font-medium">NEXT_PUBLIC_SUPABASE_ANON_KEY</p>
            <p className={supabaseKey ? "text-green-600" : "text-red-600"}>
              {supabaseKey ? "설정됨" : "설정되지 않음"}
            </p>
            {supabaseKey && (
              <p className="text-sm text-gray-500 mt-2">
                값: {supabaseKey.substring(0, 5)}...{supabaseKey.substring(supabaseKey.length - 5)}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Supabase 연결 테스트</h2>
        <div className="p-4 border rounded-md">
          <p className="font-medium">연결 상태</p>
          <p className={connectionTest.success ? "text-green-600" : "text-red-600"}>
            {connectionTest.success ? "연결 성공" : "연결 실패"}
          </p>
          {!connectionTest.success && <p className="text-sm text-red-500 mt-2">오류: {connectionTest.error}</p>}
          {connectionTest.success && <p className="text-sm text-green-500 mt-2">연결이 정상적으로 작동합니다.</p>}
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">문제 해결 방법</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>Vercel 프로젝트 설정에서 환경 변수가 올바르게 설정되어 있는지 확인하세요.</li>
          <li>로컬에서 개발 중이라면 .env.local 파일에 환경 변수가 올바르게 설정되어 있는지 확인하세요.</li>
          <li>Supabase 프로젝트 설정에서 API 키와 URL이 올바른지 확인하세요.</li>
          <li>Supabase 프로젝트가 활성 상태인지 확인하세요.</li>
        </ul>
      </div>
    </div>
  )
}
