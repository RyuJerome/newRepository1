# Design.md

이 문서는 현재 베리어블, 텍스트 스타일, Components 섹션과 390×844 화면 예시를 기준으로 작성했다.
수치는 px 기준이다. 실제 적용이 확인되지 않은 토큰과 스타일은 별도로 표시했다.

## 1. 색 팔레트

### 토큰 구조
- 컬렉션: primitive → semantic
- 모드: Default 단일 모드
- 아래 값은 semantic 토큰의 참조를 해석한 최종 색상이다.
- 같은 색상이어도 역할이 다른 토큰은 구분해서 사용한다.
- 사용처는 Components와 화면 예시에서 확인한 범위다.

### 텍스트

| Semantic 토큰 | 참조 | 값 | 쓰는 곳 |
|---|---|---|---|
| text/primary | gray/900 | #181A1B | 제목, 입력 완료 값, 요금, 일반 본문 |
| text/secondary | gray/600 | #66707A | 보조 설명, List/Row 라벨, Tag 텍스트 |
| text/tertiary | gray/500 | #878787 | Card/Price 라벨, 정가와 부가 설명 |
| text/accent | pink/500 | #FF2E98 | 할인율, List/Row의 강조 값, 단계 표시 |
| text/on-dark | gray/0 | #FFFFFF | Primary 버튼, 선택된 FilterChip, package Chip 텍스트 |
| text/error | red/500 | #E30036 | Input 오류 메시지 |
| text/placeholder | gray/400 | #B7BDC4 | Input 기본·포커스 상태의 표시 텍스트 |
| text/on-disabled | gray/600 | #66707A | 비활성 Input 텍스트 |

### 배경과 표면

| Semantic 토큰 | 참조 | 값 | 쓰는 곳 |
|---|---|---|---|
| bg/surface | gray/0 | #FFFFFF | 화면, Header, BottomCTA, Card/Plan, 기본 OptionItem |
| surface/default | gray/0 | #FFFFFF | Secondary 버튼 기본 배경 |
| bg/default | gray/100 | #F7F7F7 | Card/Price, 선택된 OptionItem 배경 |
| bg/subtle | gray/200 | #EFF1F3 | 비활성 Input, Secondary 버튼 Hover, benefit Chip, 진행 트랙 |
| bg/inverse | gray/800 | #2D2D2D | Components 내부의 실제 적용은 확인되지 않음 |
| bg/accent-subtle | pink/50 | #FFF5FA | sale Chip, 프로모션 칩 |
| bg/error-subtle | red/50 | #FFF0F3 | Components 내부의 실제 적용은 확인되지 않음 |

### 채움과 브랜드

| Semantic 토큰 | 참조 | 값 | 쓰는 곳 |
|---|---|---|---|
| fill/primary | pink/500 | #FF2E98 | Primary 버튼, 선택 표시, 완료 마크 |
| fill/primary-hover | pink/600 | #E6007E | Primary 버튼 Hover |
| fill/accent | pink/600 | #E6007E | Components 내부의 실제 적용은 확인되지 않음 |
| fill/secondary | gray/900 | #181A1B | 선택된 FilterChip, package Chip |
| fill/tertiary | gray/200 | #EFF1F3 | Components 내부의 실제 적용은 확인되지 않음 |
| fill/disabled | gray/300 | #D9DCE0 | Disabled 버튼 |
| fill/disabled-strong | gray/400 | #B7BDC4 | Components 내부의 실제 적용은 확인되지 않음 |
| brand/primary | pink/500 | #FF2E98 | Logo |

### 테두리와 구분선

| Semantic 토큰 | 참조 | 값 | 쓰는 곳 |
|---|---|---|---|
| border/default | gray/300 | #D9DCE0 | Input 기본 선, Secondary 버튼, 기본 카드와 선택지 |
| border/subtle | gray/200 | #EFF1F3 | List/Row 구분선, BottomCTA 상단 선, Tag 배경 |
| border/medium | gray/600 | #66707A | 선택된 Card/Plan·OptionItem의 테두리 |
| border/strong | gray/900 | #181A1B | Components 내부의 실제 적용은 확인되지 않음 |
| border/divider | black/10 | rgba(0, 0, 0, 0.10) | Components 하위 정리 섹션의 경계선 |
| border/focus | pink/500 | #FF2E98 | Input 포커스 선 |
| border/error | red/500 | #E30036 | Input 오류 선 |

