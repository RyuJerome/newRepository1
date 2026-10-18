# 01-context — 요금제 추천·구독

> 자료: docs/PRD.md, CLAUDE.md 1절, docs/screens.md, reference/links.md
> 기준 우선순위: PRD.md > screens.md > 화면 링크 > Make 링크 > flow.png. 단, CLAUDE.md 1절의 사용자 결정이 있으면 그 결정을 따른다.

## 1. 유저 스토리

1. 출퇴근길에 영상을 보는 고객은 월말까지 데이터를 쓰기 위해 데이터량을 기준으로 요금제를 비교하고 싶다. (US1)
2. 20개가 넘는 요금제 앞에서 선택이 어려운 고객은 내 상황에 맞는 요금제만 추려 보고 싶다. (US2)
3. "무제한" 요금제를 보는 고객은 기본 데이터 소진 후 속도 제한이 있는지 확인하고 싶다. (US3)
4. 여러 가격이 함께 적힌 요금제를 보는 고객은 매달 내는 금액과 24개월 할인 종료 후 금액을 확인하고 싶다. (US4)
5. 요금제를 고른 고객은 포털이나 커뮤니티로 나가지 않고 이 서비스 안에서 바로 신청하고 싶다. (US5)

## 2. 판정 규칙

PRD "어기면 안 되는 것" 7개를 그대로 옮긴다. ★ = 핵심 게이트 (G4 = 규칙 3, G5 = 규칙 5).

1. 요금제 목록에 요금제 카드가 정확히 4개(p01~p04) 있다.
2. 추천 Tag는 요금제 목록에 1개만 있다.
3. ★ 요금제 카드와 요금제 상세에는 금액이 "매달 내는 금액" 1개와 "할인 종료 후 금액" 최대 1개만 있다. 정가·할인가·프로모션가 3개가 함께 표시되지 않는다.
4. 할인 종료 후 금액은 24개월 할인이 있는 요금제(p03)에만 있다.
5. ★ 이름에 "무제한"이 들어간 요금제(p03, p04)의 카드와 상세에는 "소진 후 ○Mbps로 제한" 또는 "속도 제한 없음" 중 하나가 있다.
6. 구독 신청 화면에서 이름·휴대폰 번호가 비어 있거나 동의가 체크되지 않으면 '신청하기' 버튼이 눌리지 않는다.
7. 신청 완료 화면의 요금제 이름과 매달 내는 금액이 구독 신청 화면에서 선택한 요금제와 같다.

## 3. 충돌표

