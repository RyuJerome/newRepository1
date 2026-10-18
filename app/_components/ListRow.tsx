// 정보 한 줄: 왼쪽 라벨 + 오른쪽 값 (상세 · 신청 · 완료 화면)
import type { ReactNode } from "react";

export default function ListRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex w-full items-center gap-12 border-b border-border-subtle px-4 py-12">
      <dt className="flex-1 text-body-small-medium text-text-secondary">{label}</dt>
      <dd className="text-right text-body-small-strong text-text-primary">{value}</dd>
    </div>
  );
}
