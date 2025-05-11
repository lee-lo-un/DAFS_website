import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "주거 공간 풍수 - 현대 풍수",
  description: "주거 공간에 적용할 수 있는 현대적 풍수 서비스를 제공합니다.",
}

export default function ResidentialServicePage() {
  return (
    <div className="container-width py-32">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">주거 공간 풍수 서비스</h1>

        <div className="prose prose-lg max-w-none">
          <p className="lead">
            주거 공간은 우리가 휴식을 취하고, 가족과 시간을 보내며, 에너지를 재충전하는 중요한 장소입니다. 현대 풍수는
            이러한 공간에 조화와 균형을 가져와 거주자의 웰빙과 행복을 증진시킵니다.
          </p>

          <h2>주거 공간 풍수의 중요성</h2>
          <p>
            주거 공간의 풍수는 가족 구성원의 건강, 관계, 번영에 직접적인 영향을 미칩니다. 적절한 풍수 원리를 적용하면
            다음과 같은 이점을 얻을 수 있습니다:
          </p>

          <ul>
            <li>가족 구성원 간의 조화로운 관계 증진</li>
            <li>휴식과 수면의 질 향상</li>
            <li>스트레스 감소와 전반적인 웰빙 증진</li>
            <li>긍정적인 에너지 흐름 촉진</li>
            <li>재정적 안정과 번영 지원</li>
          </ul>

          <h2>제공 서비스</h2>

          <h3>1. 주거 공간 풍수 컨설팅</h3>
          <p>전문가가 귀하의 주거 공간을 방문하여 종합적인 풍수 분석을 제공합니다. 이 서비스는 다음을 포함합니다:</p>
          <ul>
            <li>주택의 외부 환경 및 방향 분석</li>
            <li>내부 공간 배치 및 에너지 흐름 평가</li>
            <li>각 방의 기능과 배치에 대한 상세한 분석</li>
            <li>가구 배치 및 색상 조화에 대한 조언</li>
            <li>개선을 위한 맞춤형 권장 사항</li>
          </ul>

          <h3>2. 신축 주택 설계 자문</h3>
          <p>
            새 집을 짓거나 대규모 리모델링을 계획 중이신가요? 설계 단계에서부터 풍수 원리를 적용하여 조화롭고 에너지가
            풍부한 공간을 만들 수 있도록 도와드립니다.
          </p>

          <h3>3. 침실 풍수 최적화</h3>
          <p>
            수면의 질과 회복은 전반적인 건강에 필수적입니다. 침실 풍수 최적화 서비스는 침대 위치, 색상 선택, 장식 배치
            등을 통해 휴식과 회복에 이상적인 환경을 조성합니다.
          </p>

          <h3>4. 아파트 풍수 솔루션</h3>
          <p>
            한국의 아파트 환경에 특화된 풍수 솔루션을 제공합니다. 제한된 공간에서도 최적의 에너지 흐름을 만들고 가족의
            웰빙을 증진시키는 방법을 알려드립니다.
          </p>

          <h2>서비스 진행 과정</h2>
          <ol>
            <li>
              <strong>초기 상담</strong> - 귀하의 필요와 목표를 이해합니다.
            </li>
            <li>
              <strong>현장 방문 및 분석</strong> - 전문가가 직접 방문하여 상세한 분석을 진행합니다.
            </li>
            <li>
              <strong>구현 지원</strong> - 권장 사항을 실행하는 데 필요한 지원과 자문을 제공합니다.
            </li>
            <li>
              <strong>사후 점검</strong> - 변화 후 에너지 흐름을 확인하고 추가 조정이 필요한지 평가합니다.
            </li>
          </ol>

          <div className="bg-muted p-6 rounded-lg mt-8">
            <h3 className="text-xl font-semibold mb-4">상담 예약</h3>
            <p>
              주거 공간 풍수 서비스에 관심이 있으시다면, 아래 연락처로 문의하거나 온라인 예약 시스템을 통해 상담을
              예약해 주세요.
            </p>
            <p className="mt-4">
              <strong>전화:</strong> 02-123-4567
              <br />
              <strong>이메일:</strong> residential@modernfengshui.kr
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
