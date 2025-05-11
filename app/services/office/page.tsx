import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "사무 공간 풍수 - 현대 풍수",
  description: "사무실과 업무 공간에 적용할 수 있는 현대적 풍수 서비스를 제공합니다.",
}

export default function OfficeServicePage() {
  return (
    <div className="container-width py-32">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">사무 공간 풍수 서비스</h1>

        <div className="prose prose-lg max-w-none">
          <p className="lead">
            사무 공간의 에너지 흐름은 비즈니스 성공, 직원 생산성 및 전반적인 직장 분위기에 중요한 영향을 미칩니다. 현대
            풍수는 현대적인 업무 환경에 고대의 지혜를 적용하여 번영과 성공을 촉진합니다.
          </p>

          <h2>사무 공간 풍수의 중요성</h2>
          <p>적절한 풍수 원리가 적용된 사무 공간은 다음과 같은 이점을 제공합니다:</p>

          <ul>
            <li>직원 생산성 및 창의성 향상</li>
            <li>팀워크와 협업 증진</li>
            <li>직장 스트레스 감소</li>
            <li>비즈니스 성장 및 번영 지원</li>
            <li>고객 및 방문객에게 긍정적인 인상 제공</li>
          </ul>

          <h2>제공 서비스</h2>

          <h3>1. 사무실 풍수 컨설팅</h3>
          <p>전문가가 귀사의 사무 공간을 방문하여 종합적인 풍수 분석을 제공합니다. 이 서비스는 다음을 포함합니다:</p>
          <ul>
            <li>사무실 위치 및 건물 외부 환경 분석</li>
            <li>내부 공간 배치 및 에너지 흐름 평가</li>
            <li>업무 구역, 회의실, 휴게 공간의 최적 배치</li>
            <li>경영진 사무실 및 중요 업무 공간의 특별 분석</li>
            <li>색상, 조명, 장식 요소에 대한 조언</li>
          </ul>

          <h3>2. 신규 사무실 설계 자문</h3>
          <p>
            새로운 사무실을 설계하거나 이전을 계획 중이신가요? 설계 단계에서부터 풍수 원리를 적용하여 비즈니스 성공을
            지원하는 공간을 만들 수 있도록 도와드립니다.
          </p>

          <h3>3. 경영진 사무실 최적화</h3>
          <p>
            리더십 공간은 권위, 결정력, 비전을 지원해야 합니다. 경영진 사무실 최적화 서비스는 리더의 역할을 강화하고
            명확한 사고와 현명한 의사 결정을 촉진하는 환경을 조성합니다.
          </p>

          <h3>4. 상업 공간 풍수</h3>
          <p>
            상점, 레스토랑, 호텔 등 고객 대면 비즈니스를 위한 특화된 풍수 솔루션을 제공합니다. 고객 유치, 체류 시간
            증가, 재방문율 향상을 위한 공간 설계를 지원합니다.
          </p>

          <h2>서비스 진행 과정</h2>
          <ol>
            <li>
              <strong>비즈니스 상담</strong> - 귀사의 비즈니스 목표와 현재 도전 과제를 이해합니다.
            </li>
            <li>
              <strong>현장 분석</strong> - 전문가가 사무 공간을 방문하여 상세한 분석을 진행합니다.
            </li>
            <li>
              <strong>구현 계획</strong> - 업무 중단을 최소화하면서 변경 사항을 구현하기 위한 단계별 계획을 수립합니다.
            </li>
            <li>
              <strong>사후 평가</strong> - 변화 후 비즈니스 성과와 직원 만족도를 평가합니다.
            </li>
          </ol>

          <div className="bg-muted p-6 rounded-lg mt-8">
            <h3 className="text-xl font-semibold mb-4">비즈니스 상담 예약</h3>
            <p>
              사무 공간 풍수 서비스에 관심이 있으시다면, 아래 연락처로 문의하거나 온라인 예약 시스템을 통해 비즈니스
              상담을 예약해 주세요.
            </p>
            <p className="mt-4">
              <strong>전화:</strong> 02-123-4567
              <br />
              <strong>이메일:</strong> office@modernfengshui.kr
            </p>
            <div className="mt-6">
              <a
                href="/contact"
                className="bg-primary text-primary-foreground px-6 py-3 rounded-md font-medium hover:bg-primary/90 transition-colors"
              >
                비즈니스 상담 예약하기
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
