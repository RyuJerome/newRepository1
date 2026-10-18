// G10a 재제출 방지: /complete 화면 코드(app/complete/**)에 "/apply"가 0번
import { walk, read, scanSource, exists } from "../lib/common.mjs";

export default {
  id: "G10a",
  name: "재제출 방지",
  back: "4-2",
  run() {
    if (!exists("app/complete")) return { ok: false, details: ["app/complete 없음"] };
    const details = walk("app/complete")
      .filter((f) => scanSource(read(f)).code.includes("/apply"))
      .map((f) => `${f}: "/apply" 있음`);
    return { ok: details.length === 0, details };
  },
};
