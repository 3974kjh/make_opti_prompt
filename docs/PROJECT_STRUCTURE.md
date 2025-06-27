# 프로젝트 구조

## 📁 디렉토리 구조

```
prompt-optimizer/
├── docs/                        # 📚 프로젝트 문서
│   ├── README.md               # 문서 인덱스
│   ├── REQUIREMENTS.md         # 요구사항 명세
│   ├── DEV_PLAN.md            # 개발 계획
│   ├── PROJECT_STRUCTURE.md    # 프로젝트 구조
│   ├── CURSOR_CONTEXT.md       # Cursor AI 컨텍스트
│   ├── DATA_STRUCTURE.md       # 데이터 구조 명세
│   └── QUICK_NOTES.md         # 빠른 메모
├── src/                        # 📦 소스 코드
│   ├── lib/                   # 🔧 유틸리티 및 서비스
│   │   ├── components/        # 🧩 재사용 가능한 컴포넌트
│   │   │   ├── common/       # 공통 컴포넌트
│   │   │   │   ├── Button.svelte
│   │   │   │   ├── Input.svelte
│   │   │   │   ├── TextArea.svelte
│   │   │   │   ├── Card.svelte
│   │   │   │   ├── Modal.svelte
│   │   │   │   └── Tooltip.svelte
│   │   │   ├── layout/       # 레이아웃 컴포넌트
│   │   │   │   ├── Header.svelte
│   │   │   │   ├── Footer.svelte
│   │   │   │   ├── Sidebar.svelte
│   │   │   │   └── Navigation.svelte
│   │   │   └── forms/        # 폼 관련 컴포넌트
│   │   │       ├── PromptForm.svelte
│   │   │       ├── TemplateSelector.svelte
│   │   │       └── InputField.svelte
│   │   ├── stores/            # 🗄️ Svelte 5 Runes 기반 상태 관리
│   │   │   ├── promptStore.ts # 프롬프트 관련 상태
│   │   │   ├── themeStore.ts  # 테마 관련 상태
│   │   │   └── historyStore.ts # 히스토리 관련 상태
│   │   ├── services/          # 🛠️ 비즈니스 로직 서비스
│   │   │   ├── promptGenerator.ts # 프롬프트 생성 로직
│   │   │   ├── localStorage.ts    # localStorage 관리
│   │   │   ├── templateService.ts # 템플릿 관리
│   │   │   └── clipboardService.ts # 클립보드 복사
│   │   ├── utils/             # 🔧 유틸리티 함수
│   │   │   ├── constants.ts   # 상수 정의
│   │   │   ├── helpers.ts     # 헬퍼 함수
│   │   │   ├── validators.ts  # 유효성 검사
│   │   │   └── formatters.ts  # 데이터 포맷팅
│   │   └── types/             # 📝 TypeScript 타입 정의
│   │       ├── prompt.ts      # 프롬프트 관련 타입
│   │       ├── template.ts    # 템플릿 관련 타입
│   │       └── common.ts      # 공통 타입
│   ├── routes/                # 🛣️ SvelteKit 라우팅 (필요시)
│   │   └── +page.svelte      # 메인 페이지
│   ├── app.html              # HTML 템플릿
│   ├── app.css               # 글로벌 스타일
│   └── main.ts               # 앱 진입점
├── static/                    # 📁 정적 파일
│   ├── favicon.ico
│   ├── logo.svg
│   └── images/
├── tests/                     # 🧪 테스트 파일
│   ├── unit/                 # 단위 테스트
│   │   ├── promptGenerator.test.ts
│   │   ├── localStorage.test.ts
│   │   └── validators.test.ts
│   └── e2e/                  # E2E 테스트
│       └── main.test.ts
├── .github/                   # GitHub 설정
│   └── workflows/
│       └── deploy.yml        # Cloudflare Pages 배포
├── package.json              # 의존성 및 스크립트
├── vite.config.ts           # Vite 설정
├── tailwind.config.js       # Tailwind CSS 설정
├── tsconfig.json            # TypeScript 설정
├── svelte.config.js         # Svelte 설정
├── .gitignore               # Git 무시 파일
└── README.md                # 프로젝트 메인 README
```

