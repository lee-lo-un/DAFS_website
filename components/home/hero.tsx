"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const Hero = () => {
  return (
    <div className="relative pt-24 md:pt-32 pb-16 md:pb-24 overflow-hidden bg-stone-100">
      {/* 배경 이미지와 오버레이 - 고정 배경 사용하여 깜빡임 해결 */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-amber-50 opacity-50"></div>
        <Image
          src="/korean-landscape.png"
          alt="풍수 배경"
          fill
          className="object-cover opacity-15 mix-blend-multiply"
          priority
        />
      </div>

      <div className="container relative z-10">
        {/* 슬로건 섹션 - 헤더에서 이동 */}
        <div className="text-center mb-12">
          <div className="inline-flex items-start">
            <div className="w-20 h-20 md:w-24 md:h-24 mr-2 hidden md:block">
              <Image
                src="/images/donga-logo-transparent.png"
                alt="동아풍수문화연구원 로고"
                width={96}
                height={96}
                className="object-contain"
              />
            </div>
            <div>
              <p className="font-extrabold text-xl md:text-3xl mb-0 text-amber-500 dark:text-amber-400">
                명당의 도(道)
              </p>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-4 text-foreground dark:text-black">
                동아풍수문화연구원
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground dark:text-gray-800">
                자연과 인간이 조화롭게 공존하는 풍수지리
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center text-center">
          <h2 className="text-2xl md:text-2xl lg:text-3xl font-bold mb-5 text-foreground dark:text-black">
            자연의 <span className="text-primary dark:text-gray-600">기운</span>
            , 에너지{" "}
            <span className="text-primary dark:text-gray-600">과학</span>,
            인간의{" "}
            <span className="text-primary dark:text-gray-600">길흉화복</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground dark:text-gray-800 max-w-3xl mb-8">
            대중들이 잘 모르는 명당을 발굴하고, 건강·재물·명예와 살의 질을
            높이는 풍수 컨설팅 서비스
          </p>
          <div className="flex justify-center">
            <Link href="/services">
              <Button className="h-11 rounded-md px-8 gap-2">
                컨설팅 서비스 보기
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
