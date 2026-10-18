# 02-pages — 화면 명세

> 자료: docs/screens.md(화면 4개), docs/PRD.md(문구), reference/flow.png(흐름), harness/01-context.md(라우트·데이터·입력·결정표 기준)
> 라우트·데이터·입력 항목은 01-context.md를 따른다. screens.md의 제안 경로는 쓰지 않는다.
> 화면 문구·데이터는 지어내지 않는다. 근거가 없으면 "확인 필요"로 둔다.

## 라우트 표

| # | screens.md "## " 화면 | 라우트 | 파일 경로 | data-gate |
|---|---|---|---|---|
| 1 | 요금제 목록 | /plans | app/plans/page.tsx | plan-card, recommend-tag, filter-chip |
| 2 | 요금제 상세 | /plans/[id] | app/plans/[id]/page.tsx | plan-detail, recommend-tag |
| 3 | 구독 신청 | /apply | app/apply/page.tsx | apply-submit |
| 4 | 신청 완료 | /complete | app/complete/page.tsx | complete-summary |

- 파라미터: /plans/[id]의 id = p01~p04, /apply?plan=<id>.
- 이 4개 외의 page.tsx는 만들지 않는다 (스캐폴드 app/page.tsx는 지운다 — 01-context.md 5절).
- 4개 화면 모두 `?state=loading | empty | error`를 받는다. 값이 없으면 기본 상태 (01-context.md 결정 13).

## 흐름 (01-context.md 결정표 기준)

```
/plans --'자세히'--> /plans/[id] --'구독 신청하기'--> /apply?plan=<id> --'신청하기'(저장)--> /complete
/plans/[id] --뒤로--> /plans
/apply --뒤로--> /plans/[id]          (입력값 유지 안 함, 결정 6)
/complete --뒤로 · '요금제 더 보기'--> /plans   (결정 9, 10)
```

flow.png의 "취소"(구독 신청 → 요금제 상세)와 "끝"은 아래 화면별 이동에서 다룬다.

---

# 공통

여러 화면에 쓰이는 컴포넌트. 모두 app/_components/ 에 둔다. 색·간격·모서리·글자는 docs/tokens.json 값만 쓴다 (결정 18).

| 컴포넌트 | 파일 | 쓰는 화면 | 내용 |
|---|---|---|---|
| Header | app/_components/Header.tsx | 목록 · 상세 · 신청 · 완료 | Type=root(제목 + Logo, 목록) / 뒤로형(icon/arrowLeft + 제목, 상세·신청·완료). 뒤로 목적지는 prop으로 받는다 |
| RecommendTag | app/_components/RecommendTag.tsx | 목록 · 상세 | Tag "추천". `data-gate="recommend-tag"`. plan.recommended가 true(p03)일 때만 렌더링 |
| ListRow | app/_components/ListRow.tsx | 상세 · 신청 · 완료 | List/Row. 왼쪽 라벨 + 오른쪽 값 |
| BottomCTA | app/_components/BottomCTA.tsx | 상세 · 신청 · 완료 | 하단 고정 영역 + Button. disabled 지원 (신청 화면 규칙 6) |
| Button | app/_components/Button.tsx | 목록('자세히') · 상세 · 신청 · 완료 | 공통 버튼. disabled 상태 포함 |
| Skeleton | app/_components/Skeleton.tsx | 4개 화면 모두 | `?state=loading` 스켈레톤 (결정 14) |
| StateMessage | app/_components/StateMessage.tsx | 4개 화면 모두 | `?state=empty` · `?state=error` 안내 영역. 문구는 화면별 표 참고 (대부분 "확인 필요") |
| usePageState (또는 동등 함수) | app/_components/pageState.ts | 4개 화면 모두 | searchParams의 state 값을 'default' · 'loading' · 'empty' · 'error'로 읽는다 |

공통 규칙 (01-context.md 5절):
- 금액은 `formatWon(plan.monthly_price)`와 `priceAfterLabel(plan)`로만 넣는다. `price_after_discount`를 화면 코드에서 직접 쓰지 않는다.
- 속도는 `speedLabel(plan)`로만 넣는다. "Mbps", "속도 제한 없음"을 화면 코드에 직접 쓰지 않는다.
- 저장·읽기는 lib/subscription.ts 함수로만 한다. sessionStorage · localStorage 단어는 화면 코드에 0번.
- 정가·할인율·취소선 가격(Card/Plan의 Sale 표시)은 쓰지 않는다 (규칙 3).

---

## 1. 요금제 목록 — /plans

