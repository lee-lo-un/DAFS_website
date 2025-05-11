import type { Metadata } from "next"
import AdminAuthCheck from "@/components/admin/admin-auth-check"
import NoticeManagement from "@/components/admin/notice-management"

export const metadata: Metadata = {
  title: "공지사항 관리 - 모던 풍수 관리자",
  description: "모던 풍수 공지사항을 관리합니다.",
}

export default function AdminNoticesPage() {
  return (
    <AdminAuthCheck>
      <div className="container mx-auto py-10">
        <h1 className="text-2xl font-bold mb-6">공지사항 관리</h1>
        <NoticeManagement />
      </div>
    </AdminAuthCheck>
  )
}
