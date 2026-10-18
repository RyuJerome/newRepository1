import { type Plan, formatWon, priceAfterLabel, speedLabel } from "@/lib/plans";
import RecommendTag from "./RecommendTag";
import { ButtonLink } from "./Button";

// 요금제 카드 1장: 추천 Tag · 이름 · 데이터량과 소진 후 속도 · 24개월 할인 Chip · 매달 내는 금액 · '자세히' 버튼
export default function PlanCard({ plan }: { plan: Plan }) {
  // 할인 종료 후 금액 문구. 할인이 없는 요금제는 줄을 그리지 않는다
  const after = priceAfterLabel(plan);
  return (
    <article
      data-gate="plan-card"
      data-plan={plan.id}
      className="flex w-full flex-col gap-8 rounded-16 border border-border-default bg-bg-surface p-20"
    >
      <RecommendTag plan={plan} />
      <h2 className="text-subtitle-bold text-text-primary">{plan.name}</h2>
      <p className="text-body-small-medium text-text-secondary">
        {plan.data} · {speedLabel(plan)}
      </p>
      {plan.discount_months !== null && (
        <span className="inline-flex w-fit items-center rounded-6 bg-bg-accent-subtle px-8 py-2 text-caption-bold text-icon-accent">
          {plan.discount_months}개월 할인
        </span>
      )}
      <div className="flex w-full items-center gap-12 pt-8">
        <div className="flex flex-1 flex-col gap-4">
          <p className="text-subtitle-bold text-text-primary">월 {formatWon(plan.monthly_price)}</p>
          {after !== null && <p className="text-caption-medium text-text-tertiary">{after}</p>}
        </div>
        <ButtonLink href={`/plans/${plan.id}`} variant="secondary" size="sm" full={false}>
          자세히
        </ButtonLink>
      </div>
    </article>
  );
}
