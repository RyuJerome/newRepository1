// 사람 승인용 localhost 스크린샷 (Playwright 없이 설치된 Chrome headless 사용, 390×844)
// 사용: npm run dev 실행 중에 node harness/scripts/review-shots.mjs [기준 URL, 기본 http://localhost:3000]
// 피그마 화면 링크 프레임 4개는 메인 대화가 Figma MCP get_screenshot으로 harness/review/figma/에 저장한다.
import fs from "node:fs";
import { spawnSync } from "node:child_process";
import { abs } from "./lib/common.mjs";

const CHROME = [
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Chromium.app/Contents/MacOS/Chromium",
].find((p) => fs.existsSync(p));
if (!CHROME) {
  console.error("Chrome을 찾지 못했습니다. 화면을 직접 열어 확인해 주세요.");
  process.exit(1);
}
const base = process.argv[2] ?? "http://localhost:3000";
const SCREENS = [
  ["plans", "/plans"],
  ["plan-detail-p03", "/plans/p03"],
  ["apply-p03", "/apply?plan=p03"],
  ["complete", "/complete"],
];
const STATES = ["", "loading", "empty", "error"];
const outDir = abs("harness/review/localhost");
fs.mkdirSync(outDir, { recursive: true });
for (const [name, route] of SCREENS) {
  for (const st of STATES) {
    const url = base + route + (st ? (route.includes("?") ? "&" : "?") + `state=${st}` : "");
    const file = `${outDir}/${name}${st ? "--" + st : ""}.png`;
    const r = spawnSync(CHROME, ["--headless=new", "--disable-gpu", "--hide-scrollbars", "--window-size=390,844", `--screenshot=${file}`, url], { encoding: "utf8", timeout: 60000 });
    console.log(`${r.status === 0 ? "✓" : "✗"} ${file.replace(abs("") + "/", "")}  ←  ${url}`);
  }
}
