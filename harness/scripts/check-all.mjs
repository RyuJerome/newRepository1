// 자동 게이트 실행기. 결과를 harness/05-report.md에 쓰고, 하나라도 실패하면 종료 코드 1.
// 사용: node harness/scripts/check-all.mjs [--stage 1|2|3|4-1|4-2|5]   (기본 5 = 전부)
import fs from "node:fs";
import { pathToFileURL } from "node:url";
import { abs, STAGES, STAGE_NAMES } from "./lib/common.mjs";
import S1 from "./gates/s1-context.mjs";
import S2 from "./gates/s2-pages.mjs";
import G1 from "./gates/g1-routes.mjs";
import G2 from "./gates/g2-tokens-sync.mjs";
import G3 from "./gates/g3-token-values.mjs";
import G4 from "./gates/g4-price.mjs";
import G5 from "./gates/g5-speed.mjs";
import G10a from "./gates/g10a-no-resubmit.mjs";
import G11 from "./gates/g11-storage.mjs";
import G13 from "./gates/g13-forbidden.mjs";
import G14 from "./gates/g14-protect.mjs";
import G15 from "./gates/g15-build-lint.mjs";

// 단계마다 도는 게이트 (CLAUDE.md 2절 표)
export const STAGE_GATES = {
  "1": [S1, G14],
  "2": [S2, G14],
  "3": [G2, G14],
  "4-1": [G4, G5, G11, G14],
  "4-2": [G1, G3, G4, G5, G10a, G11, G13, G14, G15],
  "5": [S1, S2, G1, G2, G3, G4, G5, G10a, G11, G13, G14, G15],
};

export async function runStage(stage) {
  const results = [];
  for (const g of STAGE_GATES[stage]) {
    let r;
    try {
      r = await g.run({ stage });
    } catch (e) {
      r = { ok: false, details: [`게이트 실행 오류: ${e.message}`] };
    }
    const back = g.back === "현재 단계" ? stage : (r.back ?? g.back);
    results.push({ id: g.id, name: g.name, ok: r.ok, back, details: r.details ?? [] });
  }
  return results;
}

function report(stage, results) {
  const failed = results.filter((r) => !r.ok);
  const L = [
    "# 05-report — 자동 게이트 결과",
    "",
    `- 단계: ${stage} ${STAGE_NAMES[stage]}`,
    `- 시각: ${new Date().toISOString()}`,
    `- 결과: ${failed.length ? `실패 ${failed.length}개` : "전부 통과"}`,
    "",
    "| 게이트 | 이름 | 결과 | 복귀 |",
    "|---|---|---|---|",
    ...results.map((r) => `| ${r.id} | ${r.name} | ${r.ok ? "통과" : "실패"} | ${r.ok ? "-" : r.back} |`),
  ];
  for (const r of failed) {
    L.push("", `## ${r.id} ${r.name} — 실패 (복귀: ${r.back})`, "");
    for (const d of r.details.slice(0, 30)) L.push(`- ${d}`);
    if (r.details.length > 30) L.push(`- … 외 ${r.details.length - 30}개`);
  }
  if (stage === "5" && !failed.length) L.push("", "자동 게이트 통과 — 사람 승인(CLAUDE.md 5절) 준비");
  return L.join("\n") + "\n";
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const i = process.argv.indexOf("--stage");
  const stage = i >= 0 ? process.argv[i + 1] : "5";
  if (!STAGES.includes(stage)) {
    console.error(`알 수 없는 단계: ${stage} (${STAGES.join(", ")})`);
    process.exit(2);
  }
  const results = await runStage(stage);
  const text = report(stage, results);
  fs.mkdirSync(abs("harness"), { recursive: true });
  fs.writeFileSync(abs("harness/05-report.md"), text);
  for (const r of results) {
    console.log(`${r.ok ? "✓" : "✗"} ${r.id.padEnd(4)} ${r.name}${r.ok ? "" : `  → 복귀 ${r.back}`}`);
    if (!r.ok) for (const d of r.details.slice(0, 5)) console.log(`      ${d}`);
  }
  const failed = results.filter((r) => !r.ok).length;
  console.log(failed ? `\n실패 ${failed}개 — harness/05-report.md` : "\n전부 통과");
  process.exit(failed ? 1 : 0);
}
