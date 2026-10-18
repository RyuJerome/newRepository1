// G15 build · lint: npm run build와 npm run lint가 0으로 끝난다
import { sh } from "../lib/common.mjs";

const lastLines = (s, n = 15) => s.trim().split("\n").slice(-n);

export default {
  id: "G15",
  name: "build · lint",
  back: "4-2",
  run() {
    const details = [];
    const b = sh("npm", ["run", "build"]);
    if (b.code !== 0) details.push("npm run build 실패", ...lastLines(b.out));
    const l = sh("npm", ["run", "lint"]);
    if (l.code !== 0) details.push("npm run lint 실패", ...lastLines(l.out));
    return { ok: details.length === 0, details };
  },
};
