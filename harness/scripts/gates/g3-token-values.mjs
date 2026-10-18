// G3 토큰 밖 값: app/ · lib/ · components/ (app/tokens.css 제외)에서
//    # 색 코드 · 색 함수 · style={} · 대괄호 임의 값 · tokens.json에 없는 숫자 클래스 · 기본 팔레트 · CSS 직접 단위 = 0개
import { codeFiles, read } from "../lib/common.mjs";
import { checkTokenText } from "../lib/token-rules.mjs";

export default {
  id: "G3",
  name: "토큰 밖 값",
  back: "4-2",
  run() {
    const details = codeFiles()
      .filter((f) => f !== "app/tokens.css")
      .flatMap((f) => checkTokenText(read(f), f));
    return { ok: details.length === 0, details };
  },
};
