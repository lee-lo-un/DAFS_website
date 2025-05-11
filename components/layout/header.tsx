"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, Moon, Sun, Shield, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import UserAuthButton from "@/components/auth/user-auth-button";
import { createSupabaseClient } from "@/utils/supabase/client";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();

  // 컴포넌트가 마운트된 후에만 테마 관련 UI를 렌더링
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 사용자가 관리자인지 확인
  useEffect(() => {
    const checkAdmin = async () => {
      setIsLoading(true);

      // 타임아웃 설정 - 10초로 증가
      const timeoutId = setTimeout(() => {
        console.log("Admin check timed out - using fallback");
        setIsAdmin(false);
        setIsLoading(false);
      }, 10000); // 10초 타임아웃으로 증가

      try {
        const supabase = createSupabaseClient();
        if (!supabase) {
          console.error("Supabase 클라이언트 초기화 실패");
          setIsAdmin(false);
          setIsLoading(false);
          clearTimeout(timeoutId);
          return;
        }

        // 세션 확인 - 세션이 없는 것은 오류가 아니라 로그인하지 않은 상태
        const { data: sessionData, error: sessionError } =
          await supabase.auth.getSession();

        if (sessionError) {
          console.error("세션 확인 오류:", sessionError.message);
          setIsAdmin(false);
          setIsLoading(false);
          clearTimeout(timeoutId);
          return;
        }

        // 세션이 없으면 관리자가 아님
        if (!sessionData?.session) {
          console.log("세션 없음 - 로그인되지 않음");
          setIsAdmin(false);
          setIsLoading(false);
          clearTimeout(timeoutId);
          return;
        }

        // 사용자 정보 확인
        const { data: userData, error: userError } =
          await supabase.auth.getUser();

        if (userError) {
          console.error("사용자 정보 확인 오류:", userError.message);
          setIsAdmin(false);
          setIsLoading(false);
          clearTimeout(timeoutId);
          return;
        }

        if (!userData.user) {
          console.log("사용자 정보 없음");
          setIsAdmin(false);
          setIsLoading(false);
          clearTimeout(timeoutId);
          return;
        }

        console.log("사용자 ID:", userData.user.id);

        // 관리자 권한 확인 - 타임아웃 설정
        const profilePromise = supabase
          .from("profiles")
          .select("is_admin")
          .eq("id", userData.user.id)
          .single();

        // Promise.race를 사용하여 프로필 쿼리에 5초 타임아웃 적용
        const profileTimeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error("프로필 쿼리 타임아웃")), 5000);
        });

        try {
          const { data: profile, error: profileError } = (await Promise.race([
            profilePromise,
            profileTimeoutPromise,
          ])) as any;

          if (profileError) {
            console.error("프로필 확인 오류:", profileError.message);
            setIsAdmin(false);
          } else {
            console.log("프로필 정보:", profile);
            setIsAdmin(profile?.is_admin || false);
          }
        } catch (profileTimeoutError) {
          console.error("프로필 쿼리 타임아웃 - 기본값 사용");
          // 타임아웃 발생 시 기본값 사용
          setIsAdmin(false);
        }
      } catch (error) {
        console.error("관리자 권한 확인 중 오류:", error);
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
        clearTimeout(timeoutId);
      }
    };

    // 페이지 로드 시 한 번만 실행
    checkAdmin();
  }, []); // 의존성 배열 유지

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if (isMenuOpen) {
      // 메뉴를 닫을 때 로딩 상태 초기화
      setIsLoading(false);
    }
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
    console.log(
      "현재 테마:",
      theme,
      "새 테마:",
      theme === "dark" ? "light" : "dark"
    );
  };

  const isActive = (path: string) => {
    return pathname === path;
  };

  const navigationItems = [
    { name: "홈", href: "/" },
    { name: "연구원 소개", href: "/experts" },
    { name: "컨설팅", href: "/services" },
    { name: "명당 및 답사기", href: "/blog" },
    { name: "교육 안내", href: "/courses" },
    { name: "간산 안내", href: "/notices" },
    { name: "Q&A", href: "/qna" },
    { name: "상담 후기", href: "/reviews" },
    { name: "FAQ", href: "/faq" },
    { name: "문의", href: "/contact" },
  ];

  // 현재 테마가 light인지 dark인지 (클라이언트 사이드에서만 확인 가능)
  const currentTheme = mounted ? theme : "light";

  return (
    <header
      className={cn(
        "fixed top-0 z-50 w-full transition-all duration-300",
        isScrolled
          ? "bg-background/95 backdrop-blur-md shadow-md" // 더 불투명하게 변경
          : "bg-[#3A7B89]"
      )}
    >
      <div className="container-width px-4 py-3 md:px-8">
        <div className="flex items-center justify-between">
          {/* 로고와 사이트명 - 간소화 */}
          <Link href="/" className="flex items-center">
            <div className="mr-2 h-8 w-8 relative">
              <Image
                src="/images/donga-Icon.png"
                alt="Logo"
                width={32}
                height={32}
                className="object-contain"
                unoptimized
              />
            </div>
            <span
              className={cn(
                "text-xl font-bold",
                isScrolled ? "text-foreground" : "text-white"
              )}
            >
              동아풍수문화연구원
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-2">
            <Link
              href="/experts"
              className={cn(
                "transition-colors px-2 py-1 rounded-md relative whitespace-nowrap",
                isScrolled
                  ? cn(
                      "text-foreground/80 hover:text-foreground hover:bg-gray-100",
                      isActive("/experts") && "text-foreground font-semibold bg-primary/10 text-primary"
                    )
                  : cn(
                      "text-white/80 hover:text-white hover:bg-white/10",
                      isActive("/experts") && "text-white font-semibold bg-white/20"
                    )
              )}
            >
              연구원 소개
            </Link>
            <Link
              href="/services"
              className={cn(
                "transition-colors px-2 py-1 rounded-md relative whitespace-nowrap",
                isScrolled
                  ? cn(
                      "text-foreground/80 hover:text-foreground hover:bg-gray-100",
                      isActive("/services") && "text-foreground font-semibold bg-primary/10 text-primary"
                    )
                  : cn(
                      "text-white/80 hover:text-white hover:bg-white/10",
                      isActive("/services") && "text-white font-semibold bg-white/20"
                    )
              )}
            >
              컨설팅
            </Link>
            <Link
              href="/blog"
              className={cn(
                "transition-colors px-2 py-1 rounded-md relative whitespace-nowrap",
                isScrolled
                  ? cn(
                      "text-foreground/80 hover:text-foreground hover:bg-gray-100",
                      isActive("/blog") && "text-foreground font-semibold bg-primary/10 text-primary"
                    )
                  : cn(
                      "text-white/80 hover:text-white hover:bg-white/10",
                      isActive("/blog") && "text-white font-semibold bg-white/20"
                    )
              )}
            >
              명당 및 답사기
            </Link>
            <Link
              href="/courses"
              className={cn(
                "transition-colors px-2 py-1 rounded-md relative whitespace-nowrap",
                isScrolled
                  ? cn(
                      "text-foreground/80 hover:text-foreground hover:bg-gray-100",
                      isActive("/courses") && "text-foreground font-semibold bg-primary/10 text-primary"
                    )
                  : cn(
                      "text-white/80 hover:text-white hover:bg-white/10",
                      isActive("/courses") && "text-white font-semibold bg-white/20"
                    )
              )}
            >
              교육 안내
            </Link>
            <Link
              href="/notices"
              className={cn(
                "transition-colors px-2 py-1 rounded-md relative whitespace-nowrap",
                isScrolled
                  ? cn(
                      "text-foreground/80 hover:text-foreground hover:bg-gray-100",
                      isActive("/notices") && "text-foreground font-semibold bg-primary/10 text-primary"
                    )
                  : cn(
                      "text-white/80 hover:text-white hover:bg-white/10",
                      isActive("/notices") && "text-white font-semibold bg-white/20"
                    )
              )}
            >
              간산 안내
            </Link>
            <Link
              href="/qna"
              className={cn(
                "transition-colors px-2 py-1 rounded-md relative whitespace-nowrap",
                isScrolled
                  ? cn(
                      "text-foreground/80 hover:text-foreground hover:bg-gray-100",
                      isActive("/qna") && "text-foreground font-semibold bg-primary/10 text-primary"
                    )
                  : cn(
                      "text-white/80 hover:text-white hover:bg-white/10",
                      isActive("/qna") && "text-white font-semibold bg-white/20"
                    )
              )}
            >
              Q&A
            </Link>
            <Link
              href="/location"
              className={cn(
                "transition-colors px-2 py-1 rounded-md relative whitespace-nowrap",
                isScrolled
                  ? cn(
                      "text-foreground/80 hover:text-foreground hover:bg-gray-100",
                      isActive("/location") && "text-foreground font-semibold bg-primary/10 text-primary"
                    )
                  : cn(
                      "text-white/80 hover:text-white hover:bg-white/10",
                      isActive("/location") && "text-white font-semibold bg-white/20"
                    )
              )}
            >
              오시는길
            </Link>
            {/* 관리자인 경우에만 관리자 페이지 링크 표시 */}
            {isAdmin && (
              <Link
                href="/admin-direct"
                className={cn(
                  "flex items-center transition-colors px-2 py-1 rounded-md relative whitespace-nowrap",
                  isScrolled
                    ? cn(
                        "text-foreground/80 hover:text-foreground hover:bg-gray-100",
                        (isActive("/admin") || isActive("/admin-direct")) &&
                          "text-foreground font-semibold bg-primary/10 text-primary"
                      )
                    : cn(
                        "text-white/80 hover:text-white hover:bg-white/10",
                        (isActive("/admin") || isActive("/admin-direct")) &&
                          "text-white font-semibold bg-white/20"
                      )
                )}
              >
                <Shield className="mr-1 h-4 w-4" />
                관리자
              </Link>
            )}
            {/* 상담 신청 버튼 제거 */}
            <UserAuthButton />
            {/* 다크모드 토글 버튼 수정 */}
            {mounted && (
              <button
                onClick={toggleTheme}
                className={cn(
                  "flex items-center rounded-full p-1 transition-all duration-300 w-12 h-6",
                  currentTheme === "dark" ? "bg-gray-700" : "bg-yellow-100"
                )}
                aria-label="테마 변경"
              >
                <div
                  className={cn(
                    "flex items-center justify-center rounded-full w-5 h-5 transition-all duration-300 transform",
                    currentTheme === "dark"
                      ? "bg-blue-600 translate-x-6"
                      : "bg-yellow-400 translate-x-0"
                  )}
                >
                  {currentTheme === "dark" ? (
                    <Moon className="h-3 w-3 text-white" />
                  ) : (
                    <Sun className="h-3 w-3 text-yellow-800" />
                  )}
                </div>
              </button>
            )}
          </nav>

          {/* Mobile Navigation Toggle */}
          <div className="flex items-center md:hidden space-x-4">
            {/* 모바일 다크모드 토글 버튼 수정 */}
            {mounted && (
              <button
                onClick={toggleTheme}
                className={cn(
                  "flex items-center rounded-full p-1 transition-all duration-300 w-12 h-6",
                  currentTheme === "dark" ? "bg-gray-700" : "bg-yellow-100"
                )}
                aria-label="테마 변경"
              >
                <div
                  className={cn(
                    "flex items-center justify-center rounded-full w-5 h-5 transition-all duration-300 transform",
                    currentTheme === "dark"
                      ? "bg-blue-600 translate-x-6"
                      : "bg-yellow-400 translate-x-0"
                  )}
                >
                  {currentTheme === "dark" ? (
                    <Moon className="h-3 w-3 text-white" />
                  ) : (
                    <Sun className="h-3 w-3 text-yellow-800" />
                  )}
                </div>
              </button>
            )}
            <button
              onClick={toggleMenu}
              aria-label="메뉴 열기"
              className={cn(
                "inline-flex items-center justify-center h-10 w-10 rounded-md transition-colors",
                isScrolled
                  ? "text-foreground hover:bg-accent hover:text-accent-foreground"
                  : "text-white hover:bg-white/10"
              )}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div
            className={cn(
              "md:hidden pt-4 pb-6 space-y-4 animate-in slide-in-from-top",
              isScrolled ? "text-foreground" : "text-white"
            )}
          >
            <Link
              href="/experts"
              className={cn(
                "block py-2 transition-colors",
                isScrolled
                  ? cn(
                      "text-foreground/80 hover:text-foreground",
                      isActive("/experts") && "text-foreground font-medium"
                    )
                  : cn(
                      "text-white/80 hover:text-white",
                      isActive("/experts") && "text-white font-medium"
                    )
              )}
              onClick={() => setIsMenuOpen(false)}
            >
              연구원 소개
            </Link>
            <Link
              href="/services"
              className={cn(
                "block py-2 transition-colors",
                isScrolled
                  ? cn(
                      "text-foreground/80 hover:text-foreground",
                      isActive("/services") && "text-foreground font-medium"
                    )
                  : cn(
                      "text-white/80 hover:text-white",
                      isActive("/services") && "text-white font-medium"
                    )
              )}
              onClick={() => setIsMenuOpen(false)}
            >
              컨설팅
            </Link>
            <Link
              href="/blog"
              className={cn(
                "block py-2 transition-colors",
                isScrolled
                  ? cn(
                      "text-foreground/80 hover:text-foreground",
                      isActive("/blog") && "text-foreground font-medium"
                    )
                  : cn(
                      "text-white/80 hover:text-white",
                      isActive("/blog") && "text-white font-medium"
                    )
              )}
              onClick={() => setIsMenuOpen(false)}
            >
              명당 및 답사기
            </Link>
            <Link
              href="/courses"
              className={cn(
                "block py-2 transition-colors",
                isScrolled
                  ? cn(
                      "text-foreground/80 hover:text-foreground",
                      isActive("/courses") && "text-foreground font-medium"
                    )
                  : cn(
                      "text-white/80 hover:text-white",
                      isActive("/courses") && "text-white font-medium"
                    )
              )}
              onClick={() => setIsMenuOpen(false)}
            >
              교육 안내
            </Link>
            <Link
              href="/notices"
              className={cn(
                "block py-2 transition-colors",
                isScrolled
                  ? cn(
                      "text-foreground/80 hover:text-foreground",
                      isActive("/notices") && "text-foreground font-medium"
                    )
                  : cn(
                      "text-white/80 hover:text-white",
                      isActive("/notices") && "text-white font-medium"
                    )
              )}
              onClick={() => setIsMenuOpen(false)}
            >
              간산 안내
            </Link>
            <Link
              href="/qna"
              className={cn(
                "block py-2 transition-colors",
                isScrolled
                  ? cn(
                      "text-foreground/80 hover:text-foreground",
                      isActive("/qna") && "text-foreground font-medium"
                    )
                  : cn(
                      "text-white/80 hover:text-white",
                      isActive("/qna") && "text-white font-medium"
                    )
              )}
              onClick={() => setIsMenuOpen(false)}
            >
              Q&A
            </Link>
            <Link
              href="/reviews"
              className={cn(
                "transition-colors",
                isScrolled
                  ? cn(
                      "text-foreground/80 hover:text-foreground",
                      isActive("/reviews") && "text-foreground font-medium"
                    )
                  : cn(
                      "text-white/80 hover:text-white",
                      isActive("/reviews") && "text-white font-medium"
                    )
              )}
              onClick={() => setIsMenuOpen(false)}
            >
              상담 후기
            </Link>
            <Link
              href="/location"
              className={cn(
                "transition-colors",
                isScrolled
                  ? cn(
                      "text-foreground/80 hover:text-foreground",
                      isActive("/location") && "text-foreground font-medium"
                    )
                  : cn(
                      "text-white/80 hover:text-white",
                      isActive("/location") && "text-white font-medium"
                    )
              )}
              onClick={() => setIsMenuOpen(false)}
            >
              오시는길
            </Link>
            {/* 모바일 메뉴에도 관리자 페이지 링크 추가 */}
            {isAdmin && (
              <Link
                href="/admin-direct"
                className={cn(
                  "block py-2 flex items-center transition-colors",
                  isScrolled
                    ? cn(
                        "text-foreground/80 hover:text-foreground",
                        (isActive("/admin") || isActive("/admin-direct")) &&
                          "text-foreground font-medium"
                      )
                    : cn(
                        "text-white/80 hover:text-white",
                        (isActive("/admin") || isActive("/admin-direct")) &&
                          "text-white font-medium"
                      )
                )}
                onClick={() => setIsMenuOpen(false)}
              >
                <Shield className="mr-2 h-4 w-4" />
                관리자 페이지
              </Link>
            )}
            {/* 상담 신청 버튼 제거 */}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
