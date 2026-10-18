// 공통 버튼. primary(분홍 · 주요 동작) / secondary(테두리 · 보조 동작), 비활성이면 회색으로 눌리지 않는다
import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary";
type Size = "xl" | "sm";

function buttonClass(variant: Variant, size: Size, full: boolean) {
  const base = "inline-flex items-center justify-center rounded-8 px-24 text-body-strong";
  const height = size === "xl" ? "py-16" : "py-8";
  const width = full ? "w-full" : "shrink-0";
  const look =
    variant === "primary"
      ? "bg-fill-primary text-text-on-dark hover:bg-fill-primary-hover disabled:bg-fill-disabled disabled:text-body-medium disabled:cursor-not-allowed"
      : "border border-border-default bg-surface-default text-text-primary hover:bg-bg-subtle disabled:bg-fill-disabled disabled:cursor-not-allowed";
  return `${base} ${height} ${width} ${look}`;
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  full?: boolean;
};

export function Button({ variant = "primary", size = "xl", full = true, className, ...rest }: ButtonProps) {
  return <button type="button" {...rest} className={`${buttonClass(variant, size, full)} ${className ?? ""}`} />;
}

type ButtonLinkProps = {
  href: string;
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  full?: boolean;
  replace?: boolean;
};

// 버튼 모양의 화면 이동 링크 ('자세히' · '구독 신청하기' · '취소' · '요금제 더 보기')
export function ButtonLink({ href, children, variant = "primary", size = "xl", full = true, replace }: ButtonLinkProps) {
  return (
    <Link href={href} replace={replace} className={buttonClass(variant, size, full)}>
      {children}
    </Link>
  );
}
