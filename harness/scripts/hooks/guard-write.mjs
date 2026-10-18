// PreToolUse 훅 (Write · Edit · MultiEdit · NotebookEdit). 막을 때 종료 코드 2 + 이유를 stderr로.
//   ① 원본(docs/ · reference/ · page-splitter · code-comments) 쓰기
//   ② 스크립트 전용 파일(app/tokens.css · harness/state.json · harness/05-report.md) 직접 쓰기
//   ③ 진행 중인 단계(harness/state.json current)의 편집 범위 밖 쓰기
//      단계가 없으면 구현 영역(app/ · lib/ · harness/01·02 · review/) 쓰기 — 메인 대화는 직접 구현하지 않는다
//   ④ app/ · lib/ · components/에 토큰 밖 값(G3) · 금지어(G13)가 들어간 쓰기
import fs from "node:fs";
import path from "node:path";
import { ROOT, PROTECTED, SCRIPT_ONLY, MANAGED, SCOPES, STAGE_NAMES, inList, readState } from "../lib/common.mjs";
import { checkTokenText, checkForbidden } from "../lib/token-rules.mjs";

const input = JSON.parse(fs.readFileSync(0, "utf8") || "{}");
const ti = input.tool_input ?? {};
const target = ti.file_path ?? ti.notebook_path;
if (!target) process.exit(0);
const full = path.resolve(input.cwd ?? ROOT, target);
const p = path.relative(ROOT, full).split(path.sep).join("/");
if (p.startsWith("..")) process.exit(0);

const block = (lines) => {
  console.error(["[하네스 훅] 쓰기를 막았습니다: " + p, ...lines].join("\n"));
  process.exit(2);
};

if (inList(p, PROTECTED)) block(["원본 파일은 읽기만 합니다 (CLAUDE.md 7절)."]);
if (inList(p, SCRIPT_ONLY)) block([`이 파일은 스크립트만 씁니다. app/tokens.css → node harness/scripts/build-tokens.mjs (3단계)`]);

const { current } = readState();
if (current) {
  if (!inList(p, SCOPES[current])) block([`지금은 ${current}단계(${STAGE_NAMES[current]})입니다. 편집 범위: ${SCOPES[current].join(", ") || "(스크립트만)"}`]);
} else if (inList(p, MANAGED)) {
  block(["진행 중인 단계가 없습니다. 메인 대화는 직접 구현하지 않습니다.", "node harness/scripts/stage.mjs start <단계> 후 해당 에이전트를 부르세요."]);
}

if (/^(app|lib|components)\//.test(p)) {
  const isWrite = typeof ti.content === "string";
  const text = isWrite ? ti.content : [ti.new_string, ...(ti.edits ?? []).map((e) => e.new_string)].filter(Boolean).join("\n");
  const opts = { fragment: !isWrite };
  const problems = [...checkTokenText(text, p, opts), ...checkForbidden(text, p, opts)];
  if (problems.length) block(["토큰 밖 값 · 금지어가 있습니다 (tokens.css의 토큰 클래스만 사용):", ...problems.slice(0, 15).map((x) => "  - " + x)]);
}
process.exit(0);
