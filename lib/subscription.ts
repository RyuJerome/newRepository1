// 구독 신청 저장소 (docs/PRD.md 5장 Subscription)
// 지금은 브라우저 sessionStorage에 저장한다. 나중에 Supabase로 이 파일을 통째로 바꾼다.
// 화면 코드는 아래 함수 3개만 쓰고, 저장 위치는 알지 못한다.

import { getPlan } from "./plans";

export type Subscription = {
  id: string; // 신청 번호. 저장 시 생성
  name: string; // 신청자 이름. 빈 값 불가
  phone: string; // 휴대폰 번호. 숫자 11자리
  plan_id: string; // p01 | p02 | p03 | p04
  monthly_price: number; // 신청 시점의 매달 내는 금액(원)
  agreed_privacy: boolean; // 개인정보 수집·이용 동의. true일 때만 저장
  created_at: string; // 신청 일시(ISO 문자열). 저장 시 생성
};

const STORAGE_KEY = "uplus-plan:subscriptions";

// 서버 렌더링 중(window 없음)이나 저장소 접근이 막힌 경우 null
function getStore(): Storage | null {
  if (typeof window === "undefined") return null;
  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
}

function readAll(): Subscription[] {
  const store = getStore();
  if (!store) return [];
  try {
    const raw = store.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Subscription[]) : [];
  } catch {
    return [];
  }
}

function createId(): string {
  try {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
      return crypto.randomUUID();
    }
  } catch {
    // 아래 방식으로 만든다
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

export function saveSubscription(input: {
  name: string;
  phone: string;
  plan_id: string;
  agreed_privacy: boolean;
}): Subscription {
  if (input.agreed_privacy !== true) {
    throw new Error("개인정보 수집·이용에 동의해야 신청할 수 있어요.");
  }
  const name = typeof input.name === "string" ? input.name.trim() : "";
  if (name === "") {
    throw new Error("이름을 입력해 주세요.");
  }
  const phone = typeof input.phone === "string" ? input.phone : "";
  if (!/^\d{11}$/.test(phone)) {
    throw new Error("휴대폰 번호 11자리를 숫자로 입력해 주세요.");
  }
  const plan = getPlan(input.plan_id);
  if (!plan) {
    throw new Error("신청을 저장하지 못했어요. 다시 시도해 주세요.");
  }

  const store = getStore();
  if (!store) {
    throw new Error("신청을 저장하지 못했어요. 다시 시도해 주세요.");
  }

  const subscription: Subscription = {
    id: createId(),
    name,
    phone,
    plan_id: plan.id,
    monthly_price: plan.monthly_price,
    agreed_privacy: true,
    created_at: new Date().toISOString(),
  };

  try {
    store.setItem(STORAGE_KEY, JSON.stringify([...readAll(), subscription]));
  } catch {
    throw new Error("신청을 저장하지 못했어요. 다시 시도해 주세요.");
  }
  return subscription;
}

export function getLastSubscription(): Subscription | null {
  const all = readAll();
  return all.length > 0 ? all[all.length - 1] : null;
}

export function countSubscriptions(): number {
  return readAll().length;
}
