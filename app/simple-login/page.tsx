import SimpleLogin from "@/components/auth/simple-login"

export default function SimpleLoginPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold text-center mb-6">간단 로그인 페이지</h1>
      <SimpleLogin />
    </div>
  )
}
