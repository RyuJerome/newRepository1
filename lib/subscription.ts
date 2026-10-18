// 구독 신청 저장소 (docs/PRD.md 5장 Subscription)
// Supabase의 public.subscriptions 테이블에 저장하고 조회한다 (supabase/subscriptions.sql).
// 화면 코드는 아래 함수만 쓰고, 저장 위치는 알지 못한다.

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { getPlan } from "./plans";

export type Subscription = {
  id: string; // 신청 번호. DB가 저장 시 생성
  name: string; // 신청자 이름. 빈 값 불가
  phone: string; // 휴대폰 번호. 숫자 11자리
  plan_id: string; // p01 | p02 | p03 | p04
  monthly_price: number; // 신청 시점의 매달 내는 금액(원)
  agreed_privacy: boolean; // 개인정보 수집·이용 동의. true일 때만 저장
  created_at: string; // 신청 일시(ISO 문자열). DB가 저장 시 생성
};

const TABLE = "subscriptions";
const SAVE_FAILED = "신청을 저장하지 못했어요. 다시 시도해 주세요.";

let client: SupabaseClient | null = null;

// 처음 쓸 때 한 번만 연결을 만든다. 로그인을 쓰지 않으므로 브라우저에 아무것도 남기지 않는다.
function getClient(): SupabaseClient {
  if (client) return client;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) {
    throw new Error("Supabase 연결 정보(NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY)가 없어요.");
  }
  client = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return client;
}

export async function saveSubscription(input: {
  name: string;
  phone: string;
  plan_id: string;
  agreed_privacy: boolean;
}): Promise<Subscription> {
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
    throw new Error(SAVE_FAILED);
  }

  const supabase = getClient();
  // id · created_at은 보내지 않는다. DB가 만든다.
  const { data, error } = await supabase
    .from(TABLE)
    .insert({
      name,
      phone,
      plan_id: plan.id,
      monthly_price: plan.monthly_price,
      agreed_privacy: true,
    })
    .select()
    .single();

  if (error || !data) {
    throw new Error(SAVE_FAILED);
  }
  return data as Subscription;
}

// 신청 번호로 1건만 조회한다. 없으면 null
export async function getSubscription(id: string): Promise<Subscription | null> {
  const supabase = getClient();
  const { data, error } = await supabase.from(TABLE).select("*").eq("id", id).maybeSingle();
  if (error) {
    throw new Error("신청 내역을 불러오지 못했어요. 다시 시도해 주세요.");
  }
  return (data as Subscription | null) ?? null;
}

// 이름 가운데를 *로 가린다. 홍 → 홍, 김철 → 김*, 홍길동 → 홍*동, 남궁민수 → 남**수
export function maskName(name: string): string {
  const chars = Array.from(name.trim());
  if (chars.length <= 1) return chars.join("");
  if (chars.length === 2) return `${chars[0]}*`;
  return chars[0] + "*".repeat(chars.length - 2) + chars[chars.length - 1];
}

// 휴대폰 번호 가운데 4자리를 가린다. 01012345678 → 010-****-5678
// 11자리가 아니면 숫자 가운데 4자리만 *로 바꿔 원번호가 다 보이지 않게 한다.
export function maskPhone(phone: string): string {
  const digits = String(phone ?? "").replace(/\D/g, "");
  if (digits.length === 11) {
    return `${digits.slice(0, 3)}-****-${digits.slice(7)}`;
  }
  if (digits.length <= 4) return "*".repeat(digits.length);
  const start = Math.floor((digits.length - 4) / 2);
  return digits.slice(0, start) + "****" + digits.slice(start + 4);
}
