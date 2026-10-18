// 사람 승인용 localhost 스크린샷 (Playwright 없이 설치된 Chrome headless 사용, 390×844)
// headless Chrome은 --window-size로 500px보다 좁게 그리지 못하므로,
// DevTools 프로토콜(Emulation.setDeviceMetricsOverride)로 화면을 390×844 모바일로 맞춘 뒤 찍는다.
// 사용: npm run dev 실행 중에 node harness/scripts/review-shots.mjs [기준 URL, 기본 http://localhost:3000]
// 피그마 화면 링크 프레임 4개는 메인 대화가 Figma MCP get_screenshot으로 harness/review/figma/에 저장한다.
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawn } from "node:child_process";
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
const WIDTH = 390;
const HEIGHT = 844;
const PORT = 9333;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const profile = fs.mkdtempSync(path.join(os.tmpdir(), "review-shots-"));
const chrome = spawn(CHROME, ["--headless=new", "--disable-gpu", "--hide-scrollbars", `--remote-debugging-port=${PORT}`, `--user-data-dir=${profile}`, "about:blank"], { stdio: "ignore" });

async function pageSocketUrl() {
  for (let i = 0; i < 50; i++) {
    try {
      const list = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json();
      const page = list.find((t) => t.type === "page");
      if (page) return page.webSocketDebuggerUrl;
    } catch {
      // Chrome이 아직 뜨는 중
    }
    await sleep(200);
  }
  throw new Error("Chrome DevTools에 연결하지 못했습니다.");
}

function connect(url) {
  const ws = new WebSocket(url);
  let id = 0;
  const pending = new Map();
  const waiters = [];
  ws.onmessage = (ev) => {
    const msg = JSON.parse(ev.data);
    if (msg.id && pending.has(msg.id)) {
      pending.get(msg.id)(msg);
      pending.delete(msg.id);
    } else if (msg.method) {
      for (const w of waiters.filter((x) => x.method === msg.method)) {
        waiters.splice(waiters.indexOf(w), 1);
        w.resolve(msg);
      }
    }
  };
  const send = (method, params = {}) =>
    new Promise((resolve) => {
      const n = ++id;
      pending.set(n, resolve);
      ws.send(JSON.stringify({ id: n, method, params }));
    });
  const once = (method, timeout = 15000) =>
    Promise.race([new Promise((resolve) => waiters.push({ method, resolve })), sleep(timeout)]);
  return new Promise((resolve) => (ws.onopen = () => resolve({ send, once, close: () => ws.close() })));
}

try {
  const cdp = await connect(await pageSocketUrl());
  await cdp.send("Page.enable");
  await cdp.send("Emulation.setDeviceMetricsOverride", { width: WIDTH, height: HEIGHT, deviceScaleFactor: 1, mobile: true });
  const outDir = abs("harness/review/localhost");
  fs.mkdirSync(outDir, { recursive: true });
  for (const [name, route] of SCREENS) {
    for (const st of STATES) {
      const url = base + route + (st ? (route.includes("?") ? "&" : "?") + `state=${st}` : "");
      const file = `${outDir}/${name}${st ? "--" + st : ""}.png`;
      const loaded = cdp.once("Page.loadEventFired");
      await cdp.send("Page.navigate", { url });
      await loaded;
      await sleep(1500); // 클라이언트 화면이 그려질 시간
      const shot = await cdp.send("Page.captureScreenshot", { format: "png" });
      fs.writeFileSync(file, Buffer.from(shot.result.data, "base64"));
      console.log(`✓ ${file.replace(abs("") + "/", "")}  ←  ${url}`);
    }
  }
  cdp.close();
} finally {
  const exited = new Promise((r) => chrome.once("exit", r));
  chrome.kill();
  await Promise.race([exited, sleep(5000)]);
  fs.rmSync(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
}
