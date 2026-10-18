// G14 원본 보호: docs/ · reference/ · 기존 page-splitter 에이전트 · code-comments 스킬의
//   git 변경(수정 · 추가 · 삭제)이 0개
import { sh, PROTECTED } from "../lib/common.mjs";

const gate = {
  id: "G14",
  name: "원본 보호",
  back: "현재 단계",
  run() {
    const r = sh("git", ["status", "--porcelain", "-uall", "--", ...PROTECTED]);
    if (r.code !== 0) return { ok: false, details: [`git status 실패: ${r.out.trim()}`] };
    const details = r.out.split("\n").filter(Boolean).map((l) => `바뀜: ${l}`);
    return { ok: details.length === 0, details };
  },
};

export default gate;
