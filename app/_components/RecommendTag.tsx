// 추천 Tag. 추천 요금제(p03)일 때만 보이고, 아니면 아무것도 그리지 않는다
import type { Plan } from "@/lib/plans";

export default function RecommendTag({ plan }: { plan: Plan }) {
  if (!plan.recommended) return null;
  return (
    <span
      data-gate="recommend-tag"
      className="inline-flex w-fit items-center justify-center rounded-999 bg-border-subtle px-12 py-4 text-caption-bold text-text-secondary"
    >
      추천
    </span>
  );
}
