# CLAUDE.md — 요금제 추천·구독 화면 하네스

## 목표
docs/의 PRD·screens·Design·tokens와 reference/links.md를 읽어, 4개 화면을 Next.js(App Router · TypeScript · Tailwind) 모바일 웹으로 구현한다.
완료: 자동 게이트 전부 통과 + 사람 승인 1번.

## 0. 메인 대화(오케스트레이터)의 역할
- 메인 대화는 **직접 구현하지 않는다.** app/, lib/, harness/0*.md, app/tokens.css를 직접 쓰지 않는다.
- 하는 일: ① 단계 시작·종료 기록(`node harness/scripts/stage.mjs`) ② 에이전트·스크립트 호출 ③ 게이트 실행 ④ 통과 시 커밋.
- 게이트가 실패하면 직접 고치지 말고, 복귀 단계의 에이전트를 실패 내용과 함께 다시 부른다.
- 단계 하나의 순서: `stage.mjs start <단계>` → 에이전트(또는 스크립트) 실행 → `stage.mjs pass <단계>` → 통과면 커밋 / 실패면 `stage.mjs fail <단계> --back <복귀 단계> --reason "..."` 후 복귀 단계부터 다시.

## 1. 자료와 기준
- 우선순위: PRD.md > screens.md > 화면 링크 > Make 링크 > flow.png  (링크는 reference/links.md)
- 화면 링크: 컴포넌트·토큰·화면 구성 근거. Make 링크: 화면 이동 흐름만 (코드·스타일·화면 요소는 따르지 않음).
- **토큰 밖 임의 값은 쓰지 않는다. 색·간격·모서리·글자는 docs/tokens.json에 있는 값만 쓴다.** Design.md는 컴포넌트 용법만 참고한다.
- PRD에 없는 화면 요소는 화면 링크를 따르고, 데이터·기능은 지어내지 않는다. 모르면 "확인 필요".
- 결정·충돌의 상세 표와 근거는 harness/01-context.md가 기준이다. 요약:
  - 라우트: /plans, /plans/[id], /apply, /complete (PRD)
  - 요금제: p01~p04 (PRD), 매달 내는 금액 낮은 순. 추천 Tag는 p03 1개 (사용자 결정·피그마 화면과 맞춤)
  - 신청 입력: 이름·휴대폰 번호·개인정보 동의 (PRD). 뒤로 갈 때 입력값 유지 안 함
  - 필터 칩: 전체·베이직·스탠다드·프리미엄 (화면 링크 4145:3129). 누르면 선택 표시만 바뀜, 필터링 안 함 (사용자 결정, PRD 대체)
  - 완료 화면: '요금제 더 보기' → /plans (Make 근거), 뒤로 → /plans (사용자 결정)
  - OptionItem·통화/문자 행: 넣지 않음
  - 상태: 4개 화면 모두 `?state=loading|empty|error`로 렌더링. 로딩은 스켈레톤. 빈·에러 문구는 screens.md 문구, 없으면 "확인 필요". 신청 오류 4개는 PRD 문구 그대로
  - 저장: Supabase subscriptions 테이블 (supabase/subscriptions.sql), 코드는 lib/subscription.ts 한 곳. 키는 .env.local의 NEXT_PUBLIC_SUPABASE_URL · NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (사용자 결정, sessionStorage 대체)
  - 신청 화면은 저장 후 받은 신청 번호(id)를 들고 router.replace("/complete?id=<id>")로 이동하고, 완료 화면은 그 번호로 1건만 다시 읽어 보여 준다. id가 없거나 찾지 못하면 /plans로 보낸다 (사용자 결정)
  - 완료 화면의 신청자 이름은 가운데 글자를, 휴대폰 번호는 가운데 4자리를 가린다: 홍*동, 010-****-5678 (사용자 결정, 표기는 화면 링크 신청 완료 프레임)
  - 모바일 기준 폭: 앱 전체를 폭 390px 컨테이너 안에 가운데 정렬 (넓은 화면에서도 390보다 넓어지지 않음). 390은 레이아웃 치수로 app/globals.css의 `--layout-width: 390px;` 한 곳에만 정의 (사용자 결정)
  - 하단 버튼 영역이 있는 화면은 본문 아래에 그 높이만큼 여백을 둬서 끝까지 보이게 한다 (사용자 결정)
  - 저장된 신청이 없을 때 /complete를 열면 /plans로 보낸다 (사용자 결정)
  - 신청 화면 휴대폰 번호 입력란에는 숫자만 입력된다 (사용자 결정)
  - 목록 화면은 추천 요금제(recommended)를 무조건 맨 위에 두고, 나머지는 매달 내는 금액 낮은 순 → p03, p01, p02, p04 (사용자 결정). lib/plans.ts의 데이터 순서(p01→p04)는 그대로 두고 화면에서만 정렬한다
  - 위 5개는 01-context.md 작성 뒤에 정한 결정이다. 01-context.md와 다르면 이 절이 우선한다.