### 아이콘과 효과

| Semantic 토큰 | 참조 | 값 | 쓰는 곳 |
|---|---|---|---|
| icon/default | gray/600 | #66707A | 뒤로가기·체크 아이콘 도형 |
| icon/strong | gray/900 | #181A1B | Components 내부의 실제 적용은 확인되지 않음 |
| icon/primary | gray/950 | #000000 | Components 내부의 실제 적용은 확인되지 않음 |
| icon/accent | pink/500 | #FF2E98 | List/Row 강조 점, sale·프로모션 칩 텍스트 |
| icon/on-dark | gray/0 | #FFFFFF | 완료 마크 내부 도형 등 |
| icon/disabled | gray/300 | #D9DCE0 | Components 내부의 실제 적용은 확인되지 않음 |
| icon/error | red/500 | #E30036 | Input 오류 아이콘 |
| effect/shadow-subtle | 직접 값 | rgba(0, 0, 0, 0.05) | 색상 토큰만 정의됨. 그림자의 위치·블러 값은 이 토큰에 포함되지 않음 |

### 적용 시 구분
- `fill/accent`와 `fill/primary-hover`는 같은 값이지만 서로 다른 토큰이다.
- `bg/surface`와 `surface/default`도 별도 토큰으로 유지한다.
- 현재 일부 칩 텍스트에는 `icon/accent`, Tag 배경에는 `border/subtle`이 실제로 바인딩되어 있다. 토큰 접두사만으로 현재 적용을 재해석하지 않는다.
- 정리용 섹션 경계선과 제품 UI 구분선은 구분한다.

## 2. 타이포 스케일

### 공통 설정
- 폰트: Noto Sans KR
- 폰트 변수: `font-family/family-font`
- 모든 텍스트 스타일의 자간: 0%
- 굵기 대응: Medium 500 / SemiBold 600 / Bold 700
- 아래 사용처에서 “권장”은 스타일 위계에 따른 용도이며, 실제 적용 확인과 구분한다.

| 텍스트 스타일 | 크기 / 줄높이 | 굵기 | 쓰는 곳 |
|---|---|---|---|
| heading/h1 | 32 / 44 | Bold 700 | 큰 대표 제목용 권장. Components·확인한 4개 화면의 적용은 확인되지 않음 |
| heading/h2 | 28 / 40 | Bold 700 | Card/Price 주요 금액 |
| heading/h3 | 24 / 32 | Bold 700 | 화면 본문 제목, 섹션 제목, 신청 완료 제목 |
| heading/h4 | 20 / 28 | Medium 500 | Header root 제목. Input default의 숨겨진 메시지에도 적용됨 |
| subtitle/bold | 18 / 26 | Bold 700 | Card/Plan 이름·가격·할인율, BottomCTA 금액, 선택된 OptionItem 제목 |
| subtitle/default | 18 / 26 | SemiBold 600 | Header default 제목 |
| body/strong | 16 / 24 | SemiBold 600 | Button 라벨, Input 값, 기본 OptionItem 제목 |
| body/medium | 16 / 24 | Medium 500 | Primary 버튼 Disabled 라벨 |
| body/small-strong | 14 / 21 | SemiBold 600 | List/Row 값, 선택된 FilterChip 라벨 |
| body/small-medium | 14 / 21 | Medium 500 | 카드 설명, List/Row 라벨, 입력 오류 메시지, 안내 문구, 기본 FilterChip |
| caption/medium | 13 / 18 | Medium 500 | Card/Price 라벨·정가·부가 설명, Card/Plan 정가 |
| caption/bold | 13 / 18 | Bold 700 | Tag, sale·프로모션 칩, StepProgress 단계 문구 |
| caption/small | 12 / 16 | Medium 500 | 작은 보조 정보용 권장. Components 내부의 적용은 확인되지 않음 |
| caption/small-bold | 12 / 16 | Bold 700 | 작은 강조 정보용 권장. Components 내부의 적용은 확인되지 않음 |
| caption/mini | 10 / 14 | SemiBold 600 | benefit·package Chip |
| specimen/weight-medium | 32 / 44 | Medium 500 | 서체 굵기 견본용. 제품 화면의 일반 제목과 구분 |
| specimen/weight-semibold | 32 / 44 | SemiBold 600 | 서체 굵기 견본용. 제품 화면의 일반 제목과 구분 |

