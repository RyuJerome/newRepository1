// "토큰 밖 값"(G3)과 "금지어"(G13)의 정의. 게이트와 훅이 같은 함수를 쓴다.
import { read, scanSource } from "./common.mjs";

export const loadTokens = () => JSON.parse(read("docs/tokens.json"));
const tail = (key) => key.split("/").slice(1).join("/");

// Design.md 2절 타이포 표 (크기 / 줄높이 / 굵기 묶음). 견본용 specimen/* 은 뺀다.
export function typographyStyles() {
  const md = read("docs/Design.md");
  const sec = md.split("## 2. 타이포 스케일")[1]?.split("\n## ")[0] ?? "";
  return [...sec.matchAll(/^\|\s*([a-z]+\/[a-z0-9-]+)\s*\|\s*(\d+)\s*\/\s*(\d+)\s*\|\s*[A-Za-z]+\s+(\d{3})\s*\|/gm)]
    .filter((m) => !m[1].startsWith("specimen/"))
    .map((m) => ({ name: m[1].replace("/", "-"), size: Number(m[2]), lineHeight: Number(m[3]), weight: Number(m[4]) }));
}

export const FONT_WEIGHTS = { medium: 500, semibold: 600, bold: 700 };

export function allowed() {
  const t = loadTokens();
  return {
    colors: new Set(Object.keys(t.semantic).map((k) => k.replace("/", "-"))),
    spacing: new Set(Object.values(t.spacing).map(String)),
    radius: new Set(Object.keys(t.radius).map(tail)),
    textStyles: new Set(typographyStyles().map((s) => s.name)),
  };
}

const SPACING_PREFIXES = [
  "scroll-mx", "scroll-my", "scroll-m", "scroll-px", "scroll-py", "scroll-p",
  "translate-x", "translate-y", "space-x", "space-y", "gap-x", "gap-y", "inset-x", "inset-y",
  "border-spacing", "min-w", "min-h", "max-w", "max-h",
  "px", "py", "pt", "pr", "pb", "pl", "ps", "pe", "mx", "my", "mt", "mr", "mb", "ml", "ms", "me",
  "gap", "size", "inset", "top", "right", "bottom", "left", "start", "end", "basis", "indent", "p", "m", "w", "h",
];
const TEXT_KEYWORDS = new Set(["left", "center", "right", "justify", "start", "end", "wrap", "nowrap", "balance", "pretty", "ellipsis", "clip"]);
const BG_KEYWORDS = new Set(["transparent", "current", "inherit", "none", "cover", "contain", "auto", "center", "top", "bottom", "left", "right", "no-repeat", "repeat", "fixed", "local", "scroll", "clip-text", "clip-border", "clip-padding", "clip-content"]);
const BORDER_KEYWORDS = new Set(["0", "solid", "dashed", "dotted", "double", "none", "hidden", "collapse", "separate"]);
const BORDER_SIDES = new Set(["t", "r", "b", "l", "x", "y", "s", "e"]);
const COLORISH = ["ring-offset", "inset-shadow", "drop-shadow", "text-shadow", "placeholder", "decoration", "outline", "divide", "accent", "caret", "shadow", "stroke", "fill", "ring", "from", "via", "to"];
const COLORISH_KEYWORDS = new Set(["current", "transparent", "none", "inherit", "0", "x", "y", "x-reverse", "y-reverse", "solid", "dashed", "dotted", "double", "hidden", "inset", "auto"]);
const RADIUS_RE = /^rounded(?:-(?:tl|tr|br|bl|ss|se|ee|es|t|r|b|l|s|e))?(?:-(.+))?$/;