- 파일: app/plans/page.tsx
- 화면 전용 컴포넌트: app/_components/PlanCard.tsx (Card/Plan, 목록에서만 사용), app/_components/FilterChip.tsx
- 피그마 노드: 4145:3125

### 구성 요소
| 순서 | 요소 | 내용 | 근거 |
|---|---|---|---|
| 1 | Header (Type=root) | 제목 "요금제" + 우측 Logo | screens.md (문구 확인 필요, 01-context 6절 10) |
| 2 | 목록 안내 | "나에게 맞는 요금제를 골라보세요" / "중요하게 보는 조건을 고르면 추천해 드려요" | screens.md — 둘째 줄은 필터링 없음(결정 8)과 맞지 않아 **확인 필요** |
| 3 | FilterChip × 4 | 전체(기본 selected) · 베이직 · 스탠다드 · 프리미엄. 각 칩 `data-gate="filter-chip"`. 누르면 선택 표시만 바뀌고 카드는 4개 유지 | 결정 7, 8 |
| 4 | 목록 요약 | screens.md "추천순 · 4개"는 정렬(금액 낮은 순)과 맞지 않음 — 넣을지·문구 **확인 필요** | 01-context 6절 2 |
| 5 | PlanCard × 4 | p01 → p02 → p03 → p04 (매달 내는 금액 낮은 순). 루트 `data-gate="plan-card" data-plan={plan.id}` | 결정 2, 3 |

PlanCard 표시 항목 (PRD 4-1의 1):
- 요금제 이름 (plan.name)
- 기본 데이터량 (plan.data)
- 소진 후 속도 — `speedLabel(plan)`
- 매달 내는 금액 1개 — `formatWon(plan.monthly_price)`
- 할인 종료 후 금액 — `priceAfterLabel(plan)`, null이면 줄을 그리지 않음 (p03만 "25개월째부터 69,000원")
- 할인 Chip "24개월 할인" — 할인이 있는 요금제(p03)에만
- RecommendTag — p03에만 (목록 전체에 1개)
- Button '자세히'
- 한 줄 설명(plan.description) 표시 여부: **확인 필요** (PRD 4-1 표시 항목에 없음)

### 상태
| 상태 | 진입 | 화면 |
|---|---|---|
| 기본 | /plans | 위 구성 요소. '전체' 칩 선택, 카드 4개 |
| 로딩 | /plans?state=loading | Header 유지, 칩·카드 자리에 Skeleton |
| 빈 | /plans?state=empty | Header 유지, 카드 0개 + StateMessage. 문구: **확인 필요** (screens.md "원본에 정의되지 않음") |
| 오류 | /plans?state=error | Header 유지, StateMessage. 문구: **확인 필요**. 다시 시도 버튼 여부 **확인 필요** |

### 이동
- 들어오는 곳: 진입(flow.png 시작점), /plans/[id] 뒤로, /complete 뒤로 · '요금제 더 보기'
- 나가는 곳: 카드 '자세히' → /plans/[plan.id]
- 필터 칩: 화면 이동 없음

---

## 2. 요금제 상세 — /plans/[id]

- 파일: app/plans/[id]/page.tsx
- 화면 전용 요소: Card/Price 영역(상세에서만 사용 — 페이지 안에 두거나 app/_components/PriceCard.tsx)
- 피그마 노드: 4123:2220
- 본문 루트 `data-gate="plan-detail" data-plan={plan.id}`

### 구성 요소
| 순서 | 요소 | 내용 | 근거 |
|---|---|---|---|
| 1 | Header (뒤로형) | icon/arrowLeft + 요금제 이름(plan.name) | PRD 4-2의 1 |
| 2 | RecommendTag | p03일 때만 | PRD 4-2의 4, 결정 4 |
| 3 | Card/Price | 매달 내는 금액 `formatWon(plan.monthly_price)` 1개, 그 아래 `priceAfterLabel(plan)` (null이면 줄 없음). 정가·할인가·프로모션가 3개 동시 표시 금지 | PRD 4-2의 2 |
| 4 | ListRow × 2 | 기본 데이터량(plan.data) · 소진 후 속도 `speedLabel(plan)`. 행 라벨 문구 **확인 필요** | PRD 4-2의 3. 통화·문자 행 없음(결정 12) |
| 5 | BottomCTA | 매달 내는 금액 + Button '구독 신청하기' | PRD 4-2의 6 |

넣지 않는 것: OptionItem(포함 혜택, 결정 11), 통화·문자 행(결정 12), screens.md의 "부가세 포함 · 매월 정기 구독"·이용 횟수·구독 안내·"뒤로" 버튼 (결정 19, 충돌표 9).

