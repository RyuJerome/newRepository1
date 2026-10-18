// 요금제 목록 화면(/plans): 요금제 카드 4개와 필터 칩을 보여 준다.
import { Suspense } from "react";
import PlansView, { PlansLoading } from "./PlansView";

export default function PlansPage() {
  // 주소의 ?state 값을 읽는 동안에는 스켈레톤을 먼저 보여 준다
  return (
    <Suspense fallback={<PlansLoading />}>
      <PlansView />
    </Suspense>
  );
}
