// 로딩 상태에 보여 주는 회색 상자 (글자 없음)
export function SkeletonBox({ className }: { className: string }) {
  return <div aria-hidden="true" className={`w-full animate-pulse bg-bg-subtle ${className}`} />;
}

// 회색 상자를 정해진 개수만큼 세로로 쌓는다 (목록 카드 자리)
export function SkeletonList({ count, className }: { count: number; className: string }) {
  return (
    <div aria-busy="true" className="flex w-full flex-col gap-16">
      {Array.from({ length: count }, (_, i) => (
        <SkeletonBox key={i} className={className} />
      ))}
    </div>
  );
}