### 상태
| 상태 | 진입 | 화면 |
|---|---|---|
| 기본 | /plans/p01 ~ /plans/p04 | 위 구성 요소 |
| 로딩 | /plans/[id]?state=loading | Header(뒤로 아이콘) 유지, Card/Price·ListRow·BottomCTA 자리에 Skeleton |
| 빈 | /plans/[id]?state=empty | Header 유지, StateMessage. 문구: **확인 필요** |
| 오류 | /plans/[id]?state=error | Header 유지, StateMessage. 문구: **확인 필요** |

- p01~p04가 아닌 id로 들어온 경우의 화면: **확인 필요** (01-context 6절 9. 빈·오류 상태로 보여 줄지 미정)

### 이동
- 들어오는 곳: /plans '자세히', /apply 뒤로
- 나가는 곳:
  - icon/arrowLeft → /plans
  - '구독 신청하기' → /apply?plan=<id>

---

## 3. 구독 신청 — /apply

- 파일: app/apply/page.tsx
- 화면 전용 요소: Input(이름 · 휴대폰 번호), Checkbox(개인정보 동의) — 신청 화면에서만 사용 (app/_components/Input.tsx, Checkbox.tsx로 두어도 됨)
- 피그마 노드: 4123:2197
- 쿼리: `?plan=<id>` 로 요금제를 받는다 (`getPlan(id)`)

### 구성 요소
| 순서 | 요소 | 내용 | 근거 |
|---|---|---|---|
| 1 | Header (뒤로형) | icon/arrowLeft + 제목 "구독 신청" | screens.md 제목, PRD 4-3의 1 |
| 2 | 선택한 요금제 요약 (ListRow) | 요금제 이름 · 매달 내는 금액 `formatWon` · 할인 종료 후 금액 `priceAfterLabel`(p03만). 행 라벨 문구 **확인 필요** | PRD 4-3의 2 |
| 3 | Input 이름 | 라벨 "이름", 기본 빈 값. placeholder **확인 필요** | PRD 4-3의 3 |
| 4 | Input 휴대폰 번호 | 라벨 "휴대폰 번호", 기본 빈 값, 숫자 11자리. 하이픈 허용 여부 **확인 필요**. placeholder **확인 필요** | PRD 4-3의 3, 5장 |
| 5 | Checkbox | "개인정보 수집·이용 동의", 기본 미체크 | PRD 4-3의 4 |
| 6 | 저장 실패 문구 자리 | 신청하기 버튼 위 | PRD 4-3 오류 표 |
| 7 | BottomCTA + Button '신청하기' | `data-gate="apply-submit"`. 이름·휴대폰 번호가 비었거나 동의 미체크면 disabled (규칙 6). 누르면 `saveSubscription(...)` 후 `router.replace("/complete")` | PRD 4-3의 5 |

넣지 않는 것: 이메일 입력, screens.md의 제공 혜택·이용 시작 행, 자동 갱신 안내 문구, "취소" 버튼(**확인 필요**, 01-context 6절 5).

### 오류 문구 (PRD 4-3 표 그대로)
| 상황 | 안내 문구 | 표시 위치 |
|---|---|---|
| 이름 입력란을 비운 채 다음 입력란으로 이동 | 이름을 입력해 주세요. | 이름 입력란 아래 |
| 휴대폰 번호가 숫자 11자리가 아님 | 휴대폰 번호 11자리를 숫자로 입력해 주세요. | 휴대폰 번호 입력란 아래 |
| 동의 체크 없이 신청 시도 | 개인정보 수집·이용에 동의해야 신청할 수 있어요. | 동의 항목 아래 |
| 저장 실패 | 신청을 저장하지 못했어요. 다시 시도해 주세요. | 신청하기 버튼 위 |

- 동의 오류 문구를 보여 주는 시점: 미동의 시 버튼이 비활성이라 "신청 시도"가 일어나지 않음 — **확인 필요** (01-context 6절 6)

### 상태
| 상태 | 진입 | 화면 |
|---|---|---|
| 기본 | /apply?plan=<id> | 요약 + 빈 입력란 2개 + 미체크 동의 + 비활성 '신청하기' |
| 로딩 | /apply?plan=<id>&state=loading | Header 유지, 요약·입력 영역 자리에 Skeleton |
| 빈 | /apply?state=empty | Header 유지, StateMessage. 문구: **확인 필요** |
| 오류 | /apply?plan=<id>&state=error | 기본 화면 + 위 오류 문구 4개를 각 표시 위치에 보여 준다 (입력 오류 3개는 입력란·동의 항목 아래, 저장 실패는 신청하기 버튼 위). 실제 동작에서는 해당 상황에서만 각 문구가 나온다 |

