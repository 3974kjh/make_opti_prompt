# Make Opti Prompt

AI 프롬프트 최적화 도구 - 5W1H 방식으로 체계적인 프롬프트를 생성합니다.

## 기능

- **5W1H 기반 프롬프트 생성**: Who, What, When, Where, Why, How 요소를 체계적으로 정리
- **다양한 프롬프트 기법**: Chain of Thought, Tree of Thoughts, Self-Consistency 등
- **템플릿 시스템**: 사전 정의된 템플릿과 사용자 정의 템플릿 지원
- **고급 옵션**: 전문가 역할, 출력 형식, 추론 과정 포함 등
- **반응형 디자인**: 모바일과 데스크톱 환경 모두 지원

## 개발 환경 설정

### 필수 요구사항
- Node.js 18 이상
- npm 또는 pnpm

### 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 빌드
npm run build

# 빌드된 파일 미리보기
npm run preview
```

## 배포

### Cloudflare Pages 배포

1. **GitHub 저장소 연결**
   - Cloudflare Pages 대시보드에서 "Create a project" 선택
   - GitHub 저장소 연결 (`3974kjh/make_opti_prompt`)

2. **빌드 설정**
   - **Framework preset**: SvelteKit
   - **Build command**: `npm run build`
   - **Build output directory**: `build`
   - **Node.js version**: 18 또는 20

3. **환경 변수** (선택사항)
   - 필요한 경우 환경 변수 설정

4. **배포 실행**
   - "Save and Deploy" 클릭하여 배포 시작

### 수동 배포 (Wrangler CLI)

```bash
# Wrangler 설치 (전역)
npm install -g wrangler

# Cloudflare 로그인
wrangler login

# 배포
wrangler pages deploy build --project-name=make-opti-prompt

# 또는 배포 스크립트 사용
npm run deploy
```

### 배포 스크립트

Windows:
```bash
.\deploy.bat
```

Unix/Linux/macOS:
```bash
./deploy.sh
```

## 프로젝트 구조

```
src/
├── routes/
│   ├── +layout.svelte    # 레이아웃
│   ├── +layout.js        # 레이아웃 설정
│   ├── +page.svelte      # 메인 페이지
│   └── +page.js          # 페이지 설정
├── lib/
│   ├── components/       # 재사용 가능한 컴포넌트
│   ├── stores/          # Svelte 스토어
│   └── utils/           # 유틸리티 함수
└── app.html             # HTML 템플릿
```

## 기술 스택

- **프레임워크**: SvelteKit
- **스타일링**: Tailwind CSS
- **빌드 도구**: Vite
- **배포**: Cloudflare Pages
- **언어**: TypeScript

## 기여

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 라이선스

MIT License - 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.