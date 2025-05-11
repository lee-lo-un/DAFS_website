"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
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
import { formatDate } from "@/lib/utils"
import { Pencil, Trash2, Plus } from "lucide-react"
import { createSupabaseClient } from "@/utils/supabase/client"

type Notice = {
  id: number
  title: string
  content: string
  pinned: boolean
  published_at: string
  author_id: string
}

export default function NoticeManagement() {
  const supabase = createSupabaseClient()
  const { toast } = useToast()

  const [notices, setNotices] = useState<Notice[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentNotice, setCurrentNotice] = useState<Notice | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    pinned: false,
  })

  // 공지사항 목록 불러오기
  const fetchNotices = async () => {
    if (!supabase) {
      console.error("Supabase 클라이언트가 초기화되지 않았습니다")
      toast({
        title: "오류",
        description: "데이터베이스 연결에 실패했습니다.",
        variant: "destructive",
      })
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      const { data, error } = await supabase
        .from("notices")
        .select("*")
        .order("pinned", { ascending: false })
        .order("published_at", { ascending: false })

      if (error) throw error
      setNotices(data || [])
    } catch (error) {
      console.error("공지사항 불러오기 오류:", error)
      toast({
        title: "오류",
        description: "공지사항을 불러오는 중 문제가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // 컴포넌트 마운트 시 공지사항 불러오기
  useEffect(() => {
    fetchNotices()
  }, [])

  // 공지사항 생성 또는 수정
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!supabase) {
      toast({
        title: "오류",
        description: "데이터베이스 연결에 실패했습니다.",
        variant: "destructive",
      })
      return
    }

    try {
      const { data: sessionData } = await supabase.auth.getSession()

      if (!sessionData.session) {
        toast({
          title: "인증 오류",
          description: "로그인이 필요합니다.",
          variant: "destructive",
        })
        return
      }

      const userId = sessionData.session.user.id

      if (currentNotice) {
        // 공지사항 수정
        const { error } = await supabase
          .from("notices")
          .update({
            title: formData.title,
            content: formData.content,
            pinned: formData.pinned,
          })
          .eq("id", currentNotice.id)

        if (error) throw error

        toast({
          title: "성공",
          description: "공지사항이 수정되었습니다.",
        })
      } else {
        // 새 공지사항 생성
        const { error } = await supabase.from("notices").insert({
          title: formData.title,
          content: formData.content,
          pinned: formData.pinned,
          author_id: userId,
          published_at: new Date().toISOString(), // 명시적으로 현재 시간 설정
        })

        if (error) {
          console.error("공지사항 생성 오류:", error)
          throw error
        }

        toast({
          title: "성공",
          description: "새 공지사항이 등록되었습니다.",
        })
      }

      // 폼 초기화 및 다이얼로그 닫기
      setFormData({ title: "", content: "", pinned: false })
      setCurrentNotice(null)
      setIsDialogOpen(false)
      fetchNotices()
    } catch (error) {
      console.error("공지사항 저장 오류:", error)
      toast({
        title: "오류",
        description: "공지사항을 저장하는 중 문제가 발생했습니다.",
        variant: "destructive",
      })
    }
  }

  // 공지사항 삭제
  const handleDelete = async () => {
    if (!currentNotice || !supabase) return

    try {
      const { error } = await supabase.from("notices").delete().eq("id", currentNotice.id)

      if (error) throw error

      toast({
        title: "성공",
        description: "공지사항이 삭제되었습니다.",
      })

      setIsDeleteDialogOpen(false)
      setCurrentNotice(null)
      fetchNotices()
    } catch (error) {
      console.error("공지사항 삭제 오류:", error)
      toast({
        title: "오류",
        description: "공지사항을 삭제하는 중 문제가 발생했습니다.",
        variant: "destructive",
      })
    }
  }

  // 공지사항 수정 다이얼로그 열기
  const openEditDialog = (notice: Notice) => {
    setCurrentNotice(notice)
    setFormData({
      title: notice.title,
      content: notice.content,
      pinned: notice.pinned,
    })
    setIsDialogOpen(true)
  }

  // 새 공지사항 다이얼로그 열기
  const openNewDialog = () => {
    setCurrentNotice(null)
    setFormData({ title: "", content: "", pinned: false })
    setIsDialogOpen(true)
  }

  // 삭제 다이얼로그 열기
  const openDeleteDialog = (notice: Notice) => {
    setCurrentNotice(notice)
    setIsDeleteDialogOpen(true)
  }

  if (!supabase) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
        <p className="font-medium">데이터베이스 연결 오류</p>
        <p className="mt-2">
          Supabase 클라이언트를 초기화할 수 없습니다. 페이지를 새로고침하거나 관리자에게 문의하세요.
        </p>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">공지사항 목록</h2>
        <Button onClick={openNewDialog} className="flex items-center">
          <Plus className="mr-2 h-4 w-4" /> 새 공지사항
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-10">로딩 중...</div>
      ) : notices.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <p className="text-gray-500">등록된 공지사항이 없습니다.</p>
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    제목
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    작성일
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    고정
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    관리
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {notices.map((notice) => (
                  <tr key={notice.id} className={notice.pinned ? "bg-amber-50" : ""}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{notice.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{formatDate(notice.published_at)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{notice.pinned ? "고정됨" : "일반"}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditDialog(notice)}
                        className="text-blue-600 hover:text-blue-900 mr-2"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openDeleteDialog(notice)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 공지사항 생성/수정 다이얼로그 */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{currentNotice ? "공지사항 수정" : "새 공지사항 작성"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="title" className="text-sm font-medium">
                  제목
                </label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="content" className="text-sm font-medium">
                  내용
                </label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={10}
                  required
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="pinned"
                  checked={formData.pinned}
                  onCheckedChange={(checked) => setFormData({ ...formData, pinned: checked as boolean })}
                />
                <label
                  htmlFor="pinned"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  상단에 고정
                </label>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                취소
              </Button>
              <Button type="submit">저장</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* 삭제 확인 다이얼로그 */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>공지사항 삭제</AlertDialogTitle>
            <AlertDialogDescription>
              정말로 이 공지사항을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              삭제
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
