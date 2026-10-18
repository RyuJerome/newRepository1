"use client";

// 신청 완료 화면 본문: 완료 표시 · 신청 내역 5줄 · '요금제 더 보기' 버튼을 그린다.
import { useEffect, useSyncExternalStore } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getPlan, formatWon } from "@/lib/plans";
import { countSubscriptions, getLastSubscription } from "@/lib/subscription";
import Header from "../_components/Header";
import ListRow from "../_components/ListRow";
import BottomCTA from "../_components/BottomCTA";
import { ButtonLink } from "../_components/Button";
import { DoneMark } from "../_components/icons";
import StateMessage from "../_components/StateMessage";
import { SkeletonBox } from "../_components/Skeleton";
import { readPageState, UNKNOWN_MESSAGE } from "../_components/pageState";

// 저장된 신청 수를 브라우저에서만 읽기 위한 준비 값. 서버에서 그릴 때는 아직 모름(NOT_READY)
const noopSubscribe = () => () => {};
const NOT_READY = -1;

// 로딩 상태(?state=loading): 완료 표시 · 신청 내역 자리에 회색 상자만 보여 준다
export function CompleteLoading() {
  return (
    <div aria-busy="true" className="flex w-full flex-col items-center gap-24 p-16">
      <SkeletonBox className="size-64 rounded-full" />
      <SkeletonBox className="h-32 rounded-8" />
      <SkeletonBox className="h-80 rounded-12" />
      <SkeletonBox className="h-80 rounded-12" />
    </div>
  );
}

export default function CompleteView() {
  const router = useRouter();
  const state = readPageState(useSearchParams());
  const count = useSyncExternalStore(noopSubscribe, countSubscriptions, () => NOT_READY);

  // 가장 최근에 저장한 신청 1건과 그 요금제
  const subscription = count > 0 ? getLastSubscription() : null;
  const plan = subscription ? getPlan(subscription.plan_id) : undefined;

  // 저장된 신청이 없는데 이 화면을 열면 요금제 목록으로 바꿔 보낸다(뒤로가기 기록에 남지 않음).
  // 상태 확인용 주소(?state=loading · empty · error)는 보내지 않고 그대로 보여 준다
  const noSubscription = state === "default" && count !== NOT_READY && !subscription;
  useEffect(() => {
    if (noSubscription) router.replace("/plans");
  }, [noSubscription, router]);

  // 상태별 본문: 로딩(또는 신청 내역을 읽는 중 · 목록으로 넘어가는 중) → 스켈레톤, 오류 → "확인 필요",
  // 빈 상태 → "확인 필요", 그 밖에는 완료 화면
  let body;
  if (state === "loading" || (state === "default" && count === NOT_READY) || noSubscription) {
    body = <CompleteLoading />;
  } else if (state === "error") {
    body = <StateMessage message={UNKNOWN_MESSAGE} tone="error" />;
  } else if (state === "empty" || !subscription) {
    body = <StateMessage message={UNKNOWN_MESSAGE} />;
  } else {
    body = (
      <div className="flex w-full flex-1 flex-col items-center gap-24 p-16">
        {/* 완료 표시: 완료 아이콘 + 완료 문구 */}
        <DoneMark />
        <h2 className="w-full text-center text-heading-h3 text-text-primary">구독 신청이 완료됐어요</h2>
        {/* 신청 내역: 신청 번호 · 요금제 이름 · 매달 내는 금액 · 신청 일시 · 신청자 이름 (번호 · 일시 표시 형식은 확인 필요) */}
        <section className="flex w-full flex-col gap-12">
          <h3 className="text-subtitle-bold text-text-primary">신청 내역</h3>
          <dl data-gate="complete-summary" className="flex w-full flex-col rounded-12 bg-bg-subtle p-16">
            <ListRow label="신청 번호" value={subscription.id} />
            <ListRow label="요금제" value={plan ? plan.name : UNKNOWN_MESSAGE} />
            <ListRow label="매달 내는 금액" value={formatWon(subscription.monthly_price)} />
            <ListRow label="신청 일시" value={new Date(subscription.created_at).toLocaleString("ko-KR")} />
            <ListRow label="신청자 이름" value={subscription.name} />
          </dl>
        </section>
      </div>
    );
  }

  return (
    <main className="flex min-h-dvh w-full flex-col bg-bg-surface">
      {/* 헤더: 뒤로 아이콘(요금제 목록으로) + 제목 */}
      <Header type="default" title="신청 완료" backHref="/plans" />
      {body}
      {/* 버튼 영역: '요금제 더 보기' → 요금제 목록. 완료 화면이 보일 때만 */}
      {state === "default" && subscription && (
        <BottomCTA reserve="short">
          <ButtonLink href="/plans">요금제 더 보기</ButtonLink>
        </BottomCTA>
      )}
    </main>
  );
}
