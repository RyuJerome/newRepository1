// 신청 완료 화면(/complete): 주소의 신청 번호(?id)로 서버에 저장된 신청 1건을 보여 준다.
import { Suspense } from "react";
import CompleteView, { CompleteLoading } from "./CompleteView";

export default function CompletePage() {
  return (
    <Suspense fallback={<CompleteLoading />}>
      <CompleteView />
    </Suspense>
  );
}
