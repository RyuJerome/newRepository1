// 신청 완료 화면(/complete): 방금 저장한 신청 내역을 보여 준다.
import { Suspense } from "react";
import CompleteView, { CompleteLoading } from "./CompleteView";

export default function CompletePage() {
  return (
    <Suspense fallback={<CompleteLoading />}>
      <CompleteView />
    </Suspense>
  );
}
