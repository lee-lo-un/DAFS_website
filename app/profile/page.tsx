export const dynamic = "force-dynamic"

import { createSupabaseServer } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import ProfileClient from "@/components/profile/profile-client"

export default async function ProfilePage() {
  const supabase = createSupabaseServer()

  try {
    // Server-side authentication check with proper error handling
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession()

    // If there's an error or no session, redirect to login
    if (sessionError || !session) {
      redirect("/login")
    }

    // Fetch user profile data with error handling
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", session.user.id)
      .single()

    return <ProfileClient user={session.user} profile={profile || null} profileError={profileError?.message} />
  } catch (error) {
    console.error("Error in profile page:", error)
    redirect("/login")
  }
}
