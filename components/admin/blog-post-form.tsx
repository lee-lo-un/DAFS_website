"use client"

import { CardFooter } from "@/components/ui/card"
import type React from "react"
import { useState, useEffect, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import { createSupabaseClient } from "@/utils/supabase/client"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ImageUpload } from "@/components/admin/image-upload"
import { useEditor, EditorContent, BubbleMenu } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Placeholder from "@tiptap/extension-placeholder"
import Image from "@tiptap/extension-image"
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  ImageIcon,
  Heading1,
  Heading2,
  Heading3,
  Quote,
  Undo,
  Redo,
  Loader2,
} from "lucide-react"

interface BlogPostFormProps {
  post?: any
}

const BlogPostForm = ({ post }: BlogPostFormProps) => {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [formData, setFormData] = useState({
    title: post?.title || "",
    category_id: post?.category_id || "",
    image_url: post?.image_url || "",
    content: post?.content || "",
    clean_content: post?.clean_content || "",
    author_id: post?.author_id || null, // author_id 추가
  })
  const [categories, setCategories] = useState([])
  const [currentUser, setCurrentUser] = useState(null) // 현재 사용자 정보를 저장할 상태 추가
  const supabase = createSupabaseClient()

  // 에디터 상태 관리
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "내용을 입력하세요...",
      }),
      Image.configure({
        allowBase64: true,
        inline: false,
      }),
    ],
    content: formData.content,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      setFormData((prev) => ({ ...prev, content: html }))
    },
  })

  // 카테고리 목록 가져오기
  useEffect(() => {
    async function fetchCategories() {
      const { data, error } = await supabase.from("categories").select("id, name, slug").order("display_order")

      if (error) {
        console.error("Error fetching categories:", error)
        toast({
          title: "카테고리 로드 실패",
          description: "카테고리 목록을 불러오는 중 오류가 발생했습니다.",
          variant: "destructive",
        })
      } else {
        setCategories(data || [])
      }
    }

    fetchCategories()
  }, [supabase, toast])

  // 현재 로그인한 사용자 정보 가져오기
  useEffect(() => {
    async function fetchCurrentUser() {
      try {
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser()

        if (error) {
          console.error("Error fetching current user:", error)
          toast({
            title: "사용자 정보 로드 실패",
            description: "현재 로그인한 사용자 정보를 가져오는 중 오류가 발생했습니다.",
            variant: "destructive",
          })
          return
        }

        if (user) {
          console.log("현재 로그인한 사용자:", user.id)
          setCurrentUser(user)

          // 새 게시물 작성 시에만 author_id 설정 (수정 시에는 기존 값 유지)
          if (!post) {
            setFormData((prev) => ({ ...prev, author_id: user.id }))
          }
        }
      } catch (error) {
        console.error("Error in fetchCurrentUser:", error)
      }
    }

    fetchCurrentUser()
  }, [supabase, toast, post])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCategoryChange = (value: string) => {
    setFormData((prev) => ({ ...prev, category_id: value }))
  }

  const handleImageUploadComplete = (url: string) => {
    setFormData((prev) => ({ ...prev, image_url: url }))
  }

  // 에디터에 이미지 삽입 함수
  const addImage = useCallback(
    async (file: File) => {
      if (!editor) return

      setIsUploading(true)

      try {
        // 파일 크기 제한 (5MB)
        if (file.size > 5 * 1024 * 1024) {
          toast({
            title: "이미지 업로드 실패",
            description: "파일 크기는 5MB를 초과할 수 없습니다.",
            variant: "destructive",
          })
          return
        }

        // 이미지 파일 타입 확인
        if (!file.type.startsWith("image/")) {
          toast({
            title: "이미지 업로드 실패",
            description: "이미지 파일만 업로드할 수 있습니다.",
            variant: "destructive",
          })
          return
        }

        // Supabase 클라이언트 초기화
        if (!supabase) {
          throw new Error("Supabase 클라이언트를 초기화할 수 없습니다.")
        }

        // 사용자 인증 확인
        const { data: authData } = await supabase.auth.getSession()
        if (!authData.session) {
          throw new Error("인증된 세션이 없습니다. 로그인 후 다시 시도해주세요.")
        }

        // 파일 이름 생성
        const fileExt = file.name.split(".").pop()
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 15)}.${fileExt}`
        const filePath = `blog/${fileName}`

        // Supabase Storage에 업로드
        const { data, error } = await supabase.storage.from("images").upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        })

        if (error) {
          console.error("Storage upload error:", error)
          throw error
        }

        // 공개 URL 가져오기
        const { data: publicUrlData } = supabase.storage.from("images").getPublicUrl(filePath)
        const publicUrl = publicUrlData.publicUrl

        // 에디터에 이미지 삽입
        editor.chain().focus().setImage({ src: publicUrl, alt: file.name }).run()

        toast({
          title: "이미지 업로드 성공",
          description: "이미지가 성공적으로 업로드되었습니다.",
        })
      } catch (error: any) {
        console.error("Error uploading image:", error)

        let errorMessage = "이미지 업로드 중 오류가 발생했습니다."
        if (error.message) {
          errorMessage = `업로드 오류: ${error.message}`
        }

        toast({
          title: "이미지 업로드 실패",
          description: errorMessage,
          variant: "destructive",
        })
      } finally {
        setIsUploading(false)
        if (fileInputRef.current) {
          fileInputRef.current.value = ""
        }
      }
    },
    [editor, supabase, toast],
  )

  // 파일 선택 핸들러
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      addImage(file)
    }
  }

  // 이미지 버튼 클릭 핸들러
  const handleImageButtonClick = () => {
    fileInputRef.current?.click()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // 폼 유효성 검사
      if (!formData.title.trim() || !formData.content.trim()) {
        toast({
          title: "입력 오류",
          description: "모든 필드를 입력해주세요.",
          variant: "destructive",
        })
        setIsSubmitting(false)
        return
      }

      const { data: cleanText } = await supabase.functions.invoke("html-to-text", {
        body: { html: formData.content },
      })

      const { error } = await supabase.from("blog_posts").upsert(
        {
          id: post?.id,
          title: formData.title,
          category_id: formData.category_id,
          image_url: formData.image_url,
          content: formData.content,
          clean_content: cleanText,
          published_at: new Date().toISOString(),
          author_id: formData.author_id || (currentUser ? currentUser.id : null), // author_id 설정
        },
        { onConflict: "id" },
      )

      if (error) {
        throw error
      }

      toast({
        title: "블로그 포스트 저장 성공",
        description: "성공적으로 블로그 포스트가 저장되었습니다.",
      })

      router.push("/admin/blog")
    } catch (error: any) {
      console.error("Error submitting blog post:", error)
      toast({
        title: "블로그 포스트 저장 실패",
        description: error.message || "블로그 포스트를 저장하는 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!editor) {
    return null
  }

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>{post ? "블로그 포스트 수정" : "새 블로그 포스트 작성"}</CardTitle>
          <CardDescription>블로그 포스트를 작성하고 관리합니다.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">제목</Label>
            <Input
              id="title"
              name="title"
              placeholder="블로그 포스트 제목을 입력하세요"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">카테고리</Label>
            <Select value={formData.category_id} onValueChange={handleCategoryChange} required>
              <SelectTrigger>
                <SelectValue placeholder="카테고리 선택" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>대표 이미지</Label>
            <ImageUpload
              onUploadStart={() => {}}
              onUploadComplete={handleImageUploadComplete}
              onUploadError={(error) =>
                toast({ title: "이미지 업로드 실패", description: error, variant: "destructive" })
              }
              value={formData.image_url}
            />
          </div>

          <div className="space-y-2">
            <Label>내용</Label>

            {/* 에디터 툴바 */}
            <div className="border border-input rounded-t-md bg-background p-1 flex flex-wrap gap-1">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={editor.isActive("bold") ? "bg-muted" : ""}
              >
                <Bold className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={editor.isActive("italic") ? "bg-muted" : ""}
              >
                <Italic className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                className={editor.isActive("heading", { level: 1 }) ? "bg-muted" : ""}
              >
                <Heading1 className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                className={editor.isActive("heading", { level: 2 }) ? "bg-muted" : ""}
              >
                <Heading2 className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                className={editor.isActive("heading", { level: 3 }) ? "bg-muted" : ""}
              >
                <Heading3 className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={editor.isActive("bulletList") ? "bg-muted" : ""}
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={editor.isActive("orderedList") ? "bg-muted" : ""}
              >
                <ListOrdered className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                className={editor.isActive("blockquote") ? "bg-muted" : ""}
              >
                <Quote className="h-4 w-4" />
              </Button>
              <Button type="button" variant="ghost" size="sm" onClick={handleImageButtonClick} disabled={isUploading}>
                {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImageIcon className="h-4 w-4" />}
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().undo().run()}
                disabled={!editor.can().undo()}
              >
                <Undo className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().redo().run()}
                disabled={!editor.can().redo()}
              >
                <Redo className="h-4 w-4" />
              </Button>
            </div>

            {/* 숨겨진 파일 입력 */}
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />

            {/* 에디터 콘텐츠 */}
            <EditorContent
              editor={editor}
              className="min-h-[300px] border border-input rounded-b-md p-3 focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
            />

            {/* 버블 메뉴 */}
            {editor && (
              <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
                <div className="bg-background border rounded shadow-md flex p-1 gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={editor.isActive("bold") ? "bg-muted" : ""}
                  >
                    <Bold className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={editor.isActive("italic") ? "bg-muted" : ""}
                  >
                    <Italic className="h-4 w-4" />
                  </Button>
                </div>
              </BubbleMenu>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "저장 중..." : "저장하기"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

export default BlogPostForm