## 2. 파이프라인
| 단계 | 담당 | 입력 | 출력 (편집 허용 범위) | 단계 게이트 |
|---|---|---|---|---|
| 1 | context-writer | PRD.md, 이 파일 1절 | harness/01-context.md | 필수 절(스토리·판정 규칙·충돌표·결정표·data-gate 계약) 존재, G14 |
| 2 | page-splitter (기존) | screens.md, PRD.md, flow.png, 01-context.md | harness/02-pages.md | 02-pages 라우트 = PRD 4개, screens.md `## ` = 4, G14 |
| 3 | build-tokens.mjs | docs/tokens.json | app/tokens.css | G2, G14 |
| 4-1 | data-builder | 01, 02, PRD.md | lib/ | G4(데이터), G5, G11, G14 |
| 4-2 | screen-builder → code-comments 스킬 | 01, 02, tokens.css, Design.md, lib/, 화면 링크, Make 링크(이동만) | app/ (공통 컴포넌트는 app/_components/) | G1, G3, G4, G5, G10a, G11, G13, G14, G15 |
| 5 | judge (읽기 전용) | 전체 | 없음 (보고서는 check-all.mjs가 harness/05-report.md에 씀) | 자동 게이트 전부 → 사람 승인 |

- page-splitter를 부를 때 지시문에 반드시 넣는다: "라우트·데이터·입력 항목은 harness/01-context.md 기준. screens.md의 /subscription/* 경로는 쓰지 않는다."
- 4-2가 끝나면 screen-builder가 code-comments 스킬로 app/ 화면 파일에 주석을 단다 (동작 변경 금지).
- 3단계는 에이전트 없이 `node harness/scripts/build-tokens.mjs`를 실행한다.

