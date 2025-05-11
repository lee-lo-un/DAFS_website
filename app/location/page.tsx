import React from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

// 메타데이터 설정
export const metadata = {
  title: "오시는 길 | 동아풍수문화연구원",
  description: "동아풍수문화연구원 위치 및 연락처 안내",
};

const LocationPage = () => {
  return (
    <div className="container mx-auto px-4 py-20 md:py-24">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-12">오시는 길</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* 연락처 정보 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-6 text-[#3A7B89] dark:text-[#4FCADB]">연락처 안내</h2>
          
          <div className="space-y-4">
            <div className="flex items-start">
              <Phone className="h-5 w-5 text-[#3A7B89] dark:text-[#4FCADB] mt-1 mr-3" />
              <div>
                <p className="font-medium dark:text-white">전화</p>
                <p className="dark:text-gray-200">010-4135-9319</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <Mail className="h-5 w-5 text-[#3A7B89] dark:text-[#4FCADB] mt-1 mr-3" />
              <div>
                <p className="font-medium dark:text-white">이메일</p>
                <p className="dark:text-gray-200">kingsky1122@naver.com</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <MapPin className="h-5 w-5 text-[#3A7B89] dark:text-[#4FCADB] mt-1 mr-3" />
              <div>
                <p className="font-medium dark:text-white">주소</p>
                <p className="dark:text-gray-200">경남 김해시 생림면 안양로 46번길 23</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <Clock className="h-5 w-5 text-[#3A7B89] dark:text-[#4FCADB] mt-1 mr-3" />
              <div>
                <p className="font-medium dark:text-white">상담 시간</p>
                <p className="dark:text-gray-200">주중, 주말, 공휴일, 주야간 모두 가능</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* 이미지 또는 추가 정보 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-6 text-[#3A7B89] dark:text-[#4FCADB]">찾아오시는 방법</h2>
          <p className="mb-4 dark:text-gray-200">
            동아풍수문화연구원은 경남 김해시 생림면에 위치해 있습니다. 
            아래 지도를 참고하시거나 전화로 문의해 주시면 상세한 안내를 도와드리겠습니다.
          </p>
          <p className="mb-4 dark:text-gray-200">
            <strong className="dark:text-white">대중교통:</strong> 김해시 버스 이용
          </p>
          <p className="dark:text-gray-200">
            <strong className="dark:text-white">자가용:</strong> 내비게이션에 '경남 김해시 생림면 안양로 46번길 23' 입력
          </p>
        </div>
      </div>
      
      {/* 카카오 지도 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-12">
        <h2 className="text-2xl font-semibold mb-6 text-[#3A7B89] dark:text-[#4FCADB]">지도</h2>
        <div className="w-full h-96 relative">
          <iframe 
            src="https://map.kakao.com/link/map/경남 김해시 생림면 안양로 46번길 23,35.3369,128.8321" 
            width="100%" 
            height="100%" 
            frameBorder="0" 
            style={{ border: 0 }} 
            allowFullScreen 
            aria-hidden="false" 
            tabIndex={0}
            className="rounded-lg"
          ></iframe>
        </div>
        <div className="mt-4 flex flex-col sm:flex-row gap-4">
          <a 
            href="https://map.kakao.com/link/map/경남 김해시 생림면 안양로 46번길 23,35.3369,128.8321" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center bg-[#FFEB3B] text-black px-4 py-2 rounded-md hover:bg-[#FDD835] transition-colors"
          >
            <MapPin className="h-4 w-4 mr-2" /> 카카오 지도에서 보기
          </a>
          <a 
            href="https://map.kakao.com/link/to/경남 김해시 생림면 안양로 46번길 23,35.3369,128.8321" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center bg-[#3A7B89] text-white px-4 py-2 rounded-md hover:bg-[#2c5f6a] transition-colors"
          >
            <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 20L3 17V7L9 4L15 7L21 4V14L15 17L9 14V20Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9 4V20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M15 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            길찾기
          </a>
        </div>
      </div>
      
      {/* 추가 안내 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-6 text-[#3A7B89] dark:text-[#4FCADB]">상담 안내</h2>
        <p className="mb-4 dark:text-gray-200">
          동아풍수문화연구원에서는 풍수 관련 다양한 상담을 제공하고 있습니다. 
          방문 전 전화나 이메일로 예약하시면 더욱 원활한 상담이 가능합니다.
        </p>
        <div className="mt-6">
          <Link 
            href="/contact" 
            className="bg-[#3A7B89] text-white px-6 py-3 rounded-md hover:bg-[#2c5f6a] transition-colors"
          >
            상담 문의하기
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LocationPage;