// 클래스 하나를 검사해 위반 이유(문자열) 또는 null을 돌려준다
export function checkClass(raw, A) {
  if (!/^[!-]?[a-z@][a-z0-9:/.\-[\]#%!_()]*$/i.test(raw)) return null;
  if (raw.includes("[")) return "대괄호 임의 값";
  const cls = raw.split(":").pop().replace(/^!/, "").replace(/^-/, "");
  const hasAlpha = /\/\d+$/.test(cls);
  const base = cls.replace(/\/\d+$/, "");

  for (const pre of SPACING_PREFIXES) {
    if (base.startsWith(pre + "-")) {
      const v = base.slice(pre.length + 1);
      if (/^\d+(\.\d+)?$/.test(v) && !A.spacing.has(v)) return `간격 ${v}는 tokens.json spacing에 없음`;
      if (v === "px") return "1px(px) 간격은 토큰이 아님";
      return null;
    }
  }
  const r = base.match(RADIUS_RE);
  if (r) {
    if (r[1] === undefined) return "rounded 단독 금지 (rounded-<토큰>)";
    if (r[1] !== "none" && !A.radius.has(r[1])) return `모서리 ${r[1]}는 tokens.json radius에 없음`;
    return null;
  }
  if (base.startsWith("text-")) {
    const v = base.slice(5);
    if (A.colors.has(v)) return hasAlpha ? "색 투명도(/숫자)는 토큰이 아님" : null;
    if (A.textStyles.has(v) || TEXT_KEYWORDS.has(v)) return null;
    return `text-${v}는 토큰 색 · 텍스트 스타일이 아님`;
  }
  if (base.startsWith("bg-")) {
    const v = base.slice(3);
    if (A.colors.has(v)) return hasAlpha ? "색 투명도(/숫자)는 토큰이 아님" : null;
    if (BG_KEYWORDS.has(v)) return null;
    return `bg-${v}는 토큰 색이 아님`;
  }
  if (base === "border" || (base.startsWith("border-") && BORDER_SIDES.has(base.slice(7)))) return null;
  if (base.startsWith("border-")) {
    let v = base.slice(7);
    const side = v.split("-")[0];
    if (BORDER_SIDES.has(side) && v.includes("-")) v = v.slice(side.length + 1);
    if (A.colors.has(v)) return hasAlpha ? "색 투명도(/숫자)는 토큰이 아님" : null;
    if (BORDER_KEYWORDS.has(v)) return null;
    return `border-${v}는 토큰 색 · 허용 두께가 아님`;
  }
  for (const pre of COLORISH) {
    if (base === pre) return null;
    if (base.startsWith(pre + "-")) {
      const v = base.slice(pre.length + 1);
      if (A.colors.has(v)) return hasAlpha ? "색 투명도(/숫자)는 토큰이 아님" : null;
      if (COLORISH_KEYWORDS.has(v)) return null;
      return `${pre}-${v}는 토큰 색이 아님`;
    }
  }
  if (base.startsWith("font-")) {
    const v = base.slice(5);
    if (v === "sans" || v in FONT_WEIGHTS) return null;
    return `font-${v}는 허용되지 않음 (font-sans · medium · semibold · bold)`;
  }
  if (/^(leading|tracking)-/.test(base)) return `${base.split("-")[0]}-*는 금지 (텍스트 스타일 클래스로 묶어서 사용)`;
  if (base.startsWith("opacity-") && !["0", "100"].includes(base.slice(8))) return "opacity는 0 · 100만 허용";
  return null;
}

// 원시 값 패턴: 색 코드 · 색 함수 · 인라인 style
const RAW_PATTERNS = [
  [/#[0-9a-fA-F]{3,8}\b/g, "# 색 코드"],
  [/\b(?:rgba?|hsla?|oklch|oklab|lab|lch|color-mix)\(/g, "색 함수"],
  [/\bstyle\s*=\s*\{/g, "style={...} 인라인 스타일"],
];
const CSS_UNIT = [/(?<![\w-])\d*\.?\d+(?:px|rem|em)\b/g, "CSS 직접 단위 값(px · rem · em)"];

// 파일 내용 검사. fragment=true면 Edit의 일부 조각(문자열이 잘려 있을 수 있음)
export function checkTokenText(text, file, { fragment = false } = {}) {
  const A = allowed();
  const out = [];
  const { code, strings } = scanSource(text);
  const src = fragment ? text : code;
  const lineOf = (idx) => src.slice(0, idx).split("\n").length;
  const patterns = file.endsWith(".css") ? [...RAW_PATTERNS, CSS_UNIT] : RAW_PATTERNS;
  for (const [re, why] of patterns) {
    for (const m of src.matchAll(re)) out.push(`${file}:${lineOf(m.index)} ${why} "${m[0]}"`);
  }
  if (/\.(tsx|jsx|ts|js)$/.test(file) || file.endsWith(".css")) {
    // 클래스는 문자열 리터럴 · @apply 에서만 센다 (조각이면 전체 단어)
    const pool = fragment ? [text] : file.endsWith(".css") ? [...code.matchAll(/@apply([^;]+);/g)].map((m) => m[1]) : strings;
    const seen = new Set();
    for (const s of pool) {
      for (const tok of s.split(/[\s"'`{}()<>,;=]+/)) {
        if (!tok || seen.has(tok)) continue;
        seen.add(tok);
        const why = checkClass(tok, A);
        if (why) out.push(`${file} 클래스 "${tok}": ${why}`);
      }
    }
  }
  return out;
}

// G13 금지어 (주석은 빼고 센다)
const FORBIDDEN = [
  [/할인가/g, "할인가"],
  [/프로모션가/g, "프로모션가"],
  [/정가/g, "정가"],
  [/line-through/g, "취소선 line-through"],
  [/<(?:s|del|strike)[\s>]/g, "취소선 태그"],
];
export function checkForbidden(text, file, { fragment = false } = {}) {
  const src = fragment ? text : scanSource(text).code;
  const out = [];
  for (const [re, why] of FORBIDDEN) {
    for (const m of src.matchAll(re)) out.push(`${file}:${src.slice(0, m.index).split("\n").length} 금지어 ${why}`);
  }
  return out;
}
