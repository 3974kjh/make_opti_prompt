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

## SEO 및 검색엔진 최적화

### 포함된 SEO 기능
- **robots.txt**: 모든 검색엔진 크롤링 허용
- **sitemap.xml**: 사이트 구조 정보 제공
- **메타태그**: 한국어 최적화된 SEO 메타태그
- **구조화된 데이터**: JSON-LD 형식의 Schema.org 마크업
- **Open Graph**: 소셜 미디어 공유 최적화
- **Twitter Cards**: 트위터 공유 최적화

### 검색엔진 등록 방법

#### 1. 구글 서치 콘솔
1. [Google Search Console](https://search.google.com/search-console) 접속
2. 사이트 추가: `https://make-opti-prompt.pages.dev`
3. **HTML 태그** 인증 방법 선택
4. 제공된 메타태그의 `content` 값을 복사
5. `src/app.html`의 `google-site-verification` 메타태그 `content`에 붙여넣기

#### 2. 네이버 웹마스터도구
1. [네이버 웹마스터도구](https://searchadvisor.naver.com/) 접속
2. 사이트 추가: `https://make-opti-prompt.pages.dev`
3. **HTML 태그** 인증 방법 선택
4. 제공된 메타태그의 `content` 값을 복사
5. `src/app.html`의 `naver-site-verification` 메타태그 `content`에 붙여넣기

#### 3. 다음 검색등록
1. [다음 검색등록](https://register.search.daum.net/index.daum) 접속
2. 사이트 URL 입력: `https://make-opti-prompt.pages.dev`
3. 사이트 정보 입력 및 등록 (별도 인증 불필요)

#### 4. 빙 웹마스터도구
1. [Bing Webmaster Tools](https://www.bing.com/webmasters) 접속
2. 사이트 추가: `https://make-opti-prompt.pages.dev`
3. 구글 서치 콘솔 계정으로 가져오기 권장

### 사이트맵 제출
각 검색엔진 웹마스터도구에서 사이트맵 URL 제출:
- 사이트맵 URL: `https://make-opti-prompt.pages.dev/sitemap.xml`

### 인증 완료 후 할 일
1. 사이트 빌드 & 배포 (변경사항 반영)
2. 각 웹마스터도구에서 인증 확인
3. 사이트맵 제출
4. 색인 요청 (선택사항)

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
static/
├── robots.txt           # 검색엔진 크롤링 설정
├── sitemap.xml          # 사이트맵
├── favicon.svg          # 파비콘 파일들
└── site.webmanifest     # PWA 매니페스트
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