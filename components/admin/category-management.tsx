"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
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
import { Loader2, Edit, Save, Trash2, Plus, RefreshCw, MoveUp, MoveDown } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Switch } from "@/components/ui/switch"

interface Category {
  id: string
  name: string
  slug: string
  description?: string
  color?: string
  display_order: number
  is_default?: boolean
  count: number
}

export default function CategoryManagement() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null)
  const [newCategory, setNewCategory] = useState<Partial<Category>>({
    name: "",
    description: "",
    color: "#3b82f6",
    is_default: false,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)
  const router = useRouter()
  const { toast } = useToast()

  // 카테고리 목록 가져오기
  const fetchCategories = async () => {
    try {
      setLoading(true)
      // 캐시 방지를 위한 타임스탬프 추가
      const timestamp = new Date().getTime()
      const response = await fetch(`/api/blog/categories?t=${timestamp}`)

      if (!response.ok) {
        throw new Error("카테고리 목록을 가져오는데 실패했습니다.")
      }

      const data = await response.json()

      // API 응답 구조 확인 및 디버깅
      console.log("API 응답 데이터:", data)

      // data.categories가 있는지 확인하고 정렬
      if (data.categories && Array.isArray(data.categories)) {
        // 표시 순서대로 정렬
        const sortedData = data.categories.sort((a: Category, b: Category) => a.display_order - b.display_order)
        setCategories(sortedData)
      } else if (Array.isArray(data)) {
        // 응답이 직접 배열인 경우
        const sortedData = data.sort((a: Category, b: Category) => a.display_order - b.display_order)
        setCategories(sortedData)
      } else {
        console.error("예상치 못한 API 응답 형식:", data)
        setCategories([])
        toast({
          title: "데이터 형식 오류",
          description: "카테고리 데이터 형식이 올바르지 않습니다.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error fetching categories:", error)
      toast({
        title: "카테고리 로드 실패",
        description: "카테고리 목록을 불러오는 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [refreshKey])

  // 카테고리 수정 다이얼로그 열기
  const openEditDialog = (category: Category) => {
    setEditingCategory(category)
    setIsEditDialogOpen(true)
  }

  // 카테고리 삭제 다이얼로그 열기
  const openDeleteDialog = (category: Category) => {
    setCategoryToDelete(category)
    setIsDeleteDialogOpen(true)
  }

  // 카테고리 추가 다이얼로그 열기
  const openAddDialog = () => {
    setNewCategory({
      name: "",
      description: "",
      color: "#3b82f6",
      is_default: false,
    })
    setIsAddDialogOpen(true)
  }

  // 카테고리 수정 취소
  const cancelEdit = () => {
    setEditingCategory(null)
    setIsEditDialogOpen(false)
  }

  // 카테고리 삭제 취소
  const cancelDelete = () => {
    setCategoryToDelete(null)
    setIsDeleteDialogOpen(false)
  }

  // 카테고리 추가 취소
  const cancelAdd = () => {
    setNewCategory({
      name: "",
      description: "",
      color: "#3b82f6",
      is_default: false,
    })
    setIsAddDialogOpen(false)
  }

  // 목록 새로고침
  const refreshCategories = () => {
    setRefreshKey((prev) => prev + 1)
  }

  // 카테고리 순서 변경
  const moveCategory = async (category: Category, direction: "up" | "down") => {
    const currentIndex = categories.findIndex((c) => c.id === category.id)
    if (
      (direction === "up" && currentIndex === 0) ||
      (direction === "down" && currentIndex === categories.length - 1)
    ) {
      return // 이미 맨 위나 맨 아래에 있으면 이동 불가
    }

    const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1
    const targetCategory = categories[newIndex]

    try {
      // 현재 카테고리 순서 업데이트
      const response1 = await fetch("/api/blog/categories", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: category.id,
          name: category.name,
          slug: category.slug,
          description: category.description,
          color: category.color,
          display_order: targetCategory.display_order,
          is_default: category.is_default,
        }),
      })

      if (!response1.ok) {
        const data = await response1.json()
        throw new Error(data.error || "카테고리 순서 변경에 실패했습니다.")
      }

      // 대상 카테고리 순서 업데이트
      const response2 = await fetch("/api/blog/categories", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: targetCategory.id,
          name: targetCategory.name,
          slug: targetCategory.slug,
          description: targetCategory.description,
          color: targetCategory.color,
          display_order: category.display_order,
          is_default: targetCategory.is_default,
        }),
      })

      if (!response2.ok) {
        const data = await response2.json()
        throw new Error(data.error || "카테고리 순서 변경에 실패했습니다.")
      }

      // 카테고리 목록 새로고침
      refreshCategories()
    } catch (error) {
      console.error("Error moving category:", error)
      toast({
        title: "카테고리 순서 변경 실패",
        description: error instanceof Error ? error.message : "카테고리 순서를 변경하는 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    }
  }

  // 카테고리 수정 저장
  const saveCategory = async () => {
    if (!editingCategory) return

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/blog/categories", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: editingCategory.id,
          name: editingCategory.name,
          slug: editingCategory.slug,
          description: editingCategory.description,
          color: editingCategory.color,
          display_order: editingCategory.display_order,
          is_default: editingCategory.is_default,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "카테고리 수정에 실패했습니다.")
      }

      toast({
        title: "카테고리 수정 성공",
        description: data.message || `카테고리가 성공적으로 수정되었습니다.`,
      })

      // 다이얼로그 닫기
      cancelEdit()

      // 카테고리 목록 새로고침
      refreshCategories()

      // 페이지 새로고침
      router.refresh()
    } catch (error) {
      console.error("Error updating category:", error)
      toast({
        title: "카테고리 수정 실패",
        description: error instanceof Error ? error.message : "카테고리를 수정하는 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // 카테고리 삭제
  const deleteCategory = async () => {
    if (!categoryToDelete) return

    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/blog/categories?id=${encodeURIComponent(categoryToDelete.id)}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "카테고리 삭제에 실패했습니다.")
      }

      toast({
        title: "카테고리 삭제 성공",
        description: data.message || `'${categoryToDelete.name}' 카테고리가 삭제되었습니다.`,
      })

      // 다이얼로그 닫기
      cancelDelete()

      // 카테고리 목록 새로고침
      refreshCategories()

      // 페이지 새로고침
      router.refresh()
    } catch (error) {
      console.error("Error deleting category:", error)
      toast({
        title: "카테고리 삭제 실패",
        description: error instanceof Error ? error.message : "카테고리를 삭제하는 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // 카테고리 추가
  const addCategory = async () => {
    if (!newCategory.name?.trim()) return

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/blog/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newCategory.name.trim(),
          description: newCategory.description,
          color: newCategory.color,
          is_default: newCategory.is_default,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "카테고리 추가에 실패했습니다.")
      }

      toast({
        title: "카테고리 추가 성공",
        description: data.message || `'${newCategory.name.trim()}' 카테고리가 추가되었습니다.`,
      })

      // 다이얼로그 닫기
      cancelAdd()

      // 카테고리 목록 새로고침
      refreshCategories()

      // 페이지 새로고침
      router.refresh()
    } catch (error) {
      console.error("Error adding category:", error)
      toast({
        title: "카테고리 추가 실패",
        description: error instanceof Error ? error.message : "카테고리를 추가하는 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>블로그 카테고리 관리</CardTitle>
          <CardDescription>블로그 포스트의 카테고리를 관리합니다.</CardDescription>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={refreshCategories} disabled={loading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            새로고침
          </Button>
          <Button onClick={openAddDialog}>
            <Plus className="mr-2 h-4 w-4" />
            카테고리 추가
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-2">
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>카테고리 이름</TableHead>
                  <TableHead>설명</TableHead>
                  <TableHead>게시글 수</TableHead>
                  <TableHead className="w-[200px] text-right">작업</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.length > 0 ? (
                  categories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: category.color || "#3b82f6" }}
                          ></div>
                          {category.name}
                          {category.is_default && (
                            <span className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded">기본</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">{category.description || "-"}</TableCell>
                      <TableCell>{category.count}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  onClick={() => moveCategory(category, "up")}
                                  disabled={categories.indexOf(category) === 0}
                                >
                                  <MoveUp className="h-4 w-4" />
                                  <span className="sr-only">위로</span>
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>카테고리 순서 위로 이동</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>

                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  onClick={() => moveCategory(category, "down")}
                                  disabled={categories.indexOf(category) === categories.length - 1}
                                >
                                  <MoveDown className="h-4 w-4" />
                                  <span className="sr-only">아래로</span>
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>카테고리 순서 아래로 이동</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>

                          <Button size="icon" variant="ghost" onClick={() => openEditDialog(category)} className="mr-1">
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">수정</span>
                          </Button>

                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span>
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={() => openDeleteDialog(category)}
                                    disabled={category.count > 0 || category.is_default}
                                    className={
                                      category.count > 0 || category.is_default ? "cursor-not-allowed opacity-50" : ""
                                    }
                                  >
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                    <span className="sr-only">삭제</span>
                                  </Button>
                                </span>
                              </TooltipTrigger>
                              {category.is_default ? (
                                <TooltipContent>기본 카테고리는 삭제할 수 없습니다</TooltipContent>
                              ) : category.count > 0 ? (
                                <TooltipContent>게시글이 있는 카테고리는 삭제할 수 없습니다</TooltipContent>
                              ) : null}
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                      등록된 카테고리가 없습니다.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>

      {/* 카테고리 수정 다이얼로그 */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>카테고리 수정</DialogTitle>
            <DialogDescription>
              카테고리 정보를 변경합니다. 이 작업은 해당 카테고리의 모든 블로그 포스트에 영향을 줍니다.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="categoryName">카테고리 이름</Label>
              <Input
                id="categoryName"
                value={editingCategory?.name || ""}
                onChange={(e) =>
                  setEditingCategory(editingCategory ? { ...editingCategory, name: e.target.value } : null)
                }
                placeholder="카테고리 이름"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="categoryDescription">설명 (선택사항)</Label>
              <Input
                id="categoryDescription"
                value={editingCategory?.description || ""}
                onChange={(e) =>
                  setEditingCategory(editingCategory ? { ...editingCategory, description: e.target.value } : null)
                }
                placeholder="카테고리 설명"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="categoryColor">색상</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="categoryColor"
                  type="color"
                  value={editingCategory?.color || "#3b82f6"}
                  onChange={(e) =>
                    setEditingCategory(editingCategory ? { ...editingCategory, color: e.target.value } : null)
                  }
                  className="w-12 h-10 p-1"
                />
                <Input
                  value={editingCategory?.color || "#3b82f6"}
                  onChange={(e) =>
                    setEditingCategory(editingCategory ? { ...editingCategory, color: e.target.value } : null)
                  }
                  placeholder="#HEX"
                  className="flex-1"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="is-default"
                checked={editingCategory?.is_default || false}
                onCheckedChange={(checked) =>
                  setEditingCategory(editingCategory ? { ...editingCategory, is_default: checked } : null)
                }
              />
              <Label htmlFor="is-default">기본 카테고리로 설정</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={cancelEdit} disabled={isSubmitting}>
              취소
            </Button>
            <Button onClick={saveCategory} disabled={isSubmitting || !editingCategory?.name?.trim()}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  저장 중...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  저장
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 카테고리 추가 다이얼로그 */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>카테고리 추가</DialogTitle>
            <DialogDescription>
              새 카테고리를 추가합니다. 추가된 카테고리는 블로그 포스트 작성 시 선택할 수 있습니다.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="addCategoryName">카테고리 이름</Label>
              <Input
                id="addCategoryName"
                value={newCategory.name || ""}
                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                placeholder="새 카테고리 이름"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="addCategoryDescription">설명 (선택사항)</Label>
              <Input
                id="addCategoryDescription"
                value={newCategory.description || ""}
                onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                placeholder="카테고리 설명"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="addCategoryColor">색상</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="addCategoryColor"
                  type="color"
                  value={newCategory.color || "#3b82f6"}
                  onChange={(e) => setNewCategory({ ...newCategory, color: e.target.value })}
                  className="w-12 h-10 p-1"
                />
                <Input
                  value={newCategory.color || "#3b82f6"}
                  onChange={(e) => setNewCategory({ ...newCategory, color: e.target.value })}
                  placeholder="#HEX"
                  className="flex-1"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="add-is-default"
                checked={newCategory.is_default || false}
                onCheckedChange={(checked) => setNewCategory({ ...newCategory, is_default: checked })}
              />
              <Label htmlFor="add-is-default">기본 카테고리로 설정</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={cancelAdd} disabled={isSubmitting}>
              취소
            </Button>
            <Button onClick={addCategory} disabled={isSubmitting || !newCategory.name?.trim()}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  추가 중...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  추가
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 카테고리 삭제 확인 다이얼로그 */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>카테고리 삭제</AlertDialogTitle>
            <AlertDialogDescription>
              '{categoryToDelete?.name}' 카테고리를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelDelete} disabled={isSubmitting}>
              취소
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={deleteCategory}
              disabled={isSubmitting}
              className="bg-destructive text-destructive-foreground"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  삭제 중...
                </>
              ) : (
                "삭제"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  )
}
