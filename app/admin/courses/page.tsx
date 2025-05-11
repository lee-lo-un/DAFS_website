"use client"

import AdminAuthCheck from "@/components/admin/admin-auth-check"
import CourseManagement from "@/components/admin/course-management"

export default function AdminCoursesPage() {
  return (
    <main className="min-h-screen pt-24 pb-16">
      <section className="py-8 px-4 md:px-8">
        <div className="container-width mx-auto">
          <h1 className="text-3xl font-bold mb-8">교육 관리</h1>

          <AdminAuthCheck>
            <CourseManagement />
          </AdminAuthCheck>
        </div>
      </section>
    </main>
  )
}
