# LLM 프롬프트 자동 생성기 (Prompt Optimizer)

> LLM에게 효과적으로 질문하기 위한 프롬프트를 자동 생성하는 웹 애플리케이션입니다. 육하원칙 기반의 구조화된 입력을 통해 더 정확하고 질 높은 답변을 받을 수 있도록 도와줍니다.

## 📚 문서 구조

이 프로젝트의 상세한 정보는 `docs/` 폴더의 다음 문서들에서 확인할 수 있습니다:

- **[📋 REQUIREMENTS.md](./docs/REQUIREMENTS.md)** - 프로젝트 요구사항 및 핵심 기능
- **[🗓️ DEV_PLAN.md](./docs/DEV_PLAN.md)** - 개발 계획 및 우선순위
- **[📊 DATA_STRUCTURE.md](./docs/API_SPEC.md)** - 데이터 구조 명세서
- **[📁 PROJECT_STRUCTURE.md](./docs/PROJECT_STRUCTURE.md)** - 프로젝트 구조 및 파일 조직
- **[🤖 CURSOR_CONTEXT.md](./docs/CURSOR_CONTEXT.md)** - Cursor AI 컨텍스트 가이드
- **[📝 QUICK_NOTES.md](./docs/QUICK_NOTES.md)** - 빠른 메모 & 할 일

> 💡 **Cursor 사용자를 위한 팁**: 위 문서들을 먼저 읽어보시면 프로젝트 구조와 요구사항을 빠르게 파악할 수 있습니다.

## 🚀 빠른 시작

### 필요 조건
- Node.js 18+
- npm 또는 yarn

### 설치 및 실행
```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 빌드
npm run build
```

## 🛠️ 기술 스택
- **Frontend**: Svelte 5 (Runes)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **Hosting**: Cloudflare Pages

## 📝 개발 상태

### 현재 진행 상황
- [x] 프로젝트 설정 완료
- [x] 문서 작성 완료
- [ ] 기본 구조 생성
- [ ] 핵심 기능 구현
- [ ] 테스트 작성
- [ ] 배포 준비

### 다음 할 일
- 육하원칙 기반 입력 폼 개발
- 프롬프트 자동 생성 로직 구현
- localStorage 기반 데이터 저장
- 반응형 UI/UX 구현

## 🤝 기여 방법
1. 이슈를 확인하거나 새로운 이슈를 생성
2. 브랜치를 생성하여 작업
3. 변경사항을 커밋하고 푸시
4. Pull Request 생성

## 📞 연락처
- 개발자: [이름]
- 이메일: [이메일]
- 프로젝트 링크: [GitHub/GitLab 링크]

## 🚀 배포하기

### Cloudflare Pages로 배포

이 프로젝트는 Cloudflare Pages에 최적화되어 있습니다.

#### 방법 1: GitHub 연동 (추천)

1. **GitHub 저장소 생성**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git push -u origin main
   ```

2. **Cloudflare Pages 설정**
   - [Cloudflare Dashboard](https://dash.cloudflare.com/)에 로그인
   - **Pages** → **Create a project** → **Connect to Git**
   - GitHub 저장소 선택
   - 빌드 설정:
     - **Framework preset**: `SvelteKit`
     - **Build command**: `npm run build`
     - **Build output directory**: `.svelte-kit/output/client`
     - **Root directory**: `/` (기본값)
     - **Node.js version**: `18` 또는 `20`

3. **환경 변수 설정 (선택사항)**
   ```
   NODE_VERSION=20
   ```

4. **배포 시작**
   - **Save and Deploy** 클릭

#### 방법 2: Wrangler CLI 사용

1. **Wrangler 설치**
   ```bash
   npm install -g wrangler
   ```

2. **Cloudflare 로그인**
   ```bash
   wrangler login
   ```

3. **배포**
   ```bash
   # Windows
   .\deploy.bat
   
   # Linux/Mac
   ./deploy.sh
   ```

### 🔧 빌드 설정 상세

- **빌드 명령어**: `npm run build`
- **출력 디렉토리**: `.svelte-kit/output/client`
- **Node.js 버전**: 18+ 권장
- **패키지 매니저**: npm (권장)

### ✅ 배포 후 확인사항

1. **사이트 접속 확인**
2. **파비콘 표시 확인**
3. **5W1H 입력 기능 테스트**
4. **프롬프트 생성 테스트**
5. **템플릿 저장/로드 테스트**
6. **반응형 디자인 확인**

### 🐛 문제 해결

**빌드 오류 시:**
```bash
# 의존성 재설치
rm -rf node_modules package-lock.json
npm install

# 빌드 재시도
npm run build
```

**배포 실패 시:**
- 빌드 출력 디렉토리가 `.svelte-kit/output/client`인지 확인
- Node.js 버전이 18+ 인지 확인
- 빌드 명령어가 `npm run build`인지 확인

## 📁 프로젝트 구조

```
src/
├── routes/
│   ├── +page.svelte          # 메인 페이지
│   ├── +layout.svelte        # 레이아웃
│   └── app.html              # HTML 템플릿
├── lib/
│   ├── types/                # TypeScript 타입 정의
│   ├── data/                 # 템플릿 데이터
│   └── services/             # 프롬프트 생성 서비스
├── app.css                   # 전역 스타일
└── app.html                  # 앱 템플릿
static/
├── favicon.svg               # 파비콘
├── apple-touch-icon.svg      # Apple 터치 아이콘
└── site.webmanifest         # PWA 매니페스트
```

## 🛠️ 기술 스택

- **Frontend**: Svelte 5, SvelteKit
- **Styling**: Tailwind CSS
- **Build**: Vite
- **Deployment**: Cloudflare Pages
- **Language**: TypeScript

## 📝 사용법

1. **5W1H 입력**: 누구를(WHO), 무엇을(WHAT), 언제(WHEN), 어디서(WHERE), 왜(WHY), 어떻게(HOW) 입력
2. **템플릿 선택**: 목적에 맞는 프롬프트 템플릿 선택
3. **기법 설정**: 원하는 AI 프롬프트 엔지니어링 기법 선택
4. **프롬프트 생성**: 최적화된 프롬프트 자동 생성
5. **품질 확인**: 실시간 품질 분석 결과 확인
6. **복사 및 사용**: 생성된 프롬프트를 AI 모델에 사용

## 🔧 개발 환경 설정

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 타입 체크
npm run check

# 린트 실행
npm run lint

# 빌드
npm run build
```

## 📄 라이선스

MIT License - 자유롭게 사용, 수정, 배포 가능합니다.

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

Made with ❤️ using Svelte 5 & Tailwind CSS