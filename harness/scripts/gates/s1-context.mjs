// S1 맥락 파일: harness/01-context.md에 필수 제목 6개가 있다 (1단계)
import { exists, read } from "../lib/common.mjs";

const HEADINGS = ["## 1. 유저 스토리", "## 2. 판정 규칙", "## 3. 충돌표", "## 4. 결정표", "## 5. data-gate 계약", "## 6. 확인 필요"];

export default {
  id: "S1",
  name: "맥락 파일",
  back: "1",
  run() {
    if (!exists("harness/01-context.md")) return { ok: false, details: ["harness/01-context.md 없음"] };
    const md = read("harness/01-context.md");
    const details = HEADINGS.filter((h) => !md.includes(h)).map((h) => `제목 없음: ${h}`);
    if (!md.includes("data-gate=\"plan-card\"")) details.push("data-gate 계약 블록이 복사되지 않음 (plan-card 없음)");
    return { ok: details.length === 0, details };
  },
};