### 폰트 크기 변수

| 변수 | 값 |
|---|---:|
| font-size/heading-h1 | 32 |
| font-size/heading-h2 | 28 |
| font-size/heading-h3 | 24 |
| font-size/heading-h4 | 20 |
| font-size/subtitle | 18 |
| font-size/body | 16 |
| font-size/body-small | 14 |
| font-size/caption | 13 |
| font-size/12 | 12 |
| font-size/caption-mini | 10 |

### 적용 규칙
- 텍스트 스타일의 크기·줄높이·굵기를 한 묶음으로 사용한다.
- 크기 변수만으로 줄높이와 굵기가 결정되지는 않는다.
- 확인한 화면에는 텍스트 스타일 연결 없이 폰트 변수와 개별 서식이 적용된 텍스트도 있다.
- Input default의 숨겨진 메시지는 20/28이고, 다른 상태의 메시지는 14/21이다. 현재 원본의 차이이며 공통 규칙으로 일반화하지 않는다.

## 3. 간격·레이아웃

### 모바일 기준
- 기준 화면: 390×844
- 화면 배경: `bg/surface`
- 기본 구조: 상단 Header → 세로 본문 → 필요한 경우 하단 동작 영역
- Header: 너비 390, 높이 56
- Header 좌우 패딩: 16
- Header 상하 패딩: 4
- Header default 내부 간격: 8
- Header root 내부 간격: 12

### 화면 예시의 본문 규격

| 구분 | 본문 패딩 | 주요 세로 간격 | 콘텐츠 너비 |
|---|---|---|---:|
| 요금제 목록 | 상하좌우 24 | 본문 구간 24, 카드 사이 16, 안내 문구 사이 8 | 342 |
| 요금제 상세 | 상하좌우 24 | 본문 구간 24, 섹션 내부 12 | 342 |
| 구독 신청 | 상하좌우 16 | 본문 구간 16, 신청 내용 제목과 카드 사이 12 | 358 |
| 신청 완료 | 상하좌우 16 | 본문 구간 16, 결과 제목과 정보 영역 사이 12 | 358 |

- 본문 여백은 전 화면이 동일하지 않다. 목록·상세는 24, 신청·완료는 16을 사용한다.
- Components의 카드·입력·행은 주로 너비 358 견본으로 구성되어 있다.
- 화면 배치에서는 부모의 콘텐츠 너비에 맞춘다. 목록·상세의 실제 카드 너비는 342다.

### 간격 변수
다음 값이 실제 정의되어 있다.

- `spacing/0`: 0
- `spacing/2`: 2
- `spacing/4`: 4
- `spacing/6`: 6
- `spacing/8`: 8
- `spacing/10`: 10
- `spacing/12`: 12
- `spacing/16`: 16
- `spacing/20`: 20
- `spacing/24`: 24
- `spacing/28`: 28
- `spacing/32`: 32
- `spacing/40`: 40
- `spacing/48`: 48
- `spacing/56`: 56
- `spacing/60`: 60
- `spacing/64`: 64
- `spacing/80`: 80

주요 적용:
- 4: 작은 내부 간격, Header 상하 패딩
- 8: 카드 내부 간격, 버튼 사이 간격, 단계 문구와 트랙 사이
- 12: 섹션 내부 간격, List/Row 상하 패딩, 입력 메시지 간격
- 16: 기본 본문 여백, Header 좌우 여백
- 20: Card/Plan·Card/Price 내부 패딩
- 24: 목록·상세 본문 여백, 버튼 좌우 패딩
- 32: BottomCTA 하단 여백

### 모서리 변수
- `radius/0`: 0
- `radius/2`: 2
- `radius/4`: 4
- `radius/5`: 5
- `radius/6`: 6
- `radius/8`: 8
- `radius/10`: 10
- `radius/12`: 12
- `radius/16`: 16
- `radius/20`: 20
- `radius/24`: 24
- `radius/32`: 32
- `radius/40`: 40
- `radius/999`: 999
- `radius/full`: 9999

