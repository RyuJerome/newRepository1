// PreToolUse 훅 (Bash). 막을 때 종료 코드 2.
//   ① git: push · 새 브랜치 · worktree · reset --hard · clean (main 하나, push 금지)
//   ② 원본 · 스크립트 전용 파일을 셸로 바꾸는 명령 (리다이렉트 · tee · sed -i · rm · mv · cp · touch · git checkout/restore)
import fs from "node:fs";

const input = JSON.parse(fs.readFileSync(0, "utf8") || "{}");
const cmd = input.tool_input?.command ?? "";
const block = (why) => {
  console.error(`[하네스 훅] 명령을 막았습니다: ${why}\n  ${cmd}`);
  process.exit(2);
};

const GIT_RULES = [
  [/\bgit\s+push\b/, "push 금지"],
  [/\bgit\s+(checkout\s+-[bB]|switch\s+-[cC]|branch\s+[^-\s])/, "새 브랜치 금지 (main만)"],
  [/\bgit\s+worktree\b/, "worktree 금지"],
  [/\bgit\s+reset\s+--hard\b/, "reset --hard 금지"],
  [/\bgit\s+clean\b/, "git clean 금지"],
];
for (const [re, why] of GIT_RULES) if (re.test(cmd)) block(why);

const GUARDED = /(?:^|[\s"'=/.])(docs\/|reference\/|\.claude\/agents\/page-splitter\.md|\.claude\/skills\/code-comments|app\/tokens\.css|harness\/state\.json|harness\/05-report\.md)/;
for (const seg of cmd.split(/&&|\|\||;|\n/)) {
  // 리다이렉트 · tee 대상
  for (const m of seg.matchAll(/(?:>>?|\btee\s+(?:-a\s+)?)\s*["']?([^\s"';|&]+)/g)) {
    if (GUARDED.test(" " + m[1])) block(`보호 파일에 쓰기 (${m[1]})`);
  }
  if (/\b(sed\s+-i|perl\s+-p?i|rm|mv|cp|touch|truncate|git\s+(checkout|restore|rm|mv))\b/.test(seg) && GUARDED.test(seg)) {
    block("보호 파일을 바꾸는 명령");
  }
}
process.exit(0);
