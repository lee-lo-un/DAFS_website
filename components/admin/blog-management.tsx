"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Eye, Pencil, Trash2, Plus, RefreshCw } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog"
import { formatDate } from "@/lib/utils"
import { createSupabaseClient } from "@/utils/supabase/client"
import { useToast } from "@/components/ui/use-toast"

interface Category {
  id: string
  name: string
  slug: string
}

interface BlogPost {
  id: number
  title: string
  content: string
  category_id: string | null
  category?: {
    name: string
  }
  image_url?: string
  published_at: string
}

export default function BlogManagement() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { toast } = useToast()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null)
  const [deletedImages, setDeletedImages] = useState<string[]>([])
  const [failedImages, setFailedImages] = useState<string[]>([])
  const [debugInfo, setDebugInfo] = useState<string>("")
  const [isVerifying, setIsVerifying] = useState(false)

  // 데이터 불러오기
  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    try {
      setLoading(true)
      setError(null)

      const supabase = createSupabaseClient()
      if (!supabase) {
        setError("Supabase 클라이언트 초기화에 실패했습니다")
        setLoading(false)
        return
      }

      console.log("블로그 관리: 데이터 로딩 시작")

      // 카테고리 불러오기
      const { data: categoriesData, error: categoriesError } = await supabase
        .from("categories")
        .select("id, name, slug")
        .order("display_order")

      if (categoriesError) {
        console.error("카테고리 불러오기 오류:", categoriesError)
        setError("카테고리 데이터를 불러오는 중 오류가 발생했습니다")
        setLoading(false)
        return
      }

      setCategories(categoriesData || [])
      console.log("블로그 관리: 카테고리 로딩 완료", categoriesData?.length || 0)

      // 블로그 글 불러오기 - 콘텐츠와 이미지 URL도 함께 가져오기
      const { data: postsData, error: postsError } = await supabase
        .from("blog_posts")
        .select("id, title, content, category_id, image_url, published_at")
        .order("published_at", { ascending: false })

      if (postsError) {
        console.error("글 불러오기 오류:", postsError)
        setError("블로그 포스트 데이터를 불러오는 중 오류가 발생했습니다")
        setLoading(false)
        return
      }

      console.log("블로그 관리: 포스트 로딩 완료", postsData?.length || 0)

      // 카테고리 정보 추가
      const postsWithCategories = postsData.map((post) => {
        if (!post.category_id) {
          return { ...post, category: { name: "일반" } }
        }

        const category = categoriesData?.find((cat) => cat.id === post.category_id)
        return {
          ...post,
          category: category ? { name: category.name } : { name: "일반" },
        }
      })

      setPosts(postsWithCategories || [])
    } catch (error) {
      console.error("데이터 불러오기 오류:", error)
      setError("데이터를 불러오는 중 오류가 발생했습니다")
    } finally {
      setLoading(false)
    }
  }

  // 콘텐츠에서 이미지 URL 추출 (개선된 버전)
  function extractImagesFromContent(content: string): string[] {
    try {
      // img 태그에서 src 속성 추출
      const imgRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi
      const matches = []
      let match

      // 모든 이미지 태그 찾기
      while ((match = imgRegex.exec(content)) !== null) {
        if (match[1] && match[1].includes("supabase.co/storage")) {
          matches.push(match[1])
        }
      }

      console.log("추출된 이미지 URL:", matches)
      return matches
    } catch (error) {
      console.error("이미지 URL 추출 오류:", error)
      return []
    }
  }

  // 이미지 URL에서 스토리지 경로 추출
  function extractStoragePathFromUrl(url: string): { bucket: string; filePath: string } | null {
    const regex = /\/storage\/v1\/object\/public\/([^/]+)\/(.+)$/
    const match = url.match(regex)
    if (!match) {
      console.warn("유효하지 않은 Supabase 이미지 URL입니다:", url)
      return null
    }

    const bucket = match[1] // 예: "images"
    const filePath = match[2] // 예: "blog/filename.jpg"

    return { bucket, filePath }
  }

  // 파일 존재 여부 확인
  async function checkFileExists(supabase: any, bucket: string, filePath: string): Promise<boolean> {
    try {
      // blog/파일명 형식에서 blog 폴더와 파일명 분리
      const parts = filePath.split("/")
      const folder = parts[0] // 'blog'
      const fileName = parts[1] // 파일명

      // 폴더 내 파일 목록 조회
      const { data, error } = await supabase.storage.from(bucket).list(folder)

      if (error) {
        console.error("파일 존재 여부 확인 오류:", error)
        return false
      }

      // 파일명이 목록에 있는지 확인
      return data.some((file: any) => file.name === fileName)
    } catch (error) {
      console.error("파일 존재 여부 확인 중 예외 발생:", error)
      return false
    }
  }

  // 게시물 삭제 핸들러
  async function handleDeletePost() {
    if (!selectedPost) return

    try {
      setIsDeleting(true)
      setDeletedImages([])
      setFailedImages([])
      setDebugInfo("")

      const supabase = createSupabaseClient()
      if (!supabase) {
        throw new Error("Supabase 클라이언트 초기화에 실패했습니다")
      }

      // 세션 확인
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (!session) {
        throw new Error("인증 세션이 없습니다. 다시 로그인해주세요.")
      }

      let debugLog = `게시물 ID ${selectedPost.id} 삭제 시작\n`
      debugLog += `세션 확인 완료: ${session.user.id}\n`

      // 1. 콘텐츠에서 이미지 URL 추출
      const contentImages = extractImagesFromContent(selectedPost.content)
      debugLog += `콘텐츠에서 추출한 이미지: ${contentImages.length}개\n`

      // 2. 대표 이미지가 있으면 추가
      const allImages = [...contentImages]
      if (selectedPost.image_url) {
        debugLog += `대표 이미지 URL: ${selectedPost.image_url}\n`
        allImages.push(selectedPost.image_url)
      }

      // 3. 이미지 삭제
      const deletedImgs: string[] = []
      const failedImgs: string[] = []

      for (const imageUrl of allImages) {
        try {
          debugLog += `\n이미지 삭제 시도: ${imageUrl}\n`

          // 이미지 URL 파싱
          const imageInfo = extractStoragePathFromUrl(imageUrl)
          if (!imageInfo) {
            debugLog += `  URL 파싱 실패\n`
            failedImgs.push(imageUrl)
            continue
          }

          const { bucket, filePath } = imageInfo
          debugLog += `  버킷: ${bucket}, 경로: ${filePath}\n`

          // 이미지 삭제 요청
          const { data, error } = await supabase.storage.from(bucket).remove([filePath])

          if (error) {
            debugLog += `  삭제 오류: ${error.message}\n`
            failedImgs.push(imageUrl)
          } else {
            debugLog += `  삭제 성공: ${JSON.stringify(data)}\n`
            deletedImgs.push(imageUrl)
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : String(error)
          debugLog += `  예외 발생: ${errorMessage}\n`
          failedImgs.push(imageUrl)
        }
      }

      setDeletedImages(deletedImgs)
      setFailedImages(failedImgs)

      // 4. 게시물 삭제
      const { error: deleteError } = await supabase.from("blog_posts").delete().eq("id", selectedPost.id)

      if (deleteError) {
        debugLog += `게시물 삭제 오류: ${deleteError.message}\n`
        throw new Error(`게시물 삭제 오류: ${deleteError.message}`)
      }

      debugLog += `게시물 삭제 성공\n`

      // 5. 성공적으로 삭제된 후 목록 업데이트
      setPosts(posts.filter((p) => p.id !== selectedPost.id))
      setIsDialogOpen(false)

      // 결과 메시지 생성
      let resultMessage = "게시물이 성공적으로 삭제되었습니다."
      if (deletedImgs.length > 0) {
        resultMessage += ` ${deletedImgs.length}개의 이미지가 삭제되었습니다.`
      }
      if (failedImgs.length > 0) {
        resultMessage += ` ${failedImgs.length}개의 이미지 삭제에 실패했습니다.`
      }

      toast({
        title: "삭제 완료",
        description: resultMessage,
      })

      debugLog += `삭제된 이미지: ${deletedImgs.length}개, 실패한 이미지: ${failedImgs.length}개\n`
      setDebugInfo(debugLog)
      console.log(debugLog)

      // 선택된 게시물 초기화
      setSelectedPost(null)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      console.error("게시물 삭제 오류:", error)
      setDebugInfo((prev) => prev + `\n오류 발생: ${errorMessage}`)

      toast({
        title: "삭제 실패",
        description: error instanceof Error ? error.message : "게시물을 삭제하는 중 오류가 발생했습니다",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  // 스토리지 파일 목록 확인
  async function verifyStorage() {
    try {
      setIsVerifying(true)
      let verifyLog = "스토리지 파일 목록 확인 시작\n"

      const supabase = createSupabaseClient()
      if (!supabase) {
        throw new Error("Supabase 클라이언트 초기화에 실패했습니다")
      }

      // 세션 확인
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (!session) {
        throw new Error("인증 세션이 없습니다. 다시 로그인해주세요.")
      }

      verifyLog += `세션 확인 완료: ${session.user.id}\n\n`

      // 스토리지 버킷 목록 확인
      const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets()

      if (bucketsError) {
        verifyLog += `버킷 목록 조회 오류: ${bucketsError.message}\n`
      } else {
        verifyLog += `버킷 목록: ${buckets.map((b: any) => b.name).join(", ")}\n\n`
      }

      // images 버킷의 blog 폴더 파일 목록 확인
      const { data: files, error: filesError } = await supabase.storage.from("images").list("blog")

      if (filesError) {
        verifyLog += `파일 목록 조회 오류: ${filesError.message}\n`
      } else {
        verifyLog += `blog 폴더 파일 수: ${files.length}개\n`
        verifyLog += `파일 목록:\n`

        files.forEach((file: any, index: number) => {
          verifyLog += `${index + 1}. ${file.name} (${file.metadata.size} bytes)\n`
        })
      }

      // 권한 확인을 위한 테스트 삭제 시도
      if (files && files.length > 0) {
        const testFile = files[0]
        verifyLog += `\n테스트 삭제 시도: ${testFile.name}\n`

        const { data: deleteData, error: deleteError } = await supabase.storage
          .from("images")
          .remove([`blog/${testFile.name}`])

        if (deleteError) {
          verifyLog += `테스트 삭제 오류: ${deleteError.message}\n`
          verifyLog += `권한 문제가 있을 수 있습니다. RLS 정책을 확인하세요.\n`
        } else {
          verifyLog += `테스트 삭제 성공: ${JSON.stringify(deleteData)}\n`
          verifyLog += `삭제 권한이 정상적으로 작동합니다.\n`

          // 파일 목록 다시 확인
          const { data: updatedFiles } = await supabase.storage.from("images").list("blog")
          verifyLog += `삭제 후 파일 수: ${updatedFiles.length}개\n`
        }
      }

      setDebugInfo(verifyLog)
      console.log(verifyLog)

      toast({
        title: "스토리지 확인 완료",
        description: "스토리지 파일 목록 확인이 완료되었습니다. 디버그 정보를 확인하세요.",
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      console.error("스토리지 확인 오류:", error)
      setDebugInfo((prev) => prev + `\n오류 발생: ${errorMessage}`)

      toast({
        title: "스토리지 확인 실패",
        description: error instanceof Error ? error.message : "스토리지 확인 중 오류가 발생했습니다",
        variant: "destructive",
      })
    } finally {
      setIsVerifying(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">블로그 관리</h2>
          <Skeleton className="h-10 w-28" />
        </div>
        <div className="border rounded-md p-4">
          <div className="grid gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="grid grid-cols-12 gap-4">
                <Skeleton className="h-10 col-span-6" />
                <Skeleton className="h-10 col-span-2" />
                <Skeleton className="h-10 col-span-2" />
                <Skeleton className="h-10 col-span-2" />
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">블로그 관리</h2>
          <Button onClick={() => router.push("/admin/blog/new")}>
            <Plus className="mr-2 h-4 w-4" />새 포스트 작성
          </Button>
        </div>
        <div className="bg-red-50 text-red-800 p-4 rounded-md">
          <p className="font-medium">오류 발생</p>
          <p>{error}</p>
          <Button variant="outline" className="mt-2" onClick={() => window.location.reload()}>
            새로고침
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">블로그 관리</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={verifyStorage} disabled={isVerifying}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isVerifying ? "animate-spin" : ""}`} />
            {isVerifying ? "확인 중..." : "스토리지 확인"}
          </Button>
          <Button onClick={() => router.push("/admin/blog/new")}>
            <Plus className="mr-2 h-4 w-4" />새 포스트 작성
          </Button>
        </div>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40%]">제목</TableHead>
              <TableHead>카테고리</TableHead>
              <TableHead>작성일</TableHead>
              <TableHead className="text-right">관리</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.length > 0 ? (
              posts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell className="font-medium truncate max-w-xs">{post.title}</TableCell>
                  <TableCell>{post.category?.name || "일반"}</TableCell>
                  <TableCell>{formatDate(new Date(post.published_at))}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="outline" size="sm" onClick={() => router.push(`/blog/${post.id}`)}>
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">보기</span>
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => router.push(`/admin/blog/edit/${post.id}`)}>
                      <Pencil className="h-4 w-4" />
                      <span className="sr-only">편집</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-destructive"
                      onClick={() => {
                        setSelectedPost(post)
                        setIsDialogOpen(true)
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">삭제</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                  작성된 블로그 포스트가 없습니다
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* 삭제 확인 대화상자 */}
      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>블로그 포스트 삭제</AlertDialogTitle>
            <AlertDialogDescription>
              정말로 "{selectedPost?.title}" 포스트를 삭제하시겠습니까? 이 작업은 되돌릴 수 없으며, 포스트에 포함된 모든
              이미지도 함께 삭제됩니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>취소</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault()
                handleDeletePost()
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isDeleting}
            >
              {isDeleting ? "삭제 중..." : "삭제"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* 디버그 정보 */}
      {debugInfo && (
        <div className="mt-4 p-4 border rounded bg-gray-50 text-xs font-mono whitespace-pre-wrap">
          <h3 className="font-bold mb-2">디버그 정보:</h3>
          {debugInfo}
        </div>
      )}
    </div>
  )
}
