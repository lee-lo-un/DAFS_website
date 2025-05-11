import Link from "next/link";
import { Facebook, Instagram, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container-width px-4 py-12 md:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <h3 className="text-xl font-bold">동아풍수문화연구원</h3>
            <p className="text-secondary-foreground/80 text-sm">
              현대적 접근으로 풍수지리의 가치를 재해석하는 동아풍수의 컨설팅
            </p>
            <div className="flex space-x-4">
              <Link
                href="http://pf.kakao.com/_xaxjNBn"
                target="_blank"
                rel="noopener noreferrer"
                className="text-secondary-foreground/80 hover:text-secondary-foreground transition-colors"
              >
                {/* 카카오톡 아이콘 SVG */}
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 40 40"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                >
                  <ellipse cx="20" cy="20" rx="18" ry="15" fill="#FEE500" />
                  <path
                    d="M20 9C12.268 9 6 13.477 6 19C6 22.19 8.323 24.92 12.064 26.463C11.676 27.93 10.793 30.224 10.77 30.287C10.684 30.515 10.788 30.71 10.97 30.71C11.07 30.71 11.16 30.654 11.224 30.574C13.199 28.447 14.382 27.482 14.773 27.174C16.406 27.553 18.164 27.75 20 27.75C27.732 27.75 34 23.273 34 17.75C34 12.227 27.732 7.75 20 7.75V9Z"
                    fill="#391B1B"
                  />
                </svg>
                <span className="sr-only">KakaoTalk</span>
              </Link>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-4">서비스</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/services/residential"
                  className="text-secondary-foreground/80 hover:text-secondary-foreground transition-colors"
                >
                  주거 풍수
                </Link>
              </li>
              <li>
                <Link
                  href="/services/office"
                  className="text-secondary-foreground/80 hover:text-secondary-foreground transition-colors"
                >
                  사무실 풍수
                </Link>
              </li>
              <li>
                <Link
                  href="/services/grave"
                  className="text-secondary-foreground/80 hover:text-secondary-foreground transition-colors"
                >
                  묘지 풍수
                </Link>
              </li>
              <li>
                <Link
                  href="/services/pricing"
                  className="text-secondary-foreground/80 hover:text-secondary-foreground transition-colors"
                >
                  상담 비용
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium mb-4">회사 정보</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/about"
                  className="text-secondary-foreground/80 hover:text-secondary-foreground transition-colors"
                >
                  회사 소개
                </Link>
              </li>
              <li>
                <Link
                  href="/experts"
                  className="text-secondary-foreground/80 hover:text-secondary-foreground transition-colors"
                >
                  전문가 소개
                </Link>
              </li>
              <li>
                <Link
                  href="/reviews"
                  className="text-secondary-foreground/80 hover:text-secondary-foreground transition-colors"
                >
                  상담 후기
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium mb-4">문의</h4>
            <ul className="space-y-2 text-sm">
              <li className="text-secondary-foreground/80">
                경남 김해시 생림면 안양로 46번길 23
              </li>
              <li className="text-secondary-foreground/80">
                이메일: kingsky1122@naver.com
              </li>
              <li className="text-secondary-foreground/80">
                전화: 010-4135-9319
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-secondary-foreground/80 hover:text-secondary-foreground transition-colors"
                >
                  상담 신청
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-secondary-foreground/20 text-sm text-secondary-foreground/60">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p>
              &copy; {new Date().getFullYear()} 모던 풍수. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link
                href="/privacy"
                className="hover:text-secondary-foreground transition-colors"
              >
                개인정보처리방침
              </Link>
              <Link
                href="/terms"
                className="hover:text-secondary-foreground transition-colors"
              >
                이용약관
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
