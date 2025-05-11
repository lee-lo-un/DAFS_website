"use client"

import { useState } from "react"
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
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { formatDate } from "@/lib/utils"
import { ArrowLeft, Search } from "lucide-react"
import Link from "next/link"

interface User {
  id: string
  email: string
  full_name: string | null
  is_admin: boolean
  created_at: string
}

interface UserManagementProps {
  users?: User[]
}

export default function UserManagement({ users = [] }: UserManagementProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [usersState, setUsersState] = useState<User[]>(users)
  const [searchTerm, setSearchTerm] = useState("")
  const [isUpdating, setIsUpdating] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const supabase = createSupabaseClient()

  // 검색 필터링
  const filteredUsers =
    usersState?.filter(
      (user) =>
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()),
    ) || []

  // 관리자 권한 변경
  const handleAdminToggle = async (userId: string, isAdmin: boolean) => {
    setIsUpdating(true)

    try {
      const { error } = await supabase.from("profiles").update({ is_admin: isAdmin }).eq("id", userId)

      if (error) throw error

      setUsersState(usersState.map((user) => (user.id === userId ? { ...user, is_admin: isAdmin } : user)))

      toast({
        title: "권한 변경 성공",
        description: `사용자 권한이 ${isAdmin ? "관리자로" : "일반 사용자로"} 변경되었습니다.`,
      })
    } catch (error: any) {
      toast({
        title: "권한 변경 실패",
        description: error.message || "권한을 변경하는 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-24 px-4 md:px-8 relative overflow-hidden">
        {/* 배경 효과 */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-background" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full -translate-y-1/3 translate-x-1/3 blur-3xl" />

        <div className="container-width relative z-10">
          <div className="mb-6">
            <Button asChild variant="outline" size="sm">
              <Link href="/admin" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                대시보드로 돌아가기
              </Link>
            </Button>
          </div>
          <div className="max-w-5xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">사용자 관리</h1>
            <p className="text-xl text-foreground/70 mb-8">사용자 목록을 확인하고 권한을 관리할 수 있습니다.</p>
          </div>
        </div>
      </section>

      {/* User Management Section */}
      <section className="py-16 px-4 md:px-8 relative">
        <div className="container-width relative z-10">
          <div className="max-w-5xl mx-auto">
            {/* 검색 필드 */}
            <div className="mb-6 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="이메일 또는 이름으로 검색"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* 사용자 테이블 */}
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>이메일</TableHead>
                    <TableHead>이름</TableHead>
                    <TableHead>가입일</TableHead>
                    <TableHead>관리자 권한</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.full_name || "-"}</TableCell>
                        <TableCell>{formatDate(new Date(user.created_at))}</TableCell>
                        <TableCell>
                          <Dialog>
                            <DialogTrigger asChild>
                              <div className="flex items-center space-x-2">
                                <Switch
                                  checked={user.is_admin}
                                  onCheckedChange={() => setSelectedUser(user)}
                                  disabled={isUpdating}
                                />
                                <span>{user.is_admin ? "관리자" : "일반 사용자"}</span>
                              </div>
                            </DialogTrigger>
                            {selectedUser && selectedUser.id === user.id && (
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>관리자 권한 변경</DialogTitle>
                                  <DialogDescription>
                                    {selectedUser.email} 사용자의 관리자 권한을{" "}
                                    {selectedUser.is_admin ? "해제" : "부여"}하시겠습니까?
                                  </DialogDescription>
                                </DialogHeader>
                                <DialogFooter>
                                  <Button variant="outline" onClick={() => setSelectedUser(null)}>
                                    취소
                                  </Button>
                                  <Button
                                    onClick={() => {
                                      handleAdminToggle(selectedUser.id, !selectedUser.is_admin)
                                      setSelectedUser(null)
                                    }}
                                    variant={selectedUser.is_admin ? "destructive" : "default"}
                                  >
                                    {selectedUser.is_admin ? "권한 해제" : "권한 부여"}
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            )}
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-4">
                        {searchTerm ? "검색 결과가 없습니다." : "등록된 사용자가 없습니다."}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
