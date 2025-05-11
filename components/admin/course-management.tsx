"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { createSupabaseClient } from "@/utils/supabase/client"
import { useToast } from "@/components/ui/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Loader2, Plus, Edit, Trash2, Check, X, Calendar } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

export default function CourseManagement() {
  const [loading, setLoading] = useState(true)
  const [courses, setCourses] = useState<any[]>([])
  const [applications, setApplications] = useState<any[]>([])
  const [selectedCourse, setSelectedCourse] = useState<any>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    curriculum: "",
    target_audience: "",
    start_date: "",
    end_date: "",
    time: "",
    location: "",
    price: 0,
    max_attendees: 0,
    is_active: true,
    category: "정규과정",
  })
  const { toast } = useToast()

  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = async () => {
    setLoading(true)
    try {
      const supabase = createSupabaseClient()
      const { data, error } = await supabase
        .from("fengshui_courses")
        .select("*")
        .order("start_date", { ascending: false })

      if (error) throw error
      setCourses(data || [])
    } catch (error: any) {
      toast({
        title: "교육 과정 로드 실패",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchApplications = async (courseId: number) => {
    try {
      const supabase = createSupabaseClient()
      const { data, error } = await supabase
        .from("course_applications")
        .select(`
          *,
          profiles:user_id (
            full_name,
            email
          )
        `)
        .eq("course_id", courseId)
        .order("submitted_at", { ascending: false })

      if (error) throw error
      setApplications(data || [])
    } catch (error: any) {
      toast({
        title: "신청자 목록 로드 실패",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" || name === "max_attendees" ? Number.parseInt(value) || 0 : value,
    }))
  }

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const supabase = createSupabaseClient()

      if (selectedCourse) {
        // 수정
        const { error } = await supabase
          .from("fengshui_courses")
          .update({
            ...formData,
            updated_at: new Date().toISOString(),
          })
          .eq("id", selectedCourse.id)

        if (error) throw error

        toast({
          title: "교육 과정 수정 완료",
          description: "교육 과정이 성공적으로 수정되었습니다.",
        })
      } else {
        // 신규 등록
        const { data: userData } = await supabase.auth.getUser()

        const { error } = await supabase.from("fengshui_courses").insert({
          ...formData,
          created_by: userData.user?.id,
        })

        if (error) throw error

        toast({
          title: "교육 과정 등록 완료",
          description: "새 교육 과정이 성공적으로 등록되었습니다.",
        })
      }

      // 폼 초기화 및 다이얼로그 닫기
      resetForm()
      setIsDialogOpen(false)

      // 목록 새로고침
      fetchCourses()
    } catch (error: any) {
      toast({
        title: "교육 과정 저장 실패",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (course: any) => {
    setSelectedCourse(course)
    setFormData({
      title: course.title || "",
      description: course.description || "",
      curriculum: course.curriculum || "",
      target_audience: course.target_audience || "",
      start_date: course.start_date ? new Date(course.start_date).toISOString().split("T")[0] : "",
      end_date: course.end_date ? new Date(course.end_date).toISOString().split("T")[0] : "",
      time: course.time || "",
      location: course.location || "",
      price: course.price || 0,
      max_attendees: course.max_attendees || 0,
      is_active: course.is_active,
      category: course.category || "정규과정",
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (courseId: number) => {
    if (!confirm("정말 이 교육 과정을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.")) {
      return
    }

    try {
      const supabase = createSupabaseClient()
      const { error } = await supabase.from("fengshui_courses").delete().eq("id", courseId)

      if (error) throw error

      toast({
        title: "교육 과정 삭제 완료",
        description: "교육 과정이 성공적으로 삭제되었습니다.",
      })

      // 목록 새로고침
      fetchCourses()
    } catch (error: any) {
      toast({
        title: "교육 과정 삭제 실패",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const handleViewApplications = (course: any) => {
    setSelectedCourse(course)
    fetchApplications(course.id)
  }

  const handleUpdateStatus = async (applicationId: number, status: string) => {
    try {
      const supabase = createSupabaseClient()
      const { error } = await supabase.from("course_applications").update({ status }).eq("id", applicationId)

      if (error) throw error

      toast({
        title: "상태 변경 완료",
        description: `신청 상태가 ${status}(으)로 변경되었습니다.`,
      })

      // 신청자 목록 새로고침
      if (selectedCourse) {
        fetchApplications(selectedCourse.id)
      }
    } catch (error: any) {
      toast({
        title: "상태 변경 실패",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const resetForm = () => {
    setSelectedCourse(null)
    setFormData({
      title: "",
      description: "",
      curriculum: "",
      target_audience: "",
      start_date: "",
      end_date: "",
      time: "",
      location: "",
      price: 0,
      max_attendees: 0,
      is_active: true,
      category: "정규과정",
    })
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("ko-KR")
  }

  return (
    <div>
      <Tabs defaultValue="courses">
        <div className="flex justify-between items-center mb-6">
          <TabsList>
            <TabsTrigger value="courses">교육 과정 관리</TabsTrigger>
            <TabsTrigger value="applications" disabled={!selectedCourse}>
              신청자 관리 {selectedCourse && `(${selectedCourse.title})`}
            </TabsTrigger>
          </TabsList>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  resetForm()
                  setIsDialogOpen(true)
                }}
              >
                <Plus className="mr-2 h-4 w-4" />새 교육 과정
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{selectedCourse ? "교육 과정 수정" : "새 교육 과정 등록"}</DialogTitle>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-4 md:col-span-2">
                    <div>
                      <label htmlFor="title" className="block text-sm font-medium mb-1">
                        교육 제목 <span className="text-red-500">*</span>
                      </label>
                      <Input id="title" name="title" value={formData.title} onChange={handleInputChange} required />
                    </div>

                    <div>
                      <label htmlFor="category" className="block text-sm font-medium mb-1">
                        카테고리 <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className="w-full rounded-md border border-input bg-background px-3 py-2"
                        required
                      >
                        <option value="정규과정">정규과정</option>
                        <option value="워크샵">워크샵</option>
                        <option value="세미나">세미나</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="start_date" className="block text-sm font-medium mb-1">
                      시작일 <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="start_date"
                      name="start_date"
                      type="date"
                      value={formData.start_date}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="end_date" className="block text-sm font-medium mb-1">
                      종료일
                    </label>
                    <Input
                      id="end_date"
                      name="end_date"
                      type="date"
                      value={formData.end_date}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div>
                    <label htmlFor="time" className="block text-sm font-medium mb-1">
                      교육 시간
                    </label>
                    <Input
                      id="time"
                      name="time"
                      value={formData.time}
                      onChange={handleInputChange}
                      placeholder="예: 매주 수요일 10:00~12:00"
                    />
                  </div>

                  <div>
                    <label htmlFor="location" className="block text-sm font-medium mb-1">
                      교육 장소
                    </label>
                    <Input
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      placeholder="예: 서울시 강남구 또는 Zoom 온라인"
                    />
                  </div>

                  <div>
                    <label htmlFor="price" className="block text-sm font-medium mb-1">
                      수강료
                    </label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      value={formData.price}
                      onChange={handleInputChange}
                      min={0}
                    />
                  </div>

                  <div>
                    <label htmlFor="max_attendees" className="block text-sm font-medium mb-1">
                      최대 인원
                    </label>
                    <Input
                      id="max_attendees"
                      name="max_attendees"
                      type="number"
                      value={formData.max_attendees}
                      onChange={handleInputChange}
                      min={0}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="is_active"
                        checked={formData.is_active}
                        onCheckedChange={(checked) => handleCheckboxChange("is_active", checked as boolean)}
                      />
                      <label
                        htmlFor="is_active"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        신청 가능 상태
                      </label>
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label htmlFor="description" className="block text-sm font-medium mb-1">
                      교육 소개
                    </label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={4}
                      placeholder="교육 과정에 대한 간략한 소개를 입력하세요"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label htmlFor="curriculum" className="block text-sm font-medium mb-1">
                      커리큘럼
                    </label>
                    <Textarea
                      id="curriculum"
                      name="curriculum"
                      value={formData.curriculum}
                      onChange={handleInputChange}
                      rows={6}
                      placeholder="교육 과정의 상세 커리큘럼을 입력하세요"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label htmlFor="target_audience" className="block text-sm font-medium mb-1">
                      교육 대상
                    </label>
                    <Textarea
                      id="target_audience"
                      name="target_audience"
                      value={formData.target_audience}
                      onChange={handleInputChange}
                      rows={3}
                      placeholder="이 교육의 대상자에 대한 설명을 입력하세요"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      resetForm()
                      setIsDialogOpen(false)
                    }}
                  >
                    취소
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        저장 중...
                      </>
                    ) : (
                      "저장"
                    )}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <TabsContent value="courses" className="space-y-4">
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
            </div>
          ) : courses.length === 0 ? (
            <div className="text-center py-8 text-gray-500">등록된 교육 과정이 없습니다.</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>교육 제목</TableHead>
                    <TableHead>카테고리</TableHead>
                    <TableHead>기간</TableHead>
                    <TableHead>수강료</TableHead>
                    <TableHead>신청 현황</TableHead>
                    <TableHead>상태</TableHead>
                    <TableHead className="text-right">관리</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {courses.map((course) => (
                    <TableRow key={course.id}>
                      <TableCell className="font-medium">{course.title}</TableCell>
                      <TableCell>{course.category}</TableCell>
                      <TableCell>
                        {formatDate(course.start_date)}
                        {course.end_date && ` ~ ${formatDate(course.end_date)}`}
                      </TableCell>
                      <TableCell>{course.price === 0 ? "무료" : `${course.price.toLocaleString()}원`}</TableCell>
                      <TableCell>
                        {course.max_attendees
                          ? `${course.current_attendees}/${course.max_attendees}명`
                          : `${course.current_attendees}명`}
                      </TableCell>
                      <TableCell>
                        {course.is_active ? (
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">신청 가능</span>
                        ) : (
                          <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs">마감</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button variant="outline" size="sm" onClick={() => handleViewApplications(course)}>
                            <Calendar className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleEdit(course)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleDelete(course.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>

        <TabsContent value="applications" className="space-y-4">
          {!selectedCourse ? (
            <div className="text-center py-8 text-gray-500">교육 과정을 선택하여 신청자 목록을 확인하세요.</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>신청자</TableHead>
                    <TableHead>연락처</TableHead>
                    <TableHead>이메일</TableHead>
                    <TableHead>신청일</TableHead>
                    <TableHead>상태</TableHead>
                    <TableHead>메모</TableHead>
                    <TableHead className="text-right">관리</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {applications.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-4 text-gray-500">
                        신청자가 없습니다.
                      </TableCell>
                    </TableRow>
                  ) : (
                    applications.map((app) => (
                      <TableRow key={app.id}>
                        <TableCell className="font-medium">{app.full_name}</TableCell>
                        <TableCell>{app.phone}</TableCell>
                        <TableCell>{app.email}</TableCell>
                        <TableCell>{new Date(app.submitted_at).toLocaleString("ko-KR")}</TableCell>
                        <TableCell>
                          {app.status === "pending" && (
                            <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">대기중</span>
                          )}
                          {app.status === "approved" && (
                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">승인됨</span>
                          )}
                          {app.status === "rejected" && (
                            <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs">거절됨</span>
                          )}
                          {app.status === "canceled" && (
                            <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs">취소됨</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {app.memo ? (
                            <div className="max-w-xs truncate" title={app.memo}>
                              {app.memo}
                            </div>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            {app.status !== "approved" && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="bg-green-50 hover:bg-green-100"
                                onClick={() => handleUpdateStatus(app.id, "approved")}
                              >
                                <Check className="h-4 w-4 text-green-600" />
                              </Button>
                            )}
                            {app.status !== "rejected" && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="bg-red-50 hover:bg-red-100"
                                onClick={() => handleUpdateStatus(app.id, "rejected")}
                              >
                                <X className="h-4 w-4 text-red-600" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