주요 적용:
- Button: 8
- Card/Price·OptionItem: 12
- Card/Plan: 16
- benefit·package Chip: 4
- sale Chip: 6
- Tag: 999
- FilterChip·선택 표시·진행 트랙·완료 마크: full
- Header·Input: 0

### 하단 영역
Components의 BottomCTA:
- single·double: 좌우 16, 상단 12, 하단 32, 내부 간격 8
- price: 좌우 16, 상단 16, 하단 32, 내부 간격 12
- 하단 32는 컴포넌트 설명상 홈 인디케이터 여백이다.
- double은 버튼 2개를 가로로 배치한다.

화면 예시의 하단 동작:
- BottomCTA 인스턴스가 아니라 별도 프레임과 Button으로 구성되어 있다.
- 요금제 상세: 좌우 24, 상단 16, 하단 32, 버튼 간격 8
- 구독 신청: 좌우 24, 상단 16, 하단 24, 버튼 간격 8
- 신청 완료: 좌우 24, 상단 16, 하단 24, 안내와 버튼 간격 12
- 상세·신청의 버튼은 세로로 배치되어 있으므로 BottomCTA double과 동일한 구조로 취급하지 않는다.
- Figma 배치만으로 실제 스크롤·고정 동작이 구현되어 있다고 가정하지 않는다.

## 4. 컴포넌트 용법

### 속성 표기
- 아래 속성 이름은 Figma의 식별용 접미사를 제외한 표시 이름이다.
- 명시적으로 정의된 속성과 내부 텍스트 오버라이드는 구분한다.
- 변형의 대소문자를 유지한다. 예: Button은 `Default`, Input은 `default`.
- 상태별 모양이 존재하는 것과 실제 동작이 연결된 것은 별개다.

### Header
- 변형: `Type=default | root`
- 기본값: `default`
- 텍스트 속성: `Title`
- 공통 크기: 390×56

사용 규칙:
- default: 뒤로 아이콘 + 가운데 제목 + 우측 균형 공간
- root: 뒤로 아이콘 없이 좌측 제목 + 우측 Logo
- default 제목은 subtitle/default, root 제목은 heading/h4를 사용한다.
- 서비스 첫 화면과 하위 화면을 Type으로 구분한다.

### Button
- 변형:
  - `Type=Primary | Secondary`
  - `Size=lg | sm | xl`
  - `State=Default | Hover | Disabled`
- 기본값: `Primary / xl / Default`
- 텍스트 속성: `Label`
- 정의된 조합: 18개
- 모서리: 8

| 크기 | 원본 높이 | 좌우 패딩 |
|---|---:|---:|
| sm | Primary 40 / Secondary Default·Hover 42 / Secondary Disabled 40 | 24 |
| lg | 48 | 24 |
| xl | 52 | 24 |

사용 규칙:
- Primary는 주요 동작, Secondary는 보조 동작에 사용한다.
- Primary Default: fill/primary + text/on-dark
- Primary Hover: fill/primary-hover
- Secondary Default: surface/default + border/default + text/primary
- Secondary Hover: bg/subtle
- Disabled 배경: fill/disabled
- Primary Disabled 라벨은 body/medium이다. Secondary Disabled 라벨은 body/strong을 유지한다.
- 기본 라벨은 body/strong이다.
- 하단 주요 버튼은 xl을 사용하고 부모 콘텐츠 너비에 맞춘다.
- xl은 원본 높이 52를 기준으로 한다. 저장된 상하 패딩 값만 더해 높이를 다시 산출하지 않는다.
- sm의 변형별 높이 차이는 현재 원본 값이며 동일 높이로 임의 치환하지 않는다.

### Input
- 변형: `State=default | caution | disabled | filled | focus`
- 기본값: `default`
- Boolean 속성: `errorMessage`, 기본값 false
- 별도의 value 텍스트 속성은 정의되어 있지 않다.
- 기본 견본: 너비 358, 입력 영역 높이 58
- caution 견본 전체 높이: 91
- 입력 영역과 메시지 사이 간격: 12
- 입력 텍스트: body/strong

