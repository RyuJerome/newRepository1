// G4★ 규칙 3 가격: 금액은 "매달 내는 금액" 1개 + "할인 종료 후 금액" 최대 1개.
//   데이터(lib/plans.ts): PRD 표와 같은 값 · 순서, Plan 키는 PRD 5장 키만(정가 · 할인율 필드 없음),
//     할인 종료 후 금액은 PRD에서 할인 있는 요금제(p03)만, priceAfterLabel 결과 일치
//   소스(4-2부터): 카드(plan-card) · 상세(plan-detail) 파일이 priceAfterLabel을 쓰고,
//     app/에서 price_after_discount 직접 사용 0 · formatWon 인자는 monthly_price만 · 하드코딩 금액 0 · "%" 0
import { prdPlans, prdPlanKeys, walk, read, scanSource } from "../lib/common.mjs";
import { loadPlans, filesWithGate } from "../lib/plans-module.mjs";

const won = (n) => `${n.toLocaleString("en-US")}원`;

export async function checkPriceData() {
  const d = [];
  let m;
  try {
    m = await loadPlans();
  } catch (e) {
    return [`lib/plans.ts를 불러오지 못함: ${e.message.split("\n")[0]}`];
  }
  const want = prdPlans();
  const keys = new Set(prdPlanKeys());
  const plans = m.plans ?? [];
  const ids = plans.map((p) => p.id).join(",");
  if (ids !== want.map((p) => p.id).join(",")) d.push(`plans 순서 · 개수 ${ids} ≠ ${want.map((p) => p.id).join(",")}`);
  for (let i = 1; i < plans.length; i++) {
    if (plans[i].monthly_price < plans[i - 1].monthly_price) d.push("plans가 매달 내는 금액 낮은 순이 아님");
  }
  for (const w of want) {
    const p = plans.find((x) => x.id === w.id);
    if (!p) continue;
    for (const k of Object.keys(p)) if (!keys.has(k)) d.push(`${p.id}: PRD Plan에 없는 키 "${k}"`);
    if (p.monthly_price !== w.monthly_price) d.push(`${p.id}: monthly_price ${p.monthly_price} ≠ PRD ${w.monthly_price}`);
    if ((p.price_after_discount ?? null) !== w.price_after_discount) d.push(`${p.id}: price_after_discount ${p.price_after_discount} ≠ PRD ${w.price_after_discount}`);
    if (typeof m.formatWon === "function" && m.formatWon(w.monthly_price) !== won(w.monthly_price)) d.push(`formatWon(${w.monthly_price}) ≠ "${won(w.monthly_price)}"`);
    if (typeof m.priceAfterLabel === "function") {
      const label = m.priceAfterLabel(p);
      const expect = w.price_after_discount ? `${(w.discountMonths ?? 0) + 1}개월째부터 ${won(w.price_after_discount)}` : null;
      if (label !== expect) d.push(`${p.id}: priceAfterLabel "${label}" ≠ "${expect}"`);
    }
  }
  for (const fn of ["formatWon", "priceAfterLabel", "getPlan"]) if (typeof m[fn] !== "function") d.push(`lib/plans.ts에 ${fn} 없음`);
  return d;
}

function checkPriceSource() {
  const d = [];
  const cards = filesWithGate("plan-card");
  const details = filesWithGate("plan-detail");
  if (!cards.length) d.push('data-gate="plan-card" 파일 없음');
  if (!details.length) d.push('data-gate="plan-detail" 파일 없음');
  for (const f of [...cards, ...details]) if (!read(f).includes("priceAfterLabel(")) d.push(`${f}: priceAfterLabel 미사용`);
  for (const f of walk("app", [".tsx", ".ts", ".jsx", ".js"])) {
    const { code } = scanSource(read(f));
    if (code.includes("price_after_discount")) d.push(`${f}: price_after_discount 직접 사용`);
    for (const mm of code.matchAll(/formatWon\(([^)]*)\)/g)) {
      if (!/monthly_price\s*$/.test(mm[1].trim())) d.push(`${f}: formatWon(${mm[1]}) — monthly_price만 허용`);
    }
    if (/\d{1,3}(,\d{3})+\s*원/.test(code)) d.push(`${f}: 금액 하드코딩`);
    if (/\d\s*%/.test(code)) d.push(`${f}: "%" 할인율 표기`);
  }
  return d;
}

export default {
  id: "G4",
  name: "★ 규칙 3 가격",
  back: "4-1",
  async run(ctx) {
    const d = await checkPriceData();
    const src = ctx.stage === "4-1" ? [] : checkPriceSource();
    return { ok: d.length + src.length === 0, details: [...d, ...src], back: d.length ? "4-1" : "4-2" };
  },
};
