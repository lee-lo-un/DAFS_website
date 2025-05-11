"use client";
import { useEffect, useState } from "react";
import { createSupabaseClient } from "@/utils/supabase/client";
import ReviewActions from "./review-actions";

interface ReviewUserActionsProps {
  userId: string;
  review: any;
}

export default function ReviewUserActions({ userId, review }: ReviewUserActionsProps) {
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    async function fetchUser() {
      const supabase = createSupabaseClient();
      const { data } = await supabase.auth.getUser();
      if (mounted) setCurrentUserId(data?.user?.id || null);
    }
    fetchUser();
    return () => {
      mounted = false;
    };
  }, []);

  if (!currentUserId || currentUserId !== userId) return null;
  return <ReviewActions review={review} />;
}