## 🧩 주요 컴포넌트 구조

### Common 컴포넌트
```
src/lib/components/common/
├── Button.svelte        # CTA 버튼, 일반 버튼
├── Input.svelte         # 텍스트 입력 필드
├── TextArea.svelte      # 멀티라인 텍스트 입력
├── Card.svelte          # 카드 컨테이너
├── Modal.svelte         # 모달 다이얼로그
└── Tooltip.svelte       # 툴팁 컴포넌트
```

### Form 컴포넌트
```
src/lib/components/forms/
├── PromptForm.svelte         # 메인 프롬프트 입력 폼
├── TemplateSelector.svelte   # 템플릿 선택 UI
└── InputField.svelte         # 육하원칙 입력 필드
```

## 📋 파일 명명 규칙

### Svelte 컴포넌트
- **컴포넌트**: PascalCase (예: `PromptForm.svelte`)
- **페이지**: PascalCase + Page 접미사 (예: `MainPage.svelte`)
- **레이아웃**: PascalCase (예: `Header.svelte`)

### TypeScript 파일
- **서비스**: camelCase (예: `promptGenerator.ts`)
- **스토어**: camelCase + Store 접미사 (예: `promptStore.ts`)
- **타입**: camelCase (예: `prompt.ts`)
- **유틸리티**: camelCase (예: `helpers.ts`)
- **상수**: UPPER_SNAKE_CASE (예: `TEMPLATE_TYPES.ts`)

## 🎯 핵심 파일 목록

### 필수 구현 파일
- [x] `src/main.ts` - 앱 진입점
- [x] `src/app.html` - HTML 템플릿
- [x] `src/app.css` - 글로벌 스타일
- [ ] `src/lib/components/forms/PromptForm.svelte` - 메인 프롬프트 폼
- [ ] `src/lib/services/promptGenerator.ts` - 프롬프트 생성 로직
- [ ] `src/lib/services/localStorage.ts` - 데이터 저장 관리
- [ ] `src/lib/stores/promptStore.ts` - 프롬프트 상태 관리
- [ ] `src/lib/types/prompt.ts` - 프롬프트 타입 정의

### 핵심 기능별 파일
- [ ] **육하원칙 입력**: `InputField.svelte`, `promptGenerator.ts`
- [ ] **템플릿 관리**: `TemplateSelector.svelte`, `templateService.ts`
- [ ] **히스토리 관리**: `historyStore.ts`, `localStorage.ts`
- [ ] **클립보드 복사**: `clipboardService.ts`
- [ ] **테마 관리**: `themeStore.ts`

## 🔧 설정 파일들
- `package.json` - Svelte 5, TypeScript, Tailwind CSS, Vite 의존성
- `vite.config.ts` - Vite 빌드 설정
- `svelte.config.js` - Svelte 컴파일러 설정
- `tailwind.config.js` - Tailwind CSS 설정 (다크모드 포함)
- `tsconfig.json` - TypeScript 설정
- `.env` - 환경 변수 (개발/프로덕션)
- `.gitignore` - Git 무시 파일
- `wrangler.toml` - Cloudflare Pages 설정 (필요시)

## 📝 코딩 컨벤션
- **들여쓰기**: 2 spaces
- **따옴표**: 작은따옴표 선호 (`'`)
- **세미콜론**: 항상 사용
- **컴포넌트 export**: default export 사용
- **타입 정의**: interface 선호 (type보다)
- **Runes 사용**: `$state()`, `$derived()`, `$effect()` 적극 활용

## 🎨 Tailwind CSS 클래스 구조
```css
/* 컴포넌트별 클래스 조직 */
.btn-primary { @apply bg-blue-600 hover:bg-blue-700 text-white ... }
.card-base { @apply bg-white dark:bg-gray-800 rounded-lg shadow ... }
.input-field { @apply border border-gray-300 dark:border-gray-600 ... }
```

## 📱 반응형 브레이크포인트
- **Mobile**: < 640px (sm)
- **Tablet**: 640px - 1024px (md, lg)
- **Desktop**: > 1024px (xl, 2xl) 