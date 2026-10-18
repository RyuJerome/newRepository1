// G2 토큰 동기화: app/tokens.css = tokens.json으로 지금 다시 만든 결과 (한 글자라도 다르면 실패 → 3단계)
import { exists, read } from "../lib/common.mjs";
import { generateTokensCss, TOKENS_CSS } from "../build-tokens.mjs";

export default {
  id: "G2",
  name: "토큰 동기화",
  back: "3",
  run() {
    if (!exists(TOKENS_CSS)) return { ok: false, details: [`${TOKENS_CSS} 없음`] };
    const same = read(TOKENS_CSS) === generateTokensCss();
    return { ok: same, details: same ? [] : [`${TOKENS_CSS}가 tokens.json과 다름 (직접 수정 또는 tokens.json 변경)`] };
  },
};
