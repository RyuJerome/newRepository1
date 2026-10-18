// 단계 시작 · 통과 · 복귀 기록 (harness/state.json). 훅은 state.current로 편집 범위를 정한다.
// 사용:
//   node harness/scripts/stage.mjs status
//   node harness/scripts/stage.mjs start <단계>
//   node harness/scripts/stage.mjs pass <단계>            단계 게이트 + 변경 범위 검사 → 통과 기록 (커밋은 메인 대화)
//   node harness/scripts/stage.mjs fail <단계> --back <복귀 단계> [--human] [--reason "..."]
//   node harness/scripts/stage.mjs approve                사람 승인 기록 (5단계 통과 후)
import { spawnSync } from "node:child_process";
import { ROOT, STAGES, STAGE_NAMES, SCOPES, ALWAYS_OK, STAGE_SCRIPT_OUTPUTS, inList, readState, writeState, sh } from "./lib/common.mjs";

const MAX_RETRIES = 2;
const [cmd, arg, ...rest] = process.argv.slice(2);
const opt = (name) => {
  const i = rest.indexOf(name);
  return i >= 0 ? rest[i + 1] : undefined;
};
const state = readState();
const now = () => new Date().toISOString();
const need = (s) => {
  if (!STAGES.includes(s)) {
    console.error(`알 수 없는 단계: ${s} (${STAGES.join(", ")})`);
    process.exit(2);
  }
};
const nextStage = () => STAGES.find((s) => state.stages[s].status !== "passed") ?? null;

// 단계 시작 이후 바뀐 파일 (마지막 커밋 기준)
function changedFiles() {
  const r = sh("git", ["status", "--porcelain", "-uall"]);
  return r.out.split("\n").filter(Boolean).map((l) => l.slice(3).split(" -> ").pop().replace(/^"|"$/g, ""));
}

if (cmd === "status" || !cmd) {
  for (const s of STAGES) {
    const st = state.stages[s];
    console.log(`${s.padEnd(4)} ${STAGE_NAMES[s].padEnd(8)} ${st.status.padEnd(8)} 자동 복귀 ${st.retries}/${MAX_RETRIES}`);
  }
  console.log(`\n진행 중: ${state.current ?? "없음"} · 다음: ${nextStage() ?? "없음"} · 사람 승인: ${state.approved ? "O" : "-"}`);
  const last = sh("git", ["log", "-1", "--format=%h %s"]).out.trim();
  console.log(`마지막 커밋: ${last}`);
} else if (cmd === "start") {
  need(arg);
  const prev = STAGES[STAGES.indexOf(arg) - 1];
  if (prev && state.stages[prev].status !== "passed") {
    console.error(`앞 단계 ${prev}(${STAGE_NAMES[prev]})가 통과되지 않았습니다.`);
    process.exit(1);
  }
  state.current = arg;
  state.stages[arg].status = "running";
  state.stages[arg].started_at = now();
  writeState(state);
  console.log(`시작: ${arg} ${STAGE_NAMES[arg]} · 편집 범위: ${SCOPES[arg].join(", ") || "(스크립트만)"}`);
} else if (cmd === "pass") {
  need(arg);
  if (state.current !== arg) {
    console.error(`진행 중인 단계가 ${state.current ?? "없음"}입니다. 먼저 start ${arg}`);
    process.exit(1);
  }
  const gate = spawnSync(process.execPath, ["harness/scripts/check-all.mjs", "--stage", arg], { cwd: ROOT, stdio: "inherit" });
  const allowed = [...SCOPES[arg], ...ALWAYS_OK, ...(STAGE_SCRIPT_OUTPUTS[arg] ?? [])];
  const outside = changedFiles().filter((f) => !inList(f, allowed));
  if (outside.length) {
    console.error(`\n✗ 범위 밖 변경 (${arg} 허용: ${allowed.join(", ")})`);
    for (const f of outside) console.error(`   ${f}`);
  }
  if (gate.status !== 0 || outside.length) {
    console.error(`\n통과 아님 — harness/05-report.md의 복귀 단계로 stage.mjs fail ${arg} --back <단계>`);
    process.exit(1);
  }
  state.stages[arg].status = "passed";
  state.stages[arg].passed_at = now();
  state.current = null;
  writeState(state);
  console.log(`\n통과: ${arg} ${STAGE_NAMES[arg]}`);
  console.log(`커밋: git add -A && git commit -m "harness: ${arg}단계 ${STAGE_NAMES[arg]} 통과"`);
} else if (cmd === "fail") {
  need(arg);
  const back = opt("--back");
  need(back);
  const human = rest.includes("--human");
  // 복귀 단계부터 뒤는 다시 해야 한다
  for (const s of STAGES.slice(STAGES.indexOf(back))) {
    if (state.stages[s].status !== "pending") state.stages[s].status = "pending";
  }
  if (!human) state.stages[back].retries += 1;
  state.stages[back].last_reason = opt("--reason") ?? "";
  state.current = null;
  state.approved = false;
  writeState(state);
  if (!human && state.stages[back].retries > MAX_RETRIES) {
    console.error(`STOP: ${back}단계로 자동 복귀 ${MAX_RETRIES}번 뒤에도 실패. 사람에게 물어보세요.`);
    process.exit(3);
  }
  console.log(`복귀: ${back} ${STAGE_NAMES[back]}${human ? " (사람 지적, 횟수에 세지 않음)" : ` (자동 복귀 ${state.stages[back].retries}/${MAX_RETRIES})`}`);
} else if (cmd === "approve") {
  if (state.stages["5"].status !== "passed") {
    console.error("5단계 자동 게이트가 통과되지 않았습니다.");
    process.exit(1);
  }
  state.approved = true;
  state.approved_at = now();
  writeState(state);
  console.log('사람 승인 기록. 커밋: git add -A && git commit -m "harness: 사람 승인 — 완료"');
} else {
  console.error(`알 수 없는 명령: ${cmd}`);
  process.exit(2);
}
