// 입력란 1개: 위 라벨 · 밑줄 입력칸 · 오류가 있으면 아래 빨간 안내 문구 (구독 신청 화면)
import type { InputHTMLAttributes } from "react";

type TextFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, "className"> & {
  id: string;
  label: string;
  error?: string | null;
};

export default function TextField({ id, label, error, ...rest }: TextFieldProps) {
  const line = error ? "border-border-error" : "border-border-default focus-within:border-border-focus";
  return (
    <div className="flex w-full flex-col gap-8">
      <label htmlFor={id} className="text-body-strong text-text-primary">
        {label}
      </label>
      <div className="flex w-full flex-col gap-12">
        <div className={`flex w-full items-center border-b px-2 py-16 ${line}`}>
          <input
            id={id}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? `${id}-error` : undefined}
            className="w-full bg-transparent px-2 text-body-strong text-text-primary outline-none placeholder:text-text-placeholder"
            {...rest}
          />
        </div>
        {error && (
          <p id={`${id}-error`} className="text-body-small-medium text-text-error">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
