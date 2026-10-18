// 동의 체크 상자 + 설명 문구. 체크하면 분홍 상자에 체크 표시, 오류가 있으면 아래 안내 문구 (구독 신청 화면)
import { CheckMark } from "./icons";

type CheckboxProps = {
  id: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  error?: string | null;
};

export default function Checkbox({ id, label, checked, onChange, error }: CheckboxProps) {
  const box = checked ? "bg-fill-primary" : "border border-border-default bg-bg-surface";
  return (
    <div className="flex w-full flex-col gap-12">
      <label htmlFor={id} className="flex w-full cursor-pointer items-center gap-8">
        <input
          id={id}
          type="checkbox"
          className="peer sr-only"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          aria-describedby={error ? `${id}-error` : undefined}
        />
        <span
          aria-hidden="true"
          className={`flex size-24 shrink-0 items-center justify-center rounded-4 peer-focus-visible:outline peer-focus-visible:outline-border-focus ${box}`}
        >
          {checked && <CheckMark />}
        </span>
        <span className="text-body-small-medium text-text-primary">{label}</span>
      </label>
      {error && (
        <p id={`${id}-error`} className="text-body-small-medium text-text-error">
          {error}
        </p>
      )}
    </div>
  );
}
