// 필터 칩 1개. 선택되면 검은 배경 + 흰 글자, 아니면 흰 배경 + 테두리
type FilterChipProps = {
  label: string;
  selected: boolean;
  onSelect: () => void;
};

export default function FilterChip({ label, selected, onSelect }: FilterChipProps) {
  const look = selected
    ? "bg-fill-secondary text-text-on-dark text-body-small-strong"
    : "border border-border-default bg-bg-surface text-text-primary text-body-small-medium";
  return (
    <button
      type="button"
      data-gate="filter-chip"
      aria-pressed={selected}
      onClick={onSelect}
      className={`inline-flex h-40 shrink-0 items-center justify-center rounded-full px-16 py-8 ${look}`}
    >
      {label}
    </button>
  );
}