| # | 항목 | PRD | screens.md · 화면 링크 · 자료 | 따르는 쪽 |
|---|---|---|---|---|
| 1 | 라우트 | /plans · /plans/[id] · /apply · /complete | screens.md 제안 경로: /plans/:planId · /subscription/apply · /subscription/complete | PRD (/subscription/* 경로는 쓰지 않는다) |
| 2 | 요금제 데이터 | p01 슬림 10GB · p02 데일리 50GB · p03 무제한 라이트 · p04 무제한 프리 (5장 Plan) | screens.md: 넉넉 무제한 · 스탠다드 110 · 라이트 30 · (4번째 미확인), 상세·신청·완료는 "스탠다드 월 9,900원" | PRD |
| 3 | 신청 입력 | 이름 · 휴대폰 번호 · 개인정보 수집·이용 동의(Checkbox) | screens.md: 이름 · 이메일 (동의 항목 없음) | PRD |
| 4 | 카드 가격 표기 | 매달 내는 금액 1개 + 할인 종료 후 금액 최대 1개 ("25개월째부터 ○원") | screens.md: 할인율(15%) · 정가(취소선) · 판매가 함께 표시 | PRD (Card/Plan의 Sale 표시는 끈다, 규칙 3) |
| 5 | border/default 색 값 | — | Design.md #D9DCE0 vs docs/tokens.json #D9DCDF | tokens.json (CLAUDE.md 1절: 토큰 값은 tokens.json만, Design.md는 용법만) |
| 6 | 추천 Tag 개수 | 카드 1개에만 (규칙 2) | screens.md: 보이는 카드 3개 모두 "추천" | PRD (대상은 p03, 4절 결정표) |
| 7 | 필터 칩 항목·동작 | 4-1의 2번: 칩 항목 확인 필요, 누르면 조건에 맞는 카드만 남음 | screens.md: 데이터 많이(selected) · 가성비 · 구독 포함 · 통화 많이 / 화면 링크 노드 4145:3129: 전체 · 베이직 · 스탠다드 · 프리미엄 | 화면 링크 항목 + 사용자 결정, PRD 대체 (선택 표시만 바뀌고 필터링 없음. PRD 4-1의 2번을 대체) |
| 8 | 목록 정렬·요약 | 매달 내는 금액 낮은 순 (실습 기준) | screens.md: "추천순 · 4개" | PRD |
| 9 | 상세 화면 구성 | 헤더에 요금제 이름 · Card/Price(매달 내는 금액 + 할인 종료 후) · List/Row(데이터량·소진 후 속도) · BottomCTA('구독 신청하기' + 금액) | screens.md: 제목 "요금제 상세", "부가세 포함 · 매월 정기 구독", 혜택 행(이용 횟수 월 30회 등), 구독 안내(이용 기간·갱신 주기), 버튼 "구독 신청"·"뒤로" | PRD (PRD에 없는 이용 횟수·갱신 안내 데이터는 지어내지 않는다) |
| 10 | 신청 화면 버튼·요약 | '신청하기' 버튼, 요약은 요금제 이름 · 매달 내는 금액 · 할인 종료 후 금액(p03만) | screens.md: "신청"·"취소" 버튼, 요약에 제공 혜택·이용 시작 행, 자동 갱신 안내 문구 | PRD |
| 11 | 완료 화면 구성 | 완료 아이콘 + "구독 신청이 완료됐어요", 신청 번호 · 요금제 이름 · 매달 내는 금액 · 신청 일시 · 신청자 이름, '요금제 더 보기' 버튼 | screens.md: "구독 신청이 완료되었습니다", 신청 상태·제공 혜택·이용 기간·갱신 주기 행, 이메일 안내 문구, "확인" 버튼 | PRD |
| 12 | 완료 화면 이동 | '요금제 더 보기'·뒤로: 확인 필요 | screens.md: "확인" → 종료(도착 화면 없음), 뒤로 미정의 / Make 링크: '요금제 더 보기' → /plans | 4절 결정표 (Make 근거 · 사용자 결정) |
| 13 | 로딩·빈·에러 상태 | 6장 범위 밖 | screens.md: 4개 화면 모두 "원본에 정의되지 않음" | 사용자 결정, PRD 대체 (4개 화면 모두 ?state=로 렌더링) |

## 4. 결정표

| # | 결정 | 근거 |
|---|---|---|
| 1 | 라우트는 /plans, /plans/[id], /apply, /complete 4개 | PRD |
| 2 | 요금제는 p01~p04 4개, PRD 요금제 데이터 표 값 그대로 | PRD |
| 3 | 목록 정렬은 매달 내는 금액 낮은 순 (p01 → p04) | PRD |
| 4 | 추천 Tag는 p03 1개 (목록 1개, 상세는 p03일 때만) | 사용자 결정(피그마 화면과 맞춤) |
| 5 | 신청 입력은 이름 · 휴대폰 번호 · 개인정보 동의 | PRD |
| 6 | 신청 화면에서 뒤로 갈 때 입력값은 유지하지 않는다 | 사용자 결정 |
| 7 | 필터 칩 항목은 전체 · 베이직 · 스탠다드 · 프리미엄 4개, 기본 선택은 '전체' | 화면 링크 |
| 8 | 필터 칩을 누르면 선택 표시만 바뀌고 필터링하지 않는다 (카드 4개 유지). PRD 4-1의 2번 "조건에 맞는 카드만 남음"을 대체한다 | 사용자 결정, PRD 대체 |
| 9 | 완료 화면 '요금제 더 보기' → /plans | Make 근거 |
| 10 | 완료 화면 뒤로 → /plans | 사용자 결정 |
| 11 | OptionItem(포함 혜택)은 넣지 않는다 | 사용자 결정 |
| 12 | 상세의 통화·문자 행은 넣지 않는다 | 사용자 결정 |
| 13 | 4개 화면 모두 ?state=loading · empty · error 로 렌더링한다 (PRD 6장 "범위 밖"을 대체) | 사용자 결정, PRD 대체 |
| 14 | 로딩 상태는 스켈레톤으로 표시한다 | 사용자 결정 |
| 15 | 빈·에러 문구는 screens.md 문구, 없으면 "확인 필요"로 표시한다 | 사용자 결정 |
| 16 | 신청 오류 문구 4개는 PRD 문구 그대로 쓴다 | PRD |
| 17 | 저장은 sessionStorage, 저장 코드는 lib/subscription.ts 한 곳 | 사용자 결정 |
| 18 | 색·간격·모서리·글자는 docs/tokens.json 값만 쓴다. Design.md는 컴포넌트 용법만 참고 (border/default = tokens.json 값) | 사용자 결정 |
| 19 | PRD에 없는 화면 요소는 화면 링크를 따르고, 데이터·기능은 지어내지 않는다 | 사용자 결정 |
| 20 | Make 링크는 화면 이동 흐름만 참고한다 (코드·스타일·화면 요소는 따르지 않음) | 사용자 결정 |

## 5. data-gate 계약

```
### 라우트와 파라미터
- /plans · /plans/[id] (id = p01~p04) · /apply?plan=<id> · /complete
- app/ 아래 page.tsx는 이 4개뿐이다. 스캐폴드의 app/page.tsx(/)는 지운다.
- 상태 확인: 4개 화면 모두 ?state=loading | empty | error 를 받는다. 값이 없으면 기본 상태.

### lib/plans.ts (data-builder가 만든다. 다른 파일을 import하지 않는다)
- export type Plan = { id, name, monthly_price, data, throttle_after, price_after_discount, discount_months, description, recommended }
  (키는 PRD 5장 Plan과 같고, 그 밖의 키는 없다)
- export const plans: Plan[]  — p01, p02, p03, p04 순서 (매달 내는 금액 낮은 순)
- export function getPlan(id: string): Plan | undefined
- export function formatWon(n: number): string            — 39000 → "39,000원"
- export function speedLabel(plan: Plan): string           — "소진 후 1Mbps로 제한" 또는 "속도 제한 없음"
- export function priceAfterLabel(plan: Plan): string | null — p03 → "25개월째부터 69,000원", 할인 없으면 null
- enum · namespace · 생성자 매개변수 속성처럼 Node가 바로 실행하지 못하는 TypeScript 문법을 쓰지 않는다.

### lib/subscription.ts (저장은 이 파일에서만. sessionStorage · localStorage 단어는 이 파일 밖에 0번)
- export type Subscription = { id, name, phone, plan_id, monthly_price, agreed_privacy, created_at }
- export function saveSubscription(input: { name: string; phone: string; plan_id: string; agreed_privacy: boolean }): Subscription
  — 저장 실패 시 예외를 던진다. agreed_privacy가 true가 아니면 저장하지 않는다.
- export function getLastSubscription(): Subscription | null
- export function countSubscriptions(): number

### 화면 코드 규칙
- 금액은 formatWon(plan.monthly_price)와 priceAfterLabel(plan)로만 화면에 넣는다. price_after_discount를 화면 코드에서 직접 쓰지 않는다.
- 속도는 speedLabel(plan)로만 넣는다. "Mbps", "속도 제한 없음"을 화면 코드에 직접 쓰지 않는다.
- 신청 저장 후 이동은 router.replace("/complete"). /complete 코드에는 "/apply"가 0번.
- 공통 컴포넌트는 app/_components/ 에 둔다.
- 폰트: app/layout.tsx에서 next/font/google의 Noto_Sans_KR을 variable "--font-noto-sans-kr"로 불러온다.
- app/globals.css는 @import "tailwindcss"; 다음 줄에 @import "./tokens.css"; 를 둔다. app/tokens.css는 고치지 않는다.

### data-gate 표시 속성
| 값 | 붙이는 곳 |
|---|---|
| data-gate="plan-card" data-plan={plan.id} | 요금제 카드 루트 (app/_components 안 카드 컴포넌트) |
| data-gate="plan-detail" data-plan={plan.id} | 요금제 상세 본문 루트 |
| data-gate="recommend-tag" | 추천 Tag |
| data-gate="filter-chip" | 필터 칩 각각 |
| data-gate="apply-submit" | 신청 화면의 '신청하기' 버튼 |
| data-gate="complete-summary" | 신청 완료 화면의 신청 내역 영역 |

### 피그마 화면 링크 프레임 (fileKey ltKt2yBb1Jh4UoxbXf2Mn2)
| 화면 | 노드 |
|---|---|
| 요금제 목록 | 4145:3125 |
| 요금제 상세 | 4123:2220 |
| 구독 신청 | 4123:2197 |
| 신청 완료 | 4145:3189 |
```

## 6. 확인 필요

1. 빈·에러 상태 문구: screens.md는 4개 화면 모두 로딩·빈·에러를 "원본에 정의되지 않음"으로 둔다. 따라서 빈·에러 화면 문구는 모두 "확인 필요"로 표시한다 (신청 화면 에러는 PRD 오류 문구 사용).
2. 목록 안내 문구·목록 요약: screens.md의 "중요하게 보는 조건을 고르면 추천해 드려요", "추천순 · 4개"는 필터링 없음(결정 8)·금액 낮은 순 정렬(결정 3)과 맞지 않는다. 쓸지, 어떤 문구로 쓸지 확인 필요.
3. 필터 칩 4개(베이직·스탠다드·프리미엄)와 p01~p04의 대응: 필터링은 하지 않지만, 칩과 요금제의 관계는 정의되지 않았다.
4. 추천 기준: 추천 Tag 대상은 p03으로 정했지만, 어떤 고객 상황에서 추천하는지(기준)는 PRD에서 확인 필요로 남아 있다.
5. 신청 화면 '취소' 버튼: PRD 흐름에는 "뒤로(icon/arrowLeft)·취소 → 요금제 상세"가 있으나 4-3 기능 목록에는 취소 버튼이 없다. 넣을지 확인 필요.
6. 동의 오류 문구가 나오는 시점: 동의하지 않으면 '신청하기'가 비활성(규칙 6)이라 "동의 체크 없이 신청 시도"가 일어나지 않는다. 문구를 언제 보여 줄지 확인 필요.
7. 휴대폰 번호 입력 형식: 숫자 11자리 외에 하이픈 입력 허용·자동 제거 여부.
8. 신청 번호(Subscription.id) 생성 형식과 신청 일시(created_at) 화면 표시 형식.
9. 잘못된 접근 처리: /plans/[id]에 p01~p04가 아닌 id, /apply에 plan 파라미터가 없거나 잘못된 경우, /complete에 저장된 신청이 없는 경우의 화면.
10. 목록 Header 제목·Logo: screens.md는 Header root "요금제" + Logo. PRD에는 목록 헤더 정의가 없다 (화면 링크를 따르되 문구는 확인 필요).
