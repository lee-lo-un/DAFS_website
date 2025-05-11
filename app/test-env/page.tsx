export const dynamic = "force-dynamic"

export default function TestEnvPage() {
  return (
    <div className="container mx-auto py-20">
      <h1 className="text-3xl font-bold mb-6">환경 변수 테스트</h1>

      <div className="bg-gray-100 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Supabase 환경 변수</h2>

        <div className="space-y-4">
          <div>
            <p className="font-medium">NEXT_PUBLIC_SUPABASE_URL:</p>
            <p className="bg-white p-2 rounded border mt-1">
              {process.env.NEXT_PUBLIC_SUPABASE_URL
                ? `${process.env.NEXT_PUBLIC_SUPABASE_URL.substring(0, 8)}...`
                : "설정되지 않음"}
            </p>
          </div>

          <div>
            <p className="font-medium">NEXT_PUBLIC_SUPABASE_ANON_KEY:</p>
            <p className="bg-white p-2 rounded border mt-1">
              {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
                ? `${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.substring(0, 8)}...`
                : "설정되지 않음"}
            </p>
          </div>
        </div>

        <p className="mt-6 text-sm text-gray-600">
          보안을 위해 전체 값은 표시하지 않습니다. 환경 변수가 설정되었는지 확인만 가능합니다.
        </p>
      </div>
    </div>
  )
}
