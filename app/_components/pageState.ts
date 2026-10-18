// 주소의 ?state 값을 읽어 화면 상태(기본 · 로딩 · 빈 · 오류)로 바꾼다. 다른 값이나 값이 없으면 기본
export type PageState ="default" | "loading" | "empty" | "error";

export function readPageState(params: { get(name: string): string | null }): PageState {
  const value = params.get("state");
  return value === "loading" || value === "empty" || value === "error" ? value : "default";
}

// 근거 문구가 없는 자리에 넣는 말
export const UNKNOWN_MESSAGE = "확인 필요";
