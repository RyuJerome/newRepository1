// 화면 아래에 붙어 있는 버튼 영역 (상세 · 신청 · 완료 화면)
import type { ReactNode } from "react";

// 본문 아래 빈 공간의 높이. 버튼 영역에 가려지지 않게, 화면마다 버튼 영역 높이 이상으로 비워 둔다
//   short: 버튼 1개 (완료 화면) · medium: 금액 줄 + 버튼 1개 (상세 화면) · tall: 오류 문구 + 버튼 2개 (신청 화면)
const RESERVE = {
  short: "pt-64 pb-48",
  medium: "pt-80 pb-80",
  tall: "pt-80 pb-80 mb-48",
} as const;

type BottomCTAProps = { children: ReactNode; reserve: keyof typeof RESERVE };

export default function BottomCTA({ children, reserve }: BottomCTAProps) {
  return (
    <>
      {/* 본문 끝의 빈 공간: 마지막 줄까지 스크롤해서 볼 수 있게 한다 */}
      <div aria-hidden="true" className={`w-full shrink-0 ${RESERVE[reserve]}`} />
      {/* 버튼 영역: 화면 아래에 고정. 앱과 같은 기준 폭 안에서 가운데에 놓인다 */}
      <div className="layout-width fixed inset-x-0 bottom-0 mx-auto flex flex-col gap-8 border-t border-border-subtle bg-bg-surface px-24 pt-16 pb-32">
        {children}
      </div>
    </>
  );
}
