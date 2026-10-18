// G13 금지어: app/ · lib/ · components/의 코드(주석 제외)에
//   "할인가" · "프로모션가" · "정가" · line-through · <s> · <del> · <strike> = 0개
import { codeFiles, read } from "../lib/common.mjs";
import { checkForbidden } from "../lib/token-rules.mjs";

export default {
  id: "G13",
  name: "금지어",
  back: "4-2",
  run() {
    const details = codeFiles().flatMap((f) => checkForbidden(read(f), f));
    const back = details.some((x) => x.startsWith("lib/")) ? "4-1" : "4-2";
    return { ok: details.length === 0, details, back };
  },
};
