-- subscriptions: 구독 신청 1건 (docs/PRD.md 5장 Subscription)
-- Supabase 대시보드 > SQL Editor에서 한 번 실행한다. 다시 실행해도 오류가 나지 않게 썼다.

create table if not exists public.subscriptions (
  -- 신청 번호. 저장 시 생성
  id             text        primary key default gen_random_uuid()::text,
  -- 신청자 이름. 빈 값 불가
  name           text        not null check (char_length(btrim(name)) > 0),
  -- 휴대폰 번호. 숫자 11자리
  phone          text        not null check (phone ~ '^[0-9]{11}$'),
  -- 요금제 id (p01 | p02 | p03 | p04)
  plan_id        text        not null check (plan_id in ('p01', 'p02', 'p03', 'p04')),
  -- 신청 시점의 매달 내는 금액(원)
  monthly_price  integer     not null check (monthly_price >= 0),
  -- 개인정보 수집·이용 동의. true일 때만 저장
  agreed_privacy boolean     not null check (agreed_privacy = true),
  -- 신청 일시. 저장 시 생성
  created_at     timestamptz not null default now()
);

comment on table public.subscriptions is '구독 신청 1건 (PRD 5장 Subscription)';

-- RLS 켜기: 정책에 없는 동작은 모두 거부된다
alter table public.subscriptions enable row level security;

-- 공개 키(anon)로 저장만 허용. 값 규칙은 위 check 제약이 막는다
drop policy if exists "anon can insert subscriptions" on public.subscriptions;
create policy "anon can insert subscriptions"
  on public.subscriptions
  for insert
  to anon
  with check (true);

-- 공개 키(anon)로 조회 허용
drop policy if exists "anon can select subscriptions" on public.subscriptions;
create policy "anon can select subscriptions"
  on public.subscriptions
  for select
  to anon
  using (true);

-- 수정 · 삭제는 정책이 없어 RLS가 막는다. 권한에서도 한 번 더 뺀다
revoke update, delete, truncate on public.subscriptions from anon, authenticated;
