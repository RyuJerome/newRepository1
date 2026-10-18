// G11 저장 위치: "sessionStorage"와 "localStorage"가 lib/subscription.ts 밖에서 각각 0번
//   (app/ · lib/ · components/의 코드, 주석 포함해서 센다)
import { codeFiles, read, exists } from "../lib/common.mjs";

const OWNER = "lib/subscription.ts";

export default {
  id: "G11",
  name: "저장 위치",
  back: "4-1",
  run(ctx) {
    const details = [];
    if (!exists(OWNER)) details.push(`${OWNER} 없음`);
    for (const word of ["sessionStorage", "localStorage"]) {
      for (const f of codeFiles()) {
        if (f === OWNER) continue;
        const n = (read(f).match(new RegExp(word, "g")) ?? []).length;
        if (n) details.push(`${f}: ${word} ${n}번`);
      }
    }
    if (exists(OWNER) && /localStorage/.test(read(OWNER))) details.push(`${OWNER}: localStorage 사용 (sessionStorage만)`);
    const back = details.some((x) => x.startsWith("app/")) && ctx.stage !== "4-1" ? "4-2" : "4-1";
    return { ok: details.length === 0, details, back };
  },
};
