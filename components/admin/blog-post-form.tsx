"use client";

import { CardFooter } from "@/components/ui/card";
import "./editor-styles.css"; // 에디터 스타일 추가
import type React from "react";
import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseClient } from "@/utils/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImageUpload } from "@/components/admin/image-upload";
import { useEditor, EditorContent, BubbleMenu } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Image from "@tiptap/extension-image";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import { User } from "@supabase/supabase-js";
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
  Palette,
} from "lucide-react";

interface BlogPostFormProps {
  post?: any;
}

const BlogPostForm = ({ post }: BlogPostFormProps) => {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    title: post?.title || "",
    category_id: post?.category_id || "",
    // 대표 이미지 필드 제거: image_url은 내부에서 자동 세팅
    // image_url: post?.image_url || "",
    content: post?.content || "",
    clean_content: post?.clean_content || "",
    author_id: post?.author_id || null, // author_id 추가
  });
  // 카테고리 인터페이스 정의
  interface Category {
    id: string;
    name: string;
    slug: string;
  }

  const [categories, setCategories] = useState<Category[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null); // 현재 사용자 정보를 저장할 상태 추가
  const supabase = createSupabaseClient();

  // 에디터 상태 관리
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
          HTMLAttributes: {
            class: 'heading',
          },
        },
        blockquote: {
          HTMLAttributes: {
            class: 'blockquote',
          },
        },
        bulletList: {
          HTMLAttributes: {
            class: 'bullet-list',
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: 'ordered-list',
          },
        },
      }),
      Placeholder.configure({
        placeholder: "내용을 입력하세요...",
      }),
      Image.configure({
        allowBase64: true,
        inline: false,
      }),
      // 텍스트 스타일 추가
      TextStyle,
      // 텍스트 색상 추가
      Color,
    ],
    content: formData.content,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      setFormData((prev) => ({ ...prev, content: html }));
    },
    editorProps: {
      attributes: {
        class: 'focus:outline-none',
      },
    },
  });

  // 카테고리 목록 가져오기
  useEffect(() => {
    async function fetchCategories() {
      // 타입 안전한 쿼리 설정
      const { data, error } = await supabase
        .from("categories")
        .select("id, name, slug")
        .order("display_order");

      if (error) {
        console.error("Error fetching categories:", error);
        toast({
          title: "카테고리 로드 실패",
          description: "카테고리 목록을 불러오는 중 오류가 발생했습니다.",
          variant: "destructive",
        });
      } else if (data) {
        // 수동으로 타입 변환 처리
        const typedCategories: Category[] = data.map(item => ({
          id: String(item.id),
          name: String(item.name),
          slug: String(item.slug)
        }));
        setCategories(typedCategories);
      } else {
        setCategories([]);
      }
    }

    fetchCategories();
  }, [supabase, toast]);

  // 현재 로그인한 사용자 정보 가져오기
  useEffect(() => {
    async function fetchCurrentUser() {
      try {
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();

        if (error) {
          console.error("Error fetching current user:", error);
          toast({
            title: "사용자 정보 로드 실패",
            description:
              "현재 로그인한 사용자 정보를 가져오는 중 오류가 발생했습니다.",
            variant: "destructive",
          });
          return;
        }

        if (user) {
          console.log("현재 로그인한 사용자:", user.id);
          // User 타입으로 설정
          setCurrentUser(user as User);

          // 새 게시물 작성 시에만 author_id 설정 (수정 시에는 기존 값 유지)
          if (!post) {
            setFormData((prev) => ({ ...prev, author_id: user.id }));
          }
        }
      } catch (error) {
        console.error("Error in fetchCurrentUser:", error);
      }
    }

    fetchCurrentUser();
  }, [supabase, toast, post]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (value: string) => {
    setFormData((prev) => ({ ...prev, category_id: value }));
  };

  // 에디터에 이미지 삽입 함수
  const addImage = useCallback(
    async (file: File) => {
      if (!editor) return;

      setIsUploading(true);

      try {
        // 파일 크기 제한 (5MB)
        if (file.size > 5 * 1024 * 1024) {
          toast({
            title: "이미지 업로드 실패",
            description: "파일 크기는 5MB를 초과할 수 없습니다.",
            variant: "destructive",
          });
          return;
        }

        // 이미지 파일 타입 확인
        if (!file.type.startsWith("image/")) {
          toast({
            title: "이미지 업로드 실패",
            description: "이미지 파일만 업로드할 수 있습니다.",
            variant: "destructive",
          });
          return;
        }

        // Supabase 클라이언트 초기화
        if (!supabase) {
          throw new Error("Supabase 클라이언트를 초기화할 수 없습니다.");
        }

        // 사용자 인증 확인
        const { data: authData } = await supabase.auth.getSession();
        if (!authData.session) {
          throw new Error(
            "인증된 세션이 없습니다. 로그인 후 다시 시도해주세요."
          );
        }

        // 파일 이름 생성
        const fileExt = file.name.split(".").pop();
        const fileName = `${Date.now()}_${Math.random()
          .toString(36)
          .substring(2, 15)}.${fileExt}`;
        const filePath = `blog/${fileName}`;

        // Supabase Storage에 업로드
        const { data, error } = await supabase.storage
          .from("images")
          .upload(filePath, file, {
            cacheControl: "3600",
            upsert: false,
          });

        if (error) {
          console.error("Storage upload error:", error);
          throw error;
        }

        // 공개 URL 가져오기
        const { data: publicUrlData } = supabase.storage
          .from("images")
          .getPublicUrl(filePath);
        const publicUrl = publicUrlData.publicUrl;

        // 에디터에 이미지 삽입
        editor
          .chain()
          .focus()
          .setImage({ src: publicUrl, alt: file.name })
          .run();

        toast({
          title: "이미지 업로드 성공",
          description: "이미지가 성공적으로 업로드되었습니다.",
        });
      } catch (error: any) {
        console.error("Error uploading image:", error);

        let errorMessage = "이미지 업로드 중 오류가 발생했습니다.";
        if (error.message) {
          errorMessage = `업로드 오류: ${error.message}`;
        }

        toast({
          title: "이미지 업로드 실패",
          description: errorMessage,
          variant: "destructive",
        });
      } finally {
        setIsUploading(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    },
    [editor, supabase, toast]
  );

  // 파일 선택 핸들러
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      addImage(file);
    }
  };

  // 이미지 버튼 클릭 핸들러
  const handleImageButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // 폼 유효성 검사
      if (!formData.title.trim() || !formData.content.trim()) {
        toast({
          title: "입력 오류",
          description: "모든 필드를 입력해주세요.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }
      if (!formData.category_id) {
        toast({
          title: "카테고리 선택 필요",
          description: "카테고리를 반드시 선택해주세요.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      const { data: cleanText } = await supabase.functions.invoke(
        "html-to-text",
        {
          body: { html: formData.content },
        }
      );

      // 본문에서 첫 번째 이미지 추출
      function extractFirstImageUrl(html: string): string {
        const imgRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/i;
        const match = imgRegex.exec(html);
        return match && match[1] ? match[1] : "";
      }
      const firstImageUrl = extractFirstImageUrl(formData.content);

      const { error } = await supabase.from("blog_posts").upsert(
        {
          id: post?.id,
          title: formData.title,
          category_id: formData.category_id,
          image_url: firstImageUrl, // 본문 첫 이미지 자동 세팅
          content: formData.content,
          clean_content: cleanText,
          published_at: new Date().toISOString(),
          author_id:
            formData.author_id || (currentUser ? currentUser.id : null), // author_id 설정
        },
        { onConflict: "id" }
      );

      if (error) {
        throw error;
      }

      toast({
        title: "블로그 포스트 저장 성공",
        description: "성공적으로 블로그 포스트가 저장되었습니다.",
      });

      router.push("/admin/blog");
    } catch (error: any) {
      console.error("Error submitting blog post:", error);
      console.error("Error details:", JSON.stringify(error, null, 2));
      // Supabase 에러 처리 개선
      const errorMessage = error?.message || 
                          error?.error_description || 
                          error?.details || 
                          JSON.stringify(error) || 
                          "블로그 포스트를 저장하는 중 오류가 발생했습니다.";
      
      toast({
        title: "블로그 포스트 저장 실패",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!editor) {
    return null;
  }

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>
            {post ? "블로그 포스트 수정" : "새 블로그 포스트 작성"}
          </CardTitle>
          <CardDescription>
            블로그 포스트를 작성하고 관리합니다.
          </CardDescription>
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
            <Select
              value={formData.category_id}
              onValueChange={handleCategoryChange}
            >
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
                onClick={() =>
                  editor.chain().focus().toggleHeading({ level: 1 }).run()
                }
                className={
                  editor.isActive("heading", { level: 1 }) ? "bg-muted" : ""
                }
              >
                <Heading1 className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() =>
                  editor.chain().focus().toggleHeading({ level: 2 }).run()
                }
                className={
                  editor.isActive("heading", { level: 2 }) ? "bg-muted" : ""
                }
              >
                <Heading2 className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() =>
                  editor.chain().focus().toggleHeading({ level: 3 }).run()
                }
                className={
                  editor.isActive("heading", { level: 3 }) ? "bg-muted" : ""
                }
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
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleImageButtonClick}
                disabled={isUploading}
              >
                {isUploading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <ImageIcon className="h-4 w-4" />
                )}
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
              
              {/* 색상 선택 버튼 추가 */}
              <div className="relative">
                <div
                  className="inline-flex items-center justify-center h-8 w-8 rounded-md p-0 hover:bg-muted cursor-pointer"
                  onClick={() => document.getElementById('color-picker-dropdown')?.classList.toggle('hidden')}
                >
                  <Palette className="h-4 w-4" />
                </div>
                <div 
                  id="color-picker-dropdown"
                  className="absolute hidden flex-wrap gap-1 p-2 bg-white shadow-lg rounded-md z-10 top-full left-0 w-32"
                >
                  {[
                    '#000000', '#434343', '#666666', '#999999', '#b7b7b7', '#cccccc', '#d9d9d9', '#efefef', '#f3f3f3', '#ffffff',
                    '#980000', '#ff0000', '#ff9900', '#ffff00', '#00ff00', '#00ffff', '#4a86e8', '#0000ff', '#9900ff', '#ff00ff',
                    '#e6b8af', '#f4cccc', '#fce5cd', '#fff2cc', '#d9ead3', '#d0e0e3', '#c9daf8', '#cfe2f3', '#d9d2e9', '#ead1dc',
                  ].map((color) => (
                    <div
                      key={color}
                      className="w-5 h-5 rounded-sm border border-gray-300 cursor-pointer"
                      style={{ backgroundColor: color }}
                      onClick={() => {
                        editor.chain().focus().setColor(color).run();
                        document.getElementById('color-picker-dropdown')?.classList.add('hidden');
                      }}
                    />
                  ))}
                  <div
                    className="w-full text-xs mt-1 text-center text-gray-600 cursor-pointer p-1 hover:bg-gray-100 rounded"
                    onClick={() => {
                      editor.chain().focus().unsetColor().run();
                      document.getElementById('color-picker-dropdown')?.classList.add('hidden');
                    }}
                  >
                    색상 제거
                  </div>
                </div>
              </div>
            </div>

            {/* 숨겨진 파일 입력 */}
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
            />

            {/* 에디터 콘텐츠 */}
            <EditorContent
              editor={editor}
              className="tiptap min-h-[300px]"
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
                  
                  {/* 버블 메뉴에 색상 선택 추가 */}
                  <div className="relative">
                    <div
                      className="inline-flex items-center justify-center h-8 w-8 rounded-md p-0 hover:bg-muted cursor-pointer"
                      onClick={() => document.getElementById('bubble-color-picker')?.classList.toggle('hidden')}
                    >
                      <Palette className="h-4 w-4" />
                    </div>
                    <div 
                      id="bubble-color-picker"
                      className="absolute hidden flex-wrap gap-1 p-2 bg-white shadow-lg rounded-md z-10 top-full left-0 w-32"
                    >
                      {[
                        '#000000', '#434343', '#666666', '#999999', '#b7b7b7', '#cccccc', '#d9d9d9', '#efefef', '#f3f3f3', '#ffffff',
                        '#980000', '#ff0000', '#ff9900', '#ffff00', '#00ff00', '#00ffff', '#4a86e8', '#0000ff', '#9900ff', '#ff00ff',
                      ].map((color) => (
                        <div
                          key={color}
                          className="w-4 h-4 rounded-sm border border-gray-300 cursor-pointer"
                          style={{ backgroundColor: color }}
                          onClick={() => {
                            editor.chain().focus().setColor(color).run();
                            document.getElementById('bubble-color-picker')?.classList.add('hidden');
                          }}
                        />
                      ))}
                      <div
                        className="w-full text-xs mt-1 text-center text-gray-600 cursor-pointer p-1 hover:bg-gray-100 rounded"
                        onClick={() => {
                          editor.chain().focus().unsetColor().run();
                          document.getElementById('bubble-color-picker')?.classList.add('hidden');
                        }}
                      >
                        색상 제거
                      </div>
                    </div>
                  </div>
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
  );
};

export default BlogPostForm;
