// 화면 아래에 붙어 있는 버튼 영역 (상세 · 신청 · 완료 화면)
import type { ReactNode } from "react";

export default function BottomCTA({ children }: { children: ReactNode }) {
  return (
    <div className="sticky bottom-0 flex w-full flex-col gap-8 border-t border-border-subtle bg-bg-surface px-24 pt-16 pb-32">
      {children}
    </div>
  );
}
