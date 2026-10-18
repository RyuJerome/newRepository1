// lib/plans.ts를 Node로 직접 불러온다 (Node 24의 TypeScript 타입 제거 실행)
import { pathToFileURL } from "node:url";
import { abs, exists, walk, read } from "./common.mjs";

export async function loadPlans() {
  if (!exists("lib/plans.ts")) throw new Error("lib/plans.ts 없음");
  const url = pathToFileURL(abs("lib/plans.ts")).href + `?t=${Date.now()}`;
  return import(url);
}

// data-gate 표시가 붙은 화면 파일 찾기
export const filesWithGate = (name) =>
  walk("app", [".tsx", ".jsx"]).filter((f) => read(f).includes(`data-gate="${name}"`));
