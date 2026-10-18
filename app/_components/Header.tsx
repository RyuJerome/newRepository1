// 화면 맨 위 헤더. root: 제목 + 로고(요금제 목록) / default: 뒤로 아이콘 + 가운데 제목(상세 · 신청 · 완료)
import Link from "next/link";
import { ArrowLeftIcon, Logo } from "./icons";

type HeaderProps = { title: string } & ({ type: "root" } | { type: "default"; backHref: string });

export default function Header(props: HeaderProps) {
  if (props.type === "root") {
    return (
      <header className="flex h-56 w-full shrink-0 items-center gap-12 bg-bg-surface px-16 py-4">
        <h1 className="flex-1 text-heading-h4 text-text-primary">{props.title}</h1>
        <Logo />
      </header>
    );
  }
  return (
    <header className="flex h-56 w-full shrink-0 items-center gap-8 bg-bg-surface px-16 py-4">
      <Link href={props.backHref} aria-label="뒤로" className="flex size-24 shrink-0 items-center justify-center">
        <ArrowLeftIcon />
      </Link>
      <h1 className="flex-1 text-center text-subtitle-default text-text-primary">{props.title}</h1>
      <div className="size-24 shrink-0" aria-hidden="true" />
    </header>
  );
}