사용 규칙:
- default: placeholder 텍스트와 border/default
- focus: border/focus
- filled: 실제 값과 text/primary
- caution: border/error, 오류 아이콘과 오류 메시지
- disabled: bg/subtle, text/on-disabled
- caution은 메시지가 기본 표시되어 있다.
- 다른 상태의 메시지 표시 여부는 연결된 errorMessage 속성으로 조절한다.
- 실제 입력 값은 내부 value 텍스트를 오버라이드한다.
- 화면 예시에는 default 상태에 실제 이름·이메일이 들어간 인스턴스도 있으므로 표시 내용만으로 filled 변형 적용 여부를 판단하지 않는다.

### Checkbox
- 변형: `State=default | active`
- 기본값: `default`
- 크기: 24×24
- 별도 라벨 속성 없음

사용 규칙:
- default는 비선택, active는 선택 상태에 사용한다.
- active는 fill/primary와 밝은 체크 표시로 구분한다.
- 설명 텍스트가 필요하면 외부 레이아웃에서 함께 배치한다.
- disabled·error 변형은 정의되어 있지 않다.

### FilterChip
- 변형: `State=default | selected`
- 기본값: `default`
- 텍스트 속성: `Label`
- 높이: 40
- 패딩: 상하 8, 좌우 16
- 모서리: full

사용 규칙:
- 조건·정렬 선택용이다.
- 컴포넌트 설명 기준으로 한 선택 그룹에서 selected는 한 번에 1개다.
- default: 흰 배경, border/default, body/small-medium
- selected: fill/secondary, text/on-dark, body/small-strong
- 분홍색이 아니라 회색조로 선택 상태를 표현한다.

### Tag
- 단일 컴포넌트, 변형·명시적 속성 없음
- 견본: 48×26
- 패딩: 상하 4, 좌우 12
- 모서리: 999
- 텍스트: caption/bold
- 배경: border/subtle
- 텍스트 색: text/secondary

사용 규칙:
- 추천 등 짧은 상태·분류 표시에 사용한다.
- 문구는 내부 label 텍스트를 오버라이드한다.
- 선택 가능한 필터 역할은 FilterChip과 구분한다.

### Chip
- 변형: `Type=benefit | package | sale`
- 기본값: `sale`
- 별도 Label 텍스트 속성 없음

| Type | 원본 높이 | 모서리 | 텍스트 스타일 | 표현 |
|---|---:|---:|---|---|
| benefit | 20 | 4 | caption/mini | bg/subtle 배경 |
| package | 20 | 4 | caption/mini | fill/secondary 배경, 밝은 텍스트 |
| sale | 24 | 6 | caption/bold | bg/accent-subtle 배경, 강조 텍스트 |

사용 규칙:
- benefit은 혜택 정보, package는 패키지 구분, sale은 절약·프로모션 정보에 사용한다.
- 문구는 내부 label 텍스트를 오버라이드한다.
- 선택 상태 변형은 없으며 FilterChip을 대신하지 않는다.

### Card/Plan
- 변형: `State=default | selected`
- 기본값: `default`
- 텍스트 속성:
  - Name
  - Desc
  - Discount
  - Price
  - Original
- Boolean 속성:
  - Badge: 기본 true
  - Promo: 기본 true
  - Sale: 기본 true
- 견본 너비: 358
- 패딩: 20
- 내부 간격: 8
- 모서리: 16

사용 규칙:
- 요금제 이름·설명·가격·배지·프로모션·버튼을 묶어서 표시한다.
- default: border/default 1
- selected: border/medium 1.5
- Sale은 할인율과 정가 표시를 제어한다.
- Badge·Promo·Sale을 모두 끄면 이름·설명·월 요금·버튼 중심의 기본 카드로 사용한다.
- 추천 표시가 필요하면 Badge만 유지할 수 있다.
- 이름·가격은 subtitle/bold, 설명은 body/small-medium, 정가는 caption/medium을 사용한다.
- 내부 버튼은 중첩된 Button에서 조절한다.
- 화면 예시의 목록 카드는 너비 342로 배치되어 있다.

### Card/Price
- Components 섹션에는 외부 라이브러리의 인스턴스로 배치되어 있다.
- 확인된 변형·명시적 속성: 없음
- 견본: 358×124
- 패딩: 20
- 내부 간격: 4
- 모서리: 12
- 배경: bg/default

