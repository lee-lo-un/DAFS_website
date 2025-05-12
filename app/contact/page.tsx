"use client";

import type React from "react";

import { useState } from "react";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSearchParams } from "next/navigation";

export default function ContactPage() {
  const searchParams = useSearchParams();
  const defaultPackage = searchParams.get("package") || "";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    serviceType: defaultPackage || "residential",
    otherServiceType: "",
    packageType: defaultPackage || "basic",
    date: new Date(), // 오늘 날짜를 기본값으로 설정
    message: "",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setFormData((prev) => ({ ...prev, date }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 카카오 채널로 리디렉션
    window.open("http://pf.kakao.com/_xaxjNBn", "_blank");
  };

  const handleConsultToKakao = () => {
    // 서비스 종류 처리 (기타 옵션 포함)
    let serviceTypeText = "";
    if (formData.serviceType === "residential") {
      serviceTypeText = "주거 풍수";
    } else if (formData.serviceType === "office") {
      serviceTypeText = "사무실 풍수";
    } else if (formData.serviceType === "grave") {
      serviceTypeText = "묘지 풍수";
    } else if (formData.serviceType === "other") {
      serviceTypeText = `기타 (${formData.otherServiceType})`;
    }

    // 패키지 종류 처리
    let packageTypeText = "";
    if (formData.packageType === "basic") {
      packageTypeText = "기본 상담 (₩150,000 ~ ₩300,000)";
    } else if (formData.packageType === "premium") {
      packageTypeText = "프리미엄 상담 (₩500,000 ~ ₩800,000)";
    } else if (formData.packageType === "vip") {
      packageTypeText = "VIP 상담";
    }

    // 날짜 포맷팅
    const formattedDate = formData.date
      ? format(formData.date, "yyyy년 MM월 dd일")
      : "";

    // 메시지 생성
    const message = `
🌿 풍수 상담 신청서

📌 이름: ${formData.name}
📧 이메일: ${formData.email}
📱 연락처: ${formData.phone}
🔮 서비스 종류: ${serviceTypeText}
💼 상담 패키지: ${packageTypeText}
📅 희망 상담일: ${formattedDate}

📝 문의 내용:
${formData.message}
`.trim();

    // 메시지 복사
    navigator.clipboard
      .writeText(message)
      .then(() => {
        // 안내 후 카카오톡 채팅창 열기
        alert(
          "✅ 상담 신청 내용이 복사되었습니다.\n카카오톡 채팅창에 붙여넣어 주세요!"
        );
        window.open("https://pf.kakao.com/_xaxjNBn/chat", "_blank");
      })
      .catch((err) => {
        console.error("클립보드 복사 실패:", err);
        alert(
          "상담 내용 복사에 실패했습니다. 카카오톡 채팅창에서 직접 내용을 작성해주세요."
        );
        window.open("https://pf.kakao.com/_xaxjNBn/chat", "_blank");
      });
  };

  return (
    <div className="flex flex-col bg-muted min-h-screen">
      {/* Hero Section */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-24 px-4 md:px-8 bg-gradient-to-b from-primary/10 to-background">
        <div className="container-width">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">상담 신청</h1>
            <p className="text-xl text-foreground/70 mb-8">
              모던 풍수의 전문가들이 당신의 공간에 최적의 에너지를 불어넣어
              드립니다.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-16 px-4 md:px-8">
        <div className="container-width">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold mb-6">문의하기</h2>
              <div className="text-foreground/70 mb-8">
                <div>
                  상담 또는 문의 사항이 있으시면 전화나 문자로 연락을 주시거나
                  카카오톡으로 연락해주시기 바랍니다.
                </div>
                <div>
                  카카오톡 연락시에는 연락처와 성함을 남겨주시면 빠른 시일 내에
                  연락 드리겠습니다.
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="mr-4 p-2 bg-primary/10 rounded-full">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-primary"
                    >
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">전화</h3>
                    <p className="text-foreground/70">010-4135-9319</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="mr-4 p-2 bg-primary/10 rounded-full">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-primary"
                    >
                      <rect width="20" height="16" x="2" y="4" rx="2" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">이메일</h3>
                    <p className="text-foreground/70">kingsky1122@naver.com</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="mr-4 p-2 bg-primary/10 rounded-full">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-primary"
                    >
                      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">주소</h3>
                    <p className="text-foreground/70">
                      경남 김해시 생림면 안양로 46번길 23
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex flex-col gap-4">
                <h3 className="text-xl font-bold mb-4">상담 시간</h3>
                <div className="space-y-2">
                  <div>주중, 주말, 공휴일, 주야간 모두 가능</div>
                </div>
              </div>
            </div>

            <div>
              {!isSubmitted ? (
                <Card>
                  <CardHeader>
                    <CardTitle>상담 신청</CardTitle>
                    <CardDescription>
                      <div>아래 양식을 작성하여 상담을 신청해 주세요.</div>
                      <div>
                        신청버튼 누르시면 작성된 내용양식이 자동 복사가 됩니다.
                      </div>
                      <div>
                        연결된 카카오톡 채팅창에 붙여넣기(Ctrl+V)해 주시면
                        됩니다.
                      </div>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="name">이름</Label>
                            <Input
                              id="name"
                              name="name"
                              placeholder="홍길동"
                              value={formData.name}
                              onChange={handleChange}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email">이메일</Label>
                            <Input
                              id="email"
                              name="email"
                              type="email"
                              placeholder="example@email.com"
                              value={formData.email}
                              onChange={handleChange}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="phone">연락처</Label>
                            <Input
                              id="phone"
                              name="phone"
                              placeholder="010-1234-5678"
                              value={formData.phone}
                              onChange={handleChange}
                              required
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>서비스 종류</Label>
                          <RadioGroup
                            value={formData.serviceType}
                            onValueChange={(value) =>
                              handleSelectChange("serviceType", value)
                            }
                            className="grid grid-cols-2 gap-4"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem
                                value="residential"
                                id="residential"
                              />
                              <Label htmlFor="residential">주거 풍수</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="office" id="office" />
                              <Label htmlFor="office">사무실 풍수</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="grave" id="grave" />
                              <Label htmlFor="grave">묘지 풍수</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="other" id="other" />
                              <Label htmlFor="other">기타</Label>
                            </div>
                          </RadioGroup>

                          {formData.serviceType === "other" && (
                            <div className="mt-2">
                              <Input
                                id="otherServiceType"
                                name="otherServiceType"
                                placeholder="서비스 종류를 입력해주세요"
                                value={formData.otherServiceType}
                                onChange={handleChange}
                                required={formData.serviceType === "other"}
                              />
                            </div>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label>상담 패키지</Label>
                          <Select
                            value={formData.packageType}
                            onValueChange={(value) =>
                              handleSelectChange("packageType", value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="패키지 선택" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="basic">
                                기본 상담 (₩150,000 ~ ₩300,000)
                              </SelectItem>
                              <SelectItem value="premium">
                                프리미엄 상담 (₩500,000 ~ ₩800,000)
                              </SelectItem>
                              <SelectItem value="vip">VIP 상담</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label>희망 상담일</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full justify-start text-left font-normal",
                                  !formData.date && "text-muted-foreground"
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {formData.date
                                  ? format(formData.date, "PPP")
                                  : "날짜 선택"}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar
                                mode="single"
                                selected={formData.date}
                                onSelect={handleDateChange}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="message">문의 내용</Label>
                          <Textarea
                            id="message"
                            name="message"
                            placeholder="상담 받고 싶은 내용이나 궁금한 점을 자유롭게 작성해 주세요."
                            value={formData.message}
                            onChange={handleChange}
                            rows={4}
                          />
                        </div>
                      </div>

                      <Button
                        type="button"
                        className="w-full"
                        onClick={handleConsultToKakao}
                      >
                        카카오톡으로 상담 신청하기
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              ) : (
                <Card className="border-primary">
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center justify-center text-center space-y-4">
                      <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                        <CheckCircle2 className="h-8 w-8 text-primary" />
                      </div>
                      <h3 className="text-2xl font-bold">
                        신청이 완료되었습니다
                      </h3>
                      <p className="text-foreground/70">
                        상담 신청이 성공적으로 접수되었습니다. 담당자가 빠른
                        시일 내에 연락드릴 예정입니다. 입력하신 이메일로 접수
                        확인 메일이 발송되었습니다.
                      </p>
                      <Button
                        onClick={() => setIsSubmitted(false)}
                        variant="outline"
                        className="mt-4"
                      >
                        다시 작성하기
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 px-4 md:px-8 bg-muted">
        <div className="container-width">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">오시는 길</h2>
            <Button asChild className="mt-4">
              <a href="/location">오시는 길 페이지 이동</a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
