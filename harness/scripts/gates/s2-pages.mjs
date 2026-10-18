// S2 화면 명세: harness/02-pages.md에 PRD 라우트 4개가 모두 있고 /subscription/ 경로가 없으며,
//    screens.md의 "## " 개수 = PRD 라우트 수 (2단계)
import { exists, read, prdRoutes, screensHeadingCount } from "../lib/common.mjs";

const gate = {
  id: "S2",
  name: "화면 명세",
  back: "2",
  run() {
    const routes = prdRoutes();
    const details = [];
    const n = screensHeadingCount();
    if (n !== routes.length) details.push(`screens.md "## " ${n}개 ≠ PRD 라우트 ${routes.length}개`);
    if (!exists("harness/02-pages.md")) return { ok: false, details: [...details, "harness/02-pages.md 없음"] };
    const md = read("harness/02-pages.md");
    for (const r of routes) if (!md.includes(r)) details.push(`02-pages.md에 라우트 없음: ${r}`);
    if (md.includes("/subscription/")) details.push("02-pages.md에 /subscription/ 경로가 있음 (PRD 라우트를 써야 함)");
    return { ok: details.length === 0, details };
  },
};

export default gate;
