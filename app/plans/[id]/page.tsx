// 요금제 상세 화면(/plans/[id]): 고른 요금제의 금액 · 데이터 · 소진 후 속도를 보여 주고 신청으로 넘긴다.
import { Suspense } from "react";
import { plans } from "@/lib/plans";
import PlanDetailView, { PlanDetailLoading } from "./PlanDetailView";

// p01~p04 상세 화면을 미리 만들어 둔다
export function generateStaticParams() {
  return plans.map((plan) => ({ id: plan.id }));
}

export default function PlanDetailPage() {
  return (
    <Suspense fallback={<PlanDetailLoading />}>
      <PlanDetailView />
    </Suspense>
  );
}
