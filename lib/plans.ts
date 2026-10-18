// 요금제 데이터 (docs/PRD.md 4장 요금제 데이터 표 · 5장 Plan과 같은 값)
// 이 파일은 다른 파일을 import하지 않는다. 판정 스크립트가 Node로 직접 실행한다.

export type Plan = {
  id: string;
  name: string;
  monthly_price: number; // 매달 내는 금액(원)
  data: string; // "10GB" | "50GB" | "기본 100GB" | "무제한"
  throttle_after: string | null; // 소진 후 속도. 제한 없으면 null
  price_after_discount: number | null; // 할인 종료 후 월 요금. 할인 없으면 null
  discount_months: number | null; // 할인 기간(개월). 할인 없으면 null
  description: string; // 한 줄 설명
  recommended: boolean; // 추천 Tag 표시 여부 (p03만 true)
};

// 매달 내는 금액 낮은 순: p01 → p02 → p03 → p04
export const plans: Plan[] = [
  {
    id: "p01",
    name: "슬림 10GB",
    monthly_price: 39000,
    data: "10GB",
    throttle_after: "1Mbps",
    price_after_discount: null,
    discount_months: null,
    description: "출퇴근 영상 시청이 적은 고객용 기본 요금제",
    recommended: false,
  },
  {
    id: "p02",
    name: "데일리 50GB",
    monthly_price: 52000,
    data: "50GB",
    throttle_after: "1Mbps",
    price_after_discount: null,
    discount_months: null,
    description: "출퇴근길 영상을 월말까지 보고 싶은 고객용",
    recommended: false,
  },
  {
    id: "p03",
    name: "무제한 라이트",
    monthly_price: 59000,
    data: "기본 100GB",
    throttle_after: "5Mbps",
    price_after_discount: 69000,
    discount_months: 24,
    description: "이름은 무제한이지만 기본 데이터 소진 후 속도가 제한됨",
    recommended: true,
  },
  {
    id: "p04",
    name: "무제한 프리",
    monthly_price: 75000,
    data: "무제한",
    throttle_after: null,
    price_after_discount: null,
    discount_months: null,
    description: "데이터를 다 써도 속도 제한이 없는 요금제",
    recommended: false,
  },
];

export function getPlan(id: string): Plan | undefined {
  return plans.find((plan) => plan.id === id);
}

// 39000 → "39,000원"
export function formatWon(n: number): string {
  return `${String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}원`;
}

// "소진 후 1Mbps로 제한" 또는 "속도 제한 없음"
export function speedLabel(plan: Plan): string {
  return plan.throttle_after ? `소진 후 ${plan.throttle_after}로 제한` : "속도 제한 없음";
}

// p03 → "25개월째부터 69,000원", 할인 없으면 null
export function priceAfterLabel(plan: Plan): string | null {
  if (plan.price_after_discount === null || plan.discount_months === null) return null;
  return `${plan.discount_months + 1}개월째부터 ${formatWon(plan.price_after_discount)}`;
}
