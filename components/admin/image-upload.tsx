"use client"

import type React from "react"

import { useState, useRef, useCallback, useEffect } from "react"
import { createSupabaseClient } from "@/utils/supabase/client"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ImageIcon, Loader2, X, LinkIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface ImageUploadProps {
  onUploadStart: () => void
  onUploadComplete: (url: string, forEditor?: boolean) => void
  onUploadError: (error: string) => void
  value?: string
  forEditor?: boolean
}

export function ImageUpload({
  onUploadStart,
  onUploadComplete,
  onUploadError,
  value,
  forEditor = false,
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(value || null)
  const [imageUrl, setImageUrl] = useState<string>(value || "")
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const dropZoneRef = useRef<HTMLDivElement>(null)
  const uploadTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // 컴포넌트 마운트/언마운트 시 상태 초기화 및 타임아웃 정리
  useEffect(() => {
    return () => {
      if (uploadTimeoutRef.current) {
        clearTimeout(uploadTimeoutRef.current)
      }
      setIsUploading(false)
      setUploadError(null)
    }
  }, [])

  // value prop이 변경되면 preview와 imageUrl 상태 업데이트
  useEffect(() => {
    if (value !== undefined) {
      setPreview(value || null)
      setImageUrl(value || "")
    }
  }, [value])

  const handleFileUpload = async (file: File) => {
    // 이전 타임아웃이 있으면 정리
    if (uploadTimeoutRef.current) {
      clearTimeout(uploadTimeoutRef.current)
    }

    // 파일 크기 제한 (5MB)
    if (file.size > 5 * 1024 * 1024) {
      onUploadError("파일 크기는 5MB를 초과할 수 없습니다.")
      return
    }

    // 이미지 파일 타입 확인
    if (!file.type.startsWith("image/")) {
      onUploadError("이미지 파일만 업로드할 수 있습니다.")
      return
    }

    // 업로드 상태 초기화
    setIsUploading(true)
    setUploadError(null)
    onUploadStart()

    // 30초 후 타임아웃 설정
    uploadTimeoutRef.current = setTimeout(() => {
      if (isUploading) {
        setIsUploading(false)
        setUploadError("업로드 시간이 초과되었습니다. 다시 시도해주세요.")
        onUploadError("업로드 시간이 초과되었습니다. 다시 시도해주세요.")
      }
    }, 30000)

    try {
      // 이미지 미리보기 생성
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)

      // Supabase 클라이언트 초기화
      const supabase = createSupabaseClient()
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

      console.log("Uploading file:", filePath)

      try {
        // Supabase Storage에 업로드
        const { data, error } = await supabase.storage.from("images").upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        })

        if (error) {
          console.error("Storage upload error:", error)
          throw error
        }

        console.log("Upload successful, data:", data)

        // 공개 URL 가져오기
        const { data: publicUrlData } = supabase.storage.from("images").getPublicUrl(filePath)
        const publicUrl = publicUrlData.publicUrl

        console.log("Public URL:", publicUrl)
        setImageUrl(publicUrl)

        // 타임아웃 정리
        if (uploadTimeoutRef.current) {
          clearTimeout(uploadTimeoutRef.current)
          uploadTimeoutRef.current = null
        }

        // 상태 초기화 - 이 부분이 중요합니다
        setIsUploading(false)
        onUploadComplete(publicUrl, forEditor)
      } catch (uploadError: any) {
        // 응답이 JSON이 아닌 경우 처리
        if (uploadError.message && uploadError.message.includes("not valid JSON")) {
          console.error("Invalid JSON response:", uploadError)
          throw new Error("서버 응답이 유효하지 않습니다. 인증 상태를 확인하거나 잠시 후 다시 시도해주세요.")
        }
        throw uploadError
      }
    } catch (error: any) {
      console.error("Error uploading image:", error)

      let errorMessage = "이미지 업로드 중 오류가 발생했습니다."

      if (error.message.includes("permission denied") || error.message.includes("security policy")) {
        errorMessage = "이미지 업로드 권한이 없습니다. 관리자에게 문의하세요."
      } else if (error.message.includes("does not exist") || error.message.includes("not found")) {
        errorMessage = "이미지 저장소가 존재하지 않습니다. 관리자에게 문의하세요."
      } else if (error.message.includes("not valid JSON") || error.message.includes("서버 응답이 유효하지 않습니다")) {
        errorMessage = "서버 응답이 유효하지 않습니다. 인증 상태를 확인하거나 잠시 후 다시 시도해주세요."
      } else if (error.message.includes("인증된 세션이 없습니다")) {
        errorMessage = "인증된 세션이 없습니다. 로그인 후 다시 시도해주세요."
      } else if (error.message) {
        errorMessage = `업로드 오류: ${error.message}`
      }

      setUploadError(errorMessage)
      onUploadError(errorMessage)

      // 타임아웃 정리
      if (uploadTimeoutRef.current) {
        clearTimeout(uploadTimeoutRef.current)
        uploadTimeoutRef.current = null
      }

      setIsUploading(false)
    } finally {
      // 파일 입력 초기화
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    await handleFileUpload(file)
  }

  const handleRemoveImage = () => {
    setPreview(null)
    setImageUrl("")
    onUploadComplete("", forEditor)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageUrl(e.target.value)
  }

  const handleUrlSubmit = () => {
    if (!imageUrl) {
      onUploadError("이미지 URL을 입력해주세요.")
      return
    }

    // 간단한 URL 유효성 검사
    try {
      new URL(imageUrl)
      setPreview(imageUrl)
      setIsUploading(false)
      onUploadComplete(imageUrl, forEditor)
    } catch (error) {
      onUploadError("유효한 URL을 입력해주세요.")
    }
  }

  // 드래그 앤 드롭 이벤트 핸들러
  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const handleDragOver = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      e.stopPropagation()
      if (!isDragging) {
        setIsDragging(true)
      }
    },
    [isDragging],
  )

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const files = e.dataTransfer.files
    if (files && files.length > 0) {
      handleFileUpload(files[0])
    }
  }, [])

  return (
    <div className="space-y-4">
      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upload">파일 업로드</TabsTrigger>
          <TabsTrigger value="url">URL 입력</TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-4">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            ref={fileInputRef}
            disabled={isUploading}
          />

          {uploadError && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{uploadError}</AlertDescription>
            </Alert>
          )}

          {preview && !forEditor ? (
            <div className="relative">
              <img
                src={preview || "/placeholder.svg"}
                alt="Preview"
                className="w-full h-auto max-h-[300px] object-cover rounded-md"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2"
                onClick={handleRemoveImage}
                disabled={isUploading}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div
              ref={dropZoneRef}
              className={`relative ${isDragging ? "border-primary" : "border-dashed"}`}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              {isDragging && (
                <div className="absolute inset-0 bg-primary/10 rounded-md z-10 flex items-center justify-center">
                  <p className="font-medium text-primary">이미지를 여기에 놓으세요</p>
                </div>
              )}
              <Card
                className="flex flex-col items-center justify-center p-6 border-dashed cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => !isUploading && fileInputRef.current?.click()}
              >
                {isUploading ? (
                  <div className="flex flex-col items-center py-4">
                    <Loader2 className="h-10 w-10 text-primary animate-spin mb-2" />
                    <p className="text-sm text-muted-foreground">이미지 업로드 중...</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center py-4">
                    <ImageIcon className="h-10 w-10 text-muted-foreground mb-2" />
                    <p className="font-medium mb-1">이미지 업로드</p>
                    <p className="text-sm text-muted-foreground">
                      클릭하거나 파일을 드래그하여 이미지를 선택하세요 (최대 5MB)
                    </p>
                  </div>
                )}
              </Card>
            </div>
          )}

          <div className="flex justify-center">
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="w-full"
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  업로드 중...
                </>
              ) : (
                "이미지 선택"
              )}
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="url" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="image-url">이미지 URL</Label>
            <div className="flex gap-2">
              <Input
                id="image-url"
                placeholder="https://example.com/image.jpg"
                value={imageUrl}
                onChange={handleUrlChange}
              />
              <Button type="button" onClick={handleUrlSubmit}>
                <LinkIcon className="h-4 w-4 mr-2" />
                적용
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              이미지 URL을 직접 입력하세요. 외부 이미지 URL을 사용할 경우 CORS 문제가 발생할 수 있습니다.
            </p>
          </div>

          {preview && !forEditor && (
            <div className="relative">
              <img
                src={preview || "/placeholder.svg"}
                alt="Preview"
                className="w-full h-auto max-h-[300px] object-cover rounded-md"
                onError={() => {
                  setPreview(null)
                  onUploadError("이미지를 로드할 수 없습니다. URL을 확인해주세요.")
                }}
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2"
                onClick={handleRemoveImage}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
