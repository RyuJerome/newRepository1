// G5★ 규칙 5 속도: speedLabel(plan)을 직접 실행해 모든 요금제가
//   "소진 후 <n>Mbps로 제한" 또는 "속도 제한 없음" 중 하나이고 PRD 표의 소진 후 속도와 같다
//   (이름에 "무제한"이 들어간 p03 · p04 포함).
//   소스(4-2부터): 카드 · 상세 파일이 speedLabel을 쓰고, app/에 "Mbps" · "속도 제한 없음" 직접 표기 0
import { prdPlans, walk, read, scanSource } from "../lib/common.mjs";
import { loadPlans, filesWithGate } from "../lib/plans-module.mjs";

const PATTERN = /^(소진 후 \d+Mbps로 제한|속도 제한 없음)$/;

async function checkSpeedData() {
  let m;
  try {
    m = await loadPlans();
  } catch (e) {
    return [`lib/plans.ts를 불러오지 못함: ${e.message.split("\n")[0]}`];
  }
  if (typeof m.speedLabel !== "function") return ["lib/plans.ts에 speedLabel 없음"];
  const d = [];
  for (const w of prdPlans()) {
    const p = (m.plans ?? []).find((x) => x.id === w.id);
    if (!p) {
      d.push(`${w.id} 없음`);
      continue;
    }
    const label = m.speedLabel(p);
    const expect = w.speed === "속도 제한 없음" ? "속도 제한 없음" : `소진 후 ${w.speed}`;
    if (!PATTERN.test(label)) d.push(`${w.id}(${w.name}): "${label}"가 허용 형식이 아님`);
    else if (label !== expect) d.push(`${w.id}(${w.name}): "${label}" ≠ PRD "${expect}"`);
  }
  return d;
}

function checkSpeedSource() {
  const d = [];
  const files = [...filesWithGate("plan-card"), ...filesWithGate("plan-detail")];
  if (!files.length) d.push("plan-card · plan-detail 파일 없음");
  for (const f of files) if (!read(f).includes("speedLabel(")) d.push(`${f}: speedLabel 미사용`);
  for (const f of walk("app", [".tsx", ".ts", ".jsx", ".js"])) {
    const { code } = scanSource(read(f));
    if (/Mbps|속도 제한 없음/.test(code)) d.push(`${f}: 속도 문구 직접 표기 (speedLabel만 사용)`);
  }
  return d;
}

const gate = {
  id: "G5",
  name: "★ 규칙 5 속도",
  back: "4-1",
  async run(ctx) {
    const d = await checkSpeedData();
    const src = ctx.stage === "4-1" ? [] : checkSpeedSource();
    return { ok: d.length + src.length === 0, details: [...d, ...src], back: d.length ? "4-1" : "4-2" };
  },
};

export default gate;
