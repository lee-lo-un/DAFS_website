import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "묘지 풍수 - 현대 풍수",
  description: "전통적인 묘지 풍수 원리를 현대적으로 적용한 서비스를 제공합니다.",
}

export default function GraveServicePage() {
  return (
    <div className="container-width py-32">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">묘지 풍수 서비스</h1>

        <div className="prose prose-lg max-w-none">
          <p className="lead">
            묘지 풍수(명당)는 한국 풍수 문화의 중요한 부분으로, 조상을 공경하고 후손의 번영을 기원하는 전통적 가치를
            담고 있습니다. 현대 풍수는 이러한 전통적 원리를 현대적 맥락에서 존중하고 적용합니다.
          </p>

          <h2>묘지 풍수의 의미</h2>
          <p>
            전통적으로 묘지 풍수는 조상의 안식처가 후손의 운명에 영향을 미친다는 믿음에 기반합니다. 현대적 관점에서는
            이를 조상에 대한 존경과 가족 유산의 연속성으로 해석하며, 다음과 같은 가치를 중요시합니다:
          </p>

          <ul>
            <li>조상에 대한 존경과 기억</li>
            <li>가족의 유대감과 정체성 강화</li>
            <li>자연과의 조화로운 공존</li>
            <li>평화롭고 존엄한 안식처 제공</li>
          </ul>

          <h2>제공 서비스</h2>

          <h3>1. 묘지 위치 선정 자문</h3>
          <p>
            전통적인 풍수 원리와 현대적 환경 요소를 고려한 묘지 위치 선정을 도와드립니다. 이 서비스는 다음을 포함합니다:
          </p>
          <ul>
            <li>지형 및 주변 환경 분석</li>
            <li>방향 및 좌향 결정</li>
            <li>수맥과 토양 상태 평가</li>
            <li>접근성 및 유지 관리 용이성 고려</li>
            <li>법적 규제 및 환경 영향 검토</li>
          </ul>

          <h3>2. 기존 묘지 평가 및 개선</h3>
          <p>
            기존 묘지의 풍수적 특성을 평가하고, 필요한 경우 개선 방안을 제안합니다. 묘역 정비, 주변 환경 개선, 추가 식재
            등의 방법으로 더 조화로운 환경을 조성할 수 있습니다.
          </p>

          <h3>3. 가족 묘역 계획</h3>
          <p>
            여러 세대를 위한 가족 묘역을 계획하는 데 도움을 드립니다. 장기적인 관점에서 가족의 유산을 보존하고 기념할 수
            있는 공간을 설계합니다.
          </p>

          <h3>4. 현대적 추모 공간 설계</h3>
          <p>
            전통적인 묘지 외에도 현대적인 추모 공간(납골당, 수목장 등)에 풍수 원리를 적용하는 서비스를 제공합니다.
            변화하는 장례 문화 속에서도 풍수의 본질적 가치를 유지합니다.
          </p>

          <h2>서비스 진행 과정</h2>
          <ol>
            <li>
              <strong>가족 상담</strong> - 가족의 가치관, 전통, 희망 사항을 이해합니다.
            </li>
            <li>
              <strong>현장 조사</strong> - 후보지 또는 기존 묘지를 방문하여 상세한 분석을 진행합니다.
            </li>
            <li>
              <strong>풍수 분석</strong> - 전통적 풍수 원리와 현대적 요소를 종합적으로 분석합니다.
            </li>
            <li>
              <strong>구현 지원</strong> - 선택된 방안을 실행하는 데 필요한 지원과 자문을 제공합니다.
            </li>
          </ol>

          <div className="bg-muted p-6 rounded-lg mt-8">
            <h3 className="text-xl font-semibold mb-4">상담 예약</h3>
            <p>
              묘지 풍수 서비스는 가족의 소중한 결정을 돕기 위한 것입니다. 존중과 배려로 여러분의 필요에 맞는 최선의
              방안을 함께 찾아가겠습니다.
            </p>
            <p className="mt-4">
              <strong>전화:</strong> 02-123-4567
              <br />
              <strong>이메일:</strong> memorial@modernfengshui.kr
            </p>
            <div className="mt-6">
              <a
                href="/contact"
                className="bg-primary text-primary-foreground px-6 py-3 rounded-md font-medium hover:bg-primary/90 transition-colors"
              >
                상담 예약하기
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
