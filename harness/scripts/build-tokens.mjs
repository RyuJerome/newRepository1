// 3단계 토큰 적용: docs/tokens.json → app/tokens.css (Tailwind v4 @theme)
// Tailwind 기본 색 · 간격 · 모서리 · 글자 값을 끄고 토큰 이름만 다시 정의한다.
// 사용: node harness/scripts/build-tokens.mjs [--out 경로] [--check]
import fs from "node:fs";
import crypto from "node:crypto";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { abs, read } from "./lib/common.mjs";
import { loadTokens, typographyStyles, FONT_WEIGHTS } from "./lib/token-rules.mjs";

export const TOKENS_CSS = "app/tokens.css";

const px = (n) => `${n}px`;
const byNumber = (entries) => entries.sort((a, b) => Number(a[1]) - Number(b[1]));

export function generateTokensCss() {
  const raw = read("docs/tokens.json");
  const t = loadTokens();
  const hash = crypto.createHash("sha256").update(raw).digest("hex");
  const sizes = new Set(Object.values(t.typography).filter((v) => typeof v === "number"));
  const styles = typographyStyles();
  for (const s of styles) {
    if (!sizes.has(s.size)) throw new Error(`Design.md 텍스트 스타일 ${s.name}의 크기 ${s.size}가 tokens.json typography에 없습니다`);
  }

  const L = [];
  L.push("/* 자동 생성 파일 — 직접 수정 금지.");
  L.push("   원본: docs/tokens.json (텍스트 스타일 묶음의 줄높이 · 굵기는 docs/Design.md 2절 표)");
  L.push("   생성: node harness/scripts/build-tokens.mjs");
  L.push(`   tokens-sha256: ${hash} */`);
  L.push("");
  L.push("@theme {");
  L.push("  /* Tailwind 기본 값 끄기 */");
  for (const ns of ["color", "spacing", "radius", "text", "font", "font-weight", "leading", "tracking", "shadow", "inset-shadow", "drop-shadow", "text-shadow"]) {
    L.push(`  --${ns}-*: initial;`);
  }
  L.push("");
  L.push("  /* 색: semantic 토큰 (예: text/primary → text-text-primary, bg/surface → bg-bg-surface) */");
  for (const [k, v] of Object.entries(t.semantic)) L.push(`  --color-${k.replace("/", "-")}: ${v.value};`);
  L.push("");
  L.push("  /* 간격: 클래스 숫자 = px (예: p-16 = 16px) */");
  for (const [, v] of byNumber(Object.entries(t.spacing))) L.push(`  --spacing-${v}: ${px(v)};`);
  L.push("");
  L.push("  /* 모서리 (예: rounded-16, rounded-full) */");
  for (const [k, v] of byNumber(Object.entries(t.radius))) L.push(`  --radius-${k.split("/")[1]}: ${px(v)};`);
  L.push("");
  L.push("  /* 글꼴 */");
  L.push(`  --font-sans: var(--font-noto-sans-kr), "${t.typography["font-family/family-font"]}", sans-serif;`);
  for (const [k, v] of Object.entries(FONT_WEIGHTS)) L.push(`  --font-weight-${k}: ${v};`);
  L.push("");
  L.push("  /* 텍스트 스타일: 크기 · 줄높이 · 굵기 묶음 (예: text-heading-h3), 자간 0 */");
  for (const s of styles) {
    L.push(`  --text-${s.name}: ${px(s.size)};`);
    L.push(`  --text-${s.name}--line-height: ${px(s.lineHeight)};`);
    L.push(`  --text-${s.name}--font-weight: ${s.weight};`);
    L.push(`  --text-${s.name}--letter-spacing: 0px;`);
  }
  L.push("}");
  return L.join("\n") + "\n";
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const args = process.argv.slice(2);
  const outIdx = args.indexOf("--out");
  const out = outIdx >= 0 ? path.resolve(args[outIdx + 1]) : abs(TOKENS_CSS);
  const css = generateTokensCss();
  if (args.includes("--check")) {
    const same = fs.existsSync(out) && fs.readFileSync(out, "utf8") === css;
    console.log(same ? "tokens.css = tokens.json (일치)" : "tokens.css ≠ tokens.json (3단계 다시 실행 필요)");
    process.exit(same ? 0 : 1);
  }
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, css);
  console.log(`생성: ${path.relative(process.cwd(), out)}`);
}
