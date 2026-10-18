// 구독 신청 화면(/apply?plan=<id>): 고른 요금제를 확인하고 이름 · 휴대폰 번호 · 동의를 받아 신청을 저장한다.
import { Suspense } from "react";
import ApplyView, { ApplyLoading } from "./ApplyView";

export default function ApplyPage() {
  return (
    <Suspense fallback={<ApplyLoading />}>
      <ApplyView />
    </Suspense>
  );
}
