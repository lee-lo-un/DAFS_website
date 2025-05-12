"use client"

export const dynamic = "force-dynamic"

import { useState, useEffect } from "react"
import { createSupabaseClient } from "@/utils/supabase/client"
import ProfileClient from "@/components/profile/profile-client"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function ProfilePage() {
  const [isLoading, setIsLoading] = useState(true)
  const [session, setSession] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createSupabaseClient()
  
  if (!supabase) {
    return (
      <div className="container mx-auto py-24 px-4 md:px-8 text-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
          <h2 className="text-xl font-semibold mb-4 text-red-700">오류가 발생했습니다</h2>
          <p className="mb-6 text-gray-700">Supabase 클라이언트를 초기화할 수 없습니다.</p>
          <Link href="/" className="bg-amber-500 hover:bg-amber-600 text-white py-2 px-4 rounded-md transition-colors">
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    )
  }

  useEffect(() => {
    // 클라이언트 사이드에서 세션 확인
    const checkSession = async () => {
      try {
        setIsLoading(true)
        const { data, error: sessionError } = await supabase.auth.getSession()
        
        // 디버깅 정보 출력
        console.log('클라이언트 세션 확인:', {
          hasSession: !!data.session,
          userId: data.session?.user?.id,
          email: data.session?.user?.email,
          sessionError: sessionError?.message
        })

        if (sessionError) {
          console.error('세션 확인 오류:', sessionError)
          setError(sessionError.message)
          setSession(null)
        } else if (!data.session) {
          console.log('세션 없음')
          setSession(null)
        } else {
          setSession(data.session)
          
          // 프로필 정보 가져오기
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.session.user.id)
            .single()
          
          if (profileError && profileError.code !== 'PGRST116') {
            console.error('프로필 조회 오류:', profileError)
            setError(profileError.message)
          } else if (!profileData) {
            // 프로필이 없으면 생성
            try {
              // 삽입할 데이터 로그 - SQL 구조에 맞게 수정
              const profileData = {
                id: data.session.user.id,
                email: data.session.user.email,
                full_name: '',
                phone: '',
                is_admin: false,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              };
              
              console.log('프로필 생성 시도:', profileData);
              
              const { error: insertError } = await supabase
                .from('profiles')
                .insert([profileData])
                .select();
              
              if (insertError) {
                console.error('프로필 생성 오류:', insertError);
                console.error('오류 코드:', insertError.code);
                console.error('오류 상세:', insertError.details);
                console.error('오류 힌트:', insertError.hint);
                setError(insertError.message || '프로필 생성 중 오류가 발생했습니다.');
              } else {
                // 생성 후 다시 가져오기
                const { data: newProfile } = await supabase
                  .from('profiles')
                  .select('*')
                  .eq('id', data.session.user.id)
                  .single()
                
                setProfile(newProfile)
              }
            } catch (err: any) {
              console.error('프로필 생성 중 오류:', err)
              setError(err.message)
            }
          } else {
            setProfile(profileData)
          }
        }

      } catch (err: any) {
        console.error('세션 확인 중 오류:', err)
        setError(err.message)
        setSession(null)
      } finally {
        setIsLoading(false)
      }
    }
    
    checkSession()
  }, [])
  
  // 로그인이 필요한 경우
  if (!isLoading && !session) {
    return (
      <div className="container mx-auto py-24 px-4 md:px-8 text-center">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-md mx-auto">
          <h2 className="text-xl font-semibold mb-4 text-yellow-700">로그인이 필요합니다</h2>
          <p className="mb-6 text-gray-700">프로필 정보를 보려면 먼저 로그인해주세요.</p>
          <Link href="/login" className="bg-amber-500 hover:bg-amber-600 text-white py-2 px-4 rounded-md transition-colors">
            로그인하기
          </Link>
        </div>
      </div>
    )
  }
  
  // 로딩 상태
  if (isLoading) {
    return (
      <div className="container mx-auto py-24 px-4 md:px-8 text-center">
        <div className="p-6 max-w-md mx-auto">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">정보를 불러오는 중...</p>
        </div>
      </div>
    )
  }
  
  // 오류 발생
  if (error) {
    return (
      <div className="container mx-auto py-24 px-4 md:px-8 text-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
          <h2 className="text-xl font-semibold mb-4 text-red-700">오류가 발생했습니다</h2>
          <p className="mb-6 text-gray-700">프로필 정보를 불러오는 중 문제가 발생했습니다: {error}</p>
          <Link href="/" className="bg-amber-500 hover:bg-amber-600 text-white py-2 px-4 rounded-md transition-colors">
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    )
  }
  
  // 세션과 프로필이 있는 경우
  return <ProfileClient user={session.user} profile={profile} profileError="" />
}
