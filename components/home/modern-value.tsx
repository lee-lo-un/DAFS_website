"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { BarChart3, Compass, Lightbulb, Leaf } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const features = [
  {
    id: "scientific",
    title: "과학적 접근",
    icon: BarChart3,
    content:
      "전통적인 풍수지리 원리를 현대 과학과 접목하여 검증 가능한 방식으로 분석합니다. 빛, 공기 흐름, 소음, 자연 요소 등 실질적인 환경 요소를 고려한 과학적 접근법을 사용합니다.",
    image: "/images/scientific-approach.png",
    color: "primary",
  },
  {
    id: "modern",
    title: "현대적 해석",
    icon: Compass,
    content:
      "고대의 풍수 원리를 현대 주거 환경과 라이프스타일에 맞게 재해석합니다. 아파트, 오피스텔 등 현대 건축물에 적합한 풍수 원리를 적용하여 실용적인 솔루션을 제공합니다.",
    image: "/images/modern-interpretation.png",
    color: "secondary",
  },
  {
    id: "practical",
    title: "실용적 솔루션",
    icon: Lightbulb,
    content:
      "미신적 요소를 배제하고 실생활에 바로 적용할 수 있는 실용적인 조언을 제공합니다. 가구 배치, 색상 선택, 공간 활용 등 일상에서 쉽게 실천할 수 있는 방법을 제안합니다.",
    image: "/images/practical-solution.png",
    color: "accent",
  },
  {
    id: "sustainable",
    title: "지속가능한 환경",
    icon: Leaf,
    content:
      "자연과의 조화를 중시하는 풍수 철학을 바탕으로 지속가능한 생활 환경을 조성합니다. 에너지 효율성, 자연 요소의 활용, 친환경적 공간 설계를 통해 웰빙 라이프스타일을 지원합니다.",
    image: "/images/sustainable-environment.png",
    color: "primary",
  },
];

const ModernValue = () => {
  const [activeTab, setActiveTab] = useState("scientific");

  return (
    <section className="section-padding relative overflow-hidden bg-stone-100 dark:bg-gray-900">
      {/* 배경 장식 요소 */}
      <div className="absolute top-1/2 left-0 w-72 h-72 bg-blue-200/30 dark:bg-blue-900/30 rounded-full -translate-y-1/2 -translate-x-1/2 blur-3xl" />
      <div className="absolute top-1/3 right-0 w-80 h-80 bg-amber-200/30 dark:bg-amber-900/30 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
      <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-green-200/20 dark:bg-green-900/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />

      <div className="container-width relative z-10">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            동아 풍수의 가치
          </h2>
          <p className="text-foreground/70 max-w-2xl mx-auto">
            전통적인 풍수지리를 현대적으로 재해석하여 실용적이고 과학적인
            접근법을 제공합니다.
          </p>
        </motion.div>

        <Tabs
          defaultValue="scientific"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <div className="flex flex-col md:flex-row gap-8">
            <motion.div
              className="md:w-1/2"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <TabsList className="grid grid-cols-2 md:grid-cols-1 gap-2 h-auto bg-transparent">
                {features.map((feature) => (
                  <TabsTrigger
                    key={feature.id}
                    value={feature.id}
                    className={cn(
                      "flex items-center justify-start gap-3 p-4 h-auto border-2 rounded-lg mb-2 shadow-sm",
                      "bg-white dark:bg-gray-800",
                      feature.id === "scientific" && activeTab === feature.id
                        ? "border-blue-300 bg-blue-50 dark:border-blue-700 dark:bg-blue-900/40"
                        : "",
                      feature.id === "modern" && activeTab === feature.id
                        ? "border-amber-300 bg-amber-50 dark:border-amber-700 dark:bg-amber-900/40"
                        : "",
                      feature.id === "practical" && activeTab === feature.id
                        ? "border-green-300 bg-green-50 dark:border-green-700 dark:bg-green-900/40"
                        : "",
                      feature.id === "sustainable" && activeTab === feature.id
                        ? "border-teal-300 bg-teal-50 dark:border-teal-700 dark:bg-teal-900/40"
                        : "",
                      activeTab !== feature.id
                        ? "border-gray-200 dark:border-gray-700"
                        : "",
                      "transition-all duration-300 hover:shadow"
                    )}
                  >
                    <div
                      className={cn(
                        "p-2 rounded-md transition-all duration-300",
                        feature.id === "scientific"
                          ? "bg-blue-200 dark:bg-blue-700 text-gray-800 dark:text-white"
                          : "",
                        feature.id === "modern"
                          ? "bg-amber-200 dark:bg-amber-700 text-gray-800 dark:text-white"
                          : "",
                        feature.id === "practical"
                          ? "bg-green-200 dark:bg-green-700 text-gray-800 dark:text-white"
                          : "",
                        feature.id === "sustainable"
                          ? "bg-teal-200 dark:bg-teal-700 text-gray-800 dark:text-white"
                          : "",
                        activeTab !== feature.id
                          ? "bg-gray-100 dark:bg-gray-700 dark:text-gray-300"
                          : ""
                      )}
                    >
                      <feature.icon className="h-5 w-5" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-gray-800 dark:text-white">
                        {feature.title}
                      </p>
                    </div>
                  </TabsTrigger>
                ))}
              </TabsList>
            </motion.div>

            <motion.div
              className="md:w-1/2"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              {features.map((feature) => (
                <TabsContent
                  key={feature.id}
                  value={feature.id}
                  className="mt-0 h-full"
                >
                  <Card
                    className={cn(
                      "border-2 shadow-md h-full overflow-hidden rounded-lg",
                      "bg-white dark:bg-gray-800"
                    )}
                    style={{
                      borderColor:
                        feature.id === "scientific"
                          ? "rgb(191, 219, 254)"
                          : feature.id === "modern"
                          ? "rgb(253, 230, 138)"
                          : feature.id === "practical"
                          ? "rgb(187, 247, 208)"
                          : feature.id === "sustainable"
                          ? "rgb(153, 246, 228)"
                          : "",
                    }}
                  >
                    <CardContent className="p-6">
                      <div className="aspect-video rounded-lg overflow-hidden mb-6 relative group shadow-inner bg-white dark:bg-gray-700">
                        <div
                          className="absolute inset-0 bg-gradient-to-tr z-10"
                          style={{
                            background:
                              feature.id === "scientific"
                                ? "linear-gradient(to right top, rgba(59, 130, 246, 0.2), transparent)"
                                : feature.id === "modern"
                                ? "linear-gradient(to right top, rgba(245, 158, 11, 0.2), transparent)"
                                : feature.id === "practical"
                                ? "linear-gradient(to right top, rgba(34, 197, 94, 0.2), transparent)"
                                : feature.id === "sustainable"
                                ? "linear-gradient(to right top, rgba(20, 184, 166, 0.2), transparent)"
                                : "",
                          }}
                        />
                        <img
                          src={feature.image || "/placeholder.svg"}
                          alt={feature.title}
                          style={{
                            objectFit: "cover",
                            objectPosition: feature.id === "modern" || feature.id === "practical" ? "center 65%" : "center center"
                          }}
                          className="w-full h-full transition-transform duration-700 group-hover:scale-105"
                        />
                      </div>
                      <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                        {feature.content}
                      </p>
                    </CardContent>
                  </Card>
                </TabsContent>
              ))}
            </motion.div>
          </div>
        </Tabs>
      </div>
    </section>
  );
};

export default ModernValue;