- plan 파라미터가 없거나 p01~p04가 아닌 경우의 화면: **확인 필요** (01-context 6절 9)

### 이동
- 들어오는 곳: /plans/[id] '구독 신청하기'
- 나가는 곳:
  - icon/arrowLeft → /plans/[id] (plan 파라미터의 id). 입력값 유지 안 함 (결정 6)
  - '신청하기' (저장 성공) → `router.replace("/complete")`
  - 저장 실패 → 화면 유지, 저장 실패 문구 표시
  - "취소" → /plans/[id] (flow.png · PRD 흐름에 있으나 버튼을 넣을지 **확인 필요**)

---

## 4. 신청 완료 — /complete

- 파일: app/complete/page.tsx
- 피그마 노드: 4145:3189
- 데이터: `getLastSubscription()` + `getPlan(subscription.plan_id)`
- 코드에 "/apply" 문자열 0번 (01-context 5절)

### 구성 요소
| 순서 | 요소 | 내용 | 근거 |
|---|---|---|---|
| 1 | Header (뒤로형) | icon/arrowLeft + 제목 "신청 완료" | screens.md 제목, PRD 4-4의 4 |
| 2 | 완료 표시 | icon/doneMark + "구독 신청이 완료됐어요" | PRD 4-4의 1 |
| 3 | 신청 내역 (ListRow × 5) | 영역 `data-gate="complete-summary"`. 신청 번호(id) · 요금제 이름 · 매달 내는 금액 `formatWon(subscription.monthly_price)` · 신청 일시(created_at) · 신청자 이름(name). 신청 번호 형식·일시 표시 형식 **확인 필요** | PRD 4-4의 2, 규칙 7 |
| 4 | BottomCTA + Button '요금제 더 보기' | → /plans | PRD 4-4의 3, 결정 9 |

넣지 않는 것: screens.md의 신청 상태·제공 혜택·이용 기간·갱신 주기 행, 이메일 안내 문구, "확인" 버튼 (충돌표 11).

### 상태
| 상태 | 진입 | 화면 |
|---|---|---|
| 기본 | /complete (저장된 신청 있음) | 위 구성 요소 |
| 로딩 | /complete?state=loading | Header 유지, 완료 표시·신청 내역 자리에 Skeleton |
| 빈 | /complete?state=empty | Header 유지, StateMessage. 문구: **확인 필요** |
| 오류 | /complete?state=error | Header 유지, StateMessage. 문구: **확인 필요** |

- 저장된 신청이 없을 때(직접 접근) 화면: **확인 필요** (01-context 6절 9. 빈 상태로 보여 줄지 미정)

### 이동
- 들어오는 곳: /apply 저장 성공 (replace)
- 나가는 곳:
  - icon/arrowLeft → /plans (결정 10)
  - '요금제 더 보기' → /plans (결정 9)
  - flow.png의 "끝": 별도 화면 없음

---

## 확인 필요 모음

1. 4개 화면의 빈·오류 상태 안내 문구 (신청 화면 오류는 PRD 문구 4개 사용). 오류 상태의 다시 시도 버튼 여부
2. 목록 Header 제목 "요금제" · Logo 사용 (screens.md 근거, PRD 정의 없음)
3. 목록 안내 둘째 줄 "중요하게 보는 조건을 고르면 추천해 드려요"와 목록 요약 "추천순 · 4개" 사용 여부·문구
4. 필터 칩(베이직·스탠다드·프리미엄)과 p01~p04의 대응
5. PlanCard에 한 줄 설명(description) 표시 여부
6. 상세·신청 화면 ListRow 행 라벨 문구 (예: 데이터, 소진 후 속도, 매달 내는 금액)
7. 신청 화면 Input placeholder, 휴대폰 번호 하이픈 허용·자동 제거 여부
8. 신청 화면 "취소" 버튼 포함 여부
9. 동의 오류 문구를 보여 주는 시점 (버튼 비활성과 충돌)
10. 신청 번호 생성 형식, 신청 일시 표시 형식
11. 잘못된 접근 처리: /plans/[id] 잘못된 id, /apply plan 파라미터 없음·잘못됨, /complete 저장된 신청 없음 — 빈·오류 상태로 처리할지
12. 추천 기준 (Tag 대상은 p03으로 정했으나 기준은 미정)

## 확인 (O/X)

- [O] screens.md "## " 개수 4 = 라우트 수 4 (/plans, /plans/[id], /apply, /complete)
- [O] 화면마다 상태 4가지(기본·로딩·빈·오류)가 있다
- [O] docs/ 파일은 읽기만 했다 (쓴 파일은 harness/02-pages.md 하나)