사용 규칙:
- 주요 금액과 부가 정보를 요약한다.
- 주요 가격: heading/h2
- 할인율: subtitle/bold + text/accent
- 라벨·정가·프로모션 설명: caption/medium + text/tertiary
- 현재 노출된 텍스트는 내부 텍스트 오버라이드로 변경한다.
- 로컬 컴포넌트 세트처럼 미정의 변형이나 속성이 있다고 가정하지 않는다.
- 상세 화면 예시에서는 너비 342로 사용하며, 선택한 요금제와 부가세·정기 구독 정보를 표시한다.

### List/Row
- 변형: `Type=default | check`
- 기본값: `default`
- 텍스트 속성: `Label`, `Value`
- 견본: 358×46
- 패딩: 상하 12, 좌우 4
- 내부 간격: 12

사용 규칙:
- default는 라벨과 값을 나란히 보여주는 정보 행이다.
- check는 혜택 목록용이며 원본에는 작은 강조 점이 추가되어 있다.
- check라는 이름만으로 체크 아이콘이 들어간다고 가정하지 않는다.
- 라벨은 body/small-medium, 값은 body/small-strong이다.
- check의 값은 text/accent를 사용한다.
- 신청·완료 화면처럼 값이 여러 줄인 경우 콘텐츠에 맞는 행 높이를 확보한다.

### OptionItem
- 변형: `State=default | selected`
- 기본값: `default`
- 텍스트 속성: `Title`, `Desc`
- 견본 너비: 358
- 높이: default 83 / selected 86
- 패딩: 상하 16, 좌우 20
- 내부 간격: 12
- 모서리: 12
- 선택 표시: 22×22

사용 규칙:
- 여러 선택지 중 하나를 고르는 단일 선택 카드다.
- 한 선택 그룹에서 selected는 한 번에 1개다.
- default: bg/surface, border/default 1
- selected: bg/default, border/medium 1.5, 분홍색 선택 표시
- 기본 제목은 body/strong, 선택된 제목은 subtitle/bold로 바뀐다.
- 설명은 body/small-medium을 유지한다.
- 상태 변경 시 제목 크기와 높이도 달라진다는 점을 배치에 반영한다.

### StepProgress
- 변형: `Step=1 | 2 | 3`
- 기본값: `1`
- 견본: 358×30
- 단계 문구와 트랙 간격: 8
- 트랙 높이: 4
- 트랙 모서리: full
- 단계 문구: caption/bold + text/accent
- 트랙 배경: bg/subtle

사용 규칙:
- 실제로 여러 단계로 나뉜 질문·입력 흐름에 사용한다.
- 문구와 진행 표시를 같은 Step 변형으로 맞춘다.
- 3단계 이외의 변형은 정의되어 있지 않다.
- 기존 4개 구독 화면에 사용되지 않았으므로 화면 수에 맞춰 임의로 추가하지 않는다.

### BottomCTA
- 변형: `Layout=single | double | price`
- 기본값: `single`
- 텍스트 속성: `Amount`, `AmountLabel`
- 너비: 390
- 배경: bg/surface
- 하단 여백: 32

사용 규칙:
- single: 주요 버튼 1개
- double: 보조 버튼과 주요 버튼을 가로로 배치
- price: 금액 요약 행과 주요 버튼을 세로로 배치
- single·double 높이는 원본 기준 97, price는 139다.
- 버튼 라벨은 중첩 Button의 Label을 변경한다.
- Amount·AmountLabel은 price 레이아웃의 금액 정보에 사용한다.
- 화면 예시의 세로 버튼 2개 영역은 이 컴포넌트의 double 변형과 다르다.

### 아이콘
| 컴포넌트 | 크기 | 용도 |
|---|---|---|
| icon/arrowLeft | 24×24 | Header의 뒤로가기 표시 |
| icon/check | 24×24 | 체크 표시 |
| icon/doneMark | 64×64 | 완료 상태 강조 표시 |

- 모두 단일 컴포넌트이며 명시적 변형·속성은 없다.
- doneMark는 원형 분홍색 배경과 밝은 내부 도형으로 구성된다.
- 아이콘 배치만으로 이동이나 상태 변경 동작이 정의되지는 않는다.

### Logo
- 단일 컴포넌트
- 크기: 32×24
- 색상: brand/primary
- 명시적 변형·속성 없음

사용 규칙:
- Header root의 우측 브랜드 표시에 사용한다.
- 원본 비율을 유지한다.
