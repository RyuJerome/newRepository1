// 빈 상태 · 오류 상태 안내 문구 영역 (문구가 정해지지 않아 "확인 필요"를 받는다)
export default function StateMessage({ message, tone = "empty" }: { message: string; tone?: "empty" | "error" }) {
  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className="flex w-full flex-col items-center justify-center px-16 py-80 text-center text-body-small-medium text-text-secondary"
    >
      {message}
    </div>
  );
}
