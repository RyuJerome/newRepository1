// G1 화면 수: app/ 아래 page.tsx 라우트 집합 = PRD 라우트 4개 (그 밖의 page 0개),
//    screens.md "## " 개수 = 4
import { walk, prdRoutes, screensHeadingCount } from "../lib/common.mjs";

export function appRoutes() {
  return walk("app", [".tsx", ".ts", ".jsx", ".js"])
    .filter((f) => /\/page\.(tsx|ts|jsx|js)$/.test(f))
    .filter((f) => !f.split("/").some((seg) => seg.startsWith("_")))
    .map((f) => {
      const segs = f.split("/").slice(1, -1).filter((s) => !(s.startsWith("(") && s.endsWith(")")));
      return "/" + segs.join("/");
    });
}

export default {
  id: "G1",
  name: "화면 수",
  back: "2",
  run() {
    const want = prdRoutes();
    const got = appRoutes();
    const details = [];
    const n = screensHeadingCount();
    if (n !== want.length) details.push(`screens.md "## " ${n}개 ≠ ${want.length}`);
    if (got.length !== want.length) details.push(`page 파일 ${got.length}개 ≠ ${want.length}개: ${got.join(", ") || "(없음)"}`);
    for (const r of want) if (!got.includes(r)) details.push(`라우트 없음: ${r}`);
    for (const r of got) if (!want.includes(r)) details.push(`PRD에 없는 라우트: ${r}`);
    return { ok: details.length === 0, details };
  },
};