## 3. 자동 게이트 (`node harness/scripts/check-all.mjs [--stage N]`)
G1 화면 수 · G2 토큰 동기화 · G3 토큰 밖 값 · G4★ 가격(규칙 3) · G5★ 속도(규칙 5) · G10a /complete에 /apply 0번 · G11 저장 위치 · G13 금지어 · G14 원본 보호 · G15 build·lint
(정확한 기준은 harness/scripts/gates/*.mjs 주석과 01-context.md)
- G3 예외는 1개뿐: app/globals.css의 `--layout-width: 390px;` 정의 1번 (harness/scripts/lib/token-rules.mjs). 화면 코드에서 390 · [ ] 임의 값은 그대로 위반.

## 4. 실패와 복귀
- G1 → 2 / G2 → 3 / G3·G4·G5·G10a·G11·G13·G15 → 4 (데이터 원인이면 4-1, 화면 원인이면 4-2) / G14 → 해당 단계
- 같은 단계로 자동 복귀 2번 뒤에도 실패하면 멈추고 사람에게 묻는다. 횟수는 harness/state.json에 기록된다.

## 5. 사람 승인 (1번, 5단계)
자동 게이트가 모두 통과하면:
1. `npm run dev`로 localhost를 띄우고, 4개 화면 스크린샷과 화면 링크 프레임 4개를 harness/review/에 나란히 저장한다.
   - localhost: `node harness/scripts/review-shots.mjs` (harness/review/localhost/, 상태별 16장)
   - 화면 링크: Figma MCP get_screenshot으로 01-context.md 5절의 프레임 노드 4개를 harness/review/figma/에 저장
2. 아래 O/X 체크리스트와 함께 보여 준다. 비교 기준은 컴포넌트·배치·토큰이며, 데이터(요금제 이름·금액) 차이는 제외한다.
   - [ ] G6 목록: 카드 4개 p03(추천)→p01→p02→p04, 추천 Tag는 p03에만, 칩 4개 중 선택 1개, 칩을 눌러도 카드 4개 유지, OptionItem 없음
   - [ ] G7 신청 버튼: 이름 빔 / 번호가 11자리 숫자 아님 / 동의 안 함 → 각각 '신청하기' 비활성. 오류 문구 4개가 PRD와 같음
   - [ ] G8 값 일치: p01·p03으로 신청 시 완료 화면의 요금제 이름·매달 내는 금액이 선택한 요금제와 같음
   - [ ] G9 이동: flow 7개가 모두 맞는 화면으로 감
   - [ ] G10b 재제출 방지: 신청 후 /complete에서 ① 브라우저 뒤로가기를 눌러도 /apply로 돌아가지 않는다 ② 화면의 뒤로 아이콘은 /plans로 간다 ③ 새로고침해도 저장된 신청은 1건 그대로다 ④ 어떤 경로로도 같은 신청이 다시 제출되지 않는다
   - [ ] G12 상태: 4개 화면 각각 ?state=loading · ?state=empty · ?state=error가 렌더링된다 (로딩은 스켈레톤, 빈·에러는 screens.md 문구 또는 "확인 필요", 신청 화면 에러는 PRD 문구)
3. 전부 O면 `stage.mjs approve` 후 마지막 커밋. X가 있으면 `stage.mjs fail 5 --back 4-2 --human --reason "..."`으로 4단계로 (자동 복귀 횟수에 세지 않음).

## 6. 커밋과 이어 하기
- 브랜치는 main 하나. 새 브랜치·worktree 금지.
- push는 원격 저장소 github.com/Highstand/uplus-plan-claude(origin)의 main으로만, `git push origin main`만 허용한다 (사용자 결정). 강제 push 금지. 에이전트는 push하지 않고, 메인 대화가 사용자가 요청할 때만 한다.
- 단계 게이트가 통과할 때마다 메인 대화가 커밋 1개: `harness: <단계> <이름> 통과`
- "이어서 해줘": harness/state.json과 마지막 커밋을 읽고(`node harness/scripts/stage.mjs status`), 통과하지 못한 첫 단계부터 시작한다.

## 7. 훅이 막는 것 (.claude/settings.json)
- `git push origin main` 말고의 push, 강제 push, 새 브랜치, worktree, reset --hard, git clean
- 현재 단계의 편집 범위 밖 쓰기 (harness/state.json의 단계 기준)
- docs/, reference/, .claude/agents/page-splitter.md, .claude/skills/code-comments/ 쓰기
- app/tokens.css 직접 수정 (3단계 스크립트만)
- app/·lib/에 토큰 밖 값(G3 패턴)이나 금지어(G13)가 들어간 쓰기

## 8. 부르는 말
"화면 만들어줘" 1~5 전체 · "이어서 해줘" · "맥락 정리해줘" 1 · "화면 나눠줘" 2 · "토큰 적용해줘" 3 · "데이터 만들어줘" 4-1 · "화면 구현해줘" 4-2 · "검증해줘" 5

@AGENTS.md
