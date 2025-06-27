# 빠른 메모 & 할 일

> LLM 프롬프트 자동 생성기 개발 중 생각나는 아이디어, 해결해야 할 문제들, 임시 할 일들을 여기에 기록합니다.

## 📝 오늘의 할 일
- [x] 프로젝트 문서 작성 완료
- [x] Svelte 5 프로젝트 구조 설계
- [ ] 기본 프로젝트 셋업 (Vite + Svelte 5 + TypeScript)
- [ ] Tailwind CSS 설정 및 기본 스타일 구성
- [ ] 육하원칙 입력 폼 컴포넌트 개발
- [ ] 프롬프트 생성 로직 구현

## 💡 아이디어 / 개선사항

### 프롬프트 품질 향상
- 각 필드별 가이드라인 텍스트 제공 (툴팁 또는 사이드바)
- LLM별 최적화된 프롬프트 포맷 제공 (ChatGPT, Claude, Gemini 등)
- 프롬프트 길이에 따른 경고 시스템
- 실시간 프롬프트 미리보기

### 사용자 경험 개선
- 드래그 앤 드롭으로 필드 순서 변경
- 키보드 단축키 지원 (Ctrl+Enter로 생성, Ctrl+C로 복사)
- 자동 저장 기능 (Draft 모드)
- 다국어 지원 (한국어, 영어)

### 템플릿 시스템
- 업무별 특화 템플릿 (개발, 마케팅, 연구, 창작)
- 사용자 커스텀 템플릿 생성/수정 기능
- 템플릿 공유 기능 (URL 생성)
- 인기 템플릿 랭킹

## 🐛 발견된 버그들
- 현재까지 버그 없음 (프로젝트 시작 단계)

## ❓ 질문 / 확인 필요한 것들

### 기술적 질문
- Svelte 5 Runes에서 복잡한 폼 상태 관리 베스트 프랙티스?
- localStorage 5MB 제한에 걸리지 않도록 하는 데이터 압축 방법?
- Cloudflare Pages에서 SPA 라우팅 설정 방법?

### 디자인 관련 질문
- 다크모드에서 텍스트 가독성 최적화 방법?
- 모바일에서 긴 텍스트 입력 시 UX 개선 방안?
- 프롬프트 결과를 시각적으로 구분하는 방법?

### 비즈니스 로직 관련 질문
- 히스토리 최대 보관 개수는 몇 개가 적절한가?
- 자주 사용되는 프롬프트 패턴은 무엇인가?
- 사용자가 가장 필요로 하는 템플릿 타입은?

## 🔍 조사 필요한 기술들

### Svelte 5 관련
- Runes의 성능 최적화 패턴
- `$state.frozen()`을 사용해야 하는 케이스
- 컴포넌트 간 상태 공유 베스트 프랙티스

### 배포 관련
- Cloudflare Pages에서 환경변수 관리
- GitHub Actions로 자동 배포 설정
- 도메인 연결 및 HTTPS 설정

### 사용자 경험
- 웹 접근성(a11y) 가이드라인 적용
- 모바일 터치 인터페이스 최적화
- 오프라인 지원 (Service Worker)

## 📚 학습 목록

### 우선순위 높음
- [Svelte 5 Runes 공식 문서](https://svelte.dev/docs/svelte/overview)
- [Tailwind CSS v3 새로운 기능들](https://tailwindcss.com/docs)
- [TypeScript 5.0+ 새로운 기능들](https://www.typescriptlang.org/docs/)

### 우선순위 중간
- [Cloudflare Pages 배포 가이드](https://developers.cloudflare.com/pages/)
- [웹 접근성 체크리스트](https://www.a11yproject.com/checklist/)
- [Progressive Web App 개발 가이드](https://web.dev/progressive-web-apps/)

## ⚠️ 주의사항 / 중요한 노트

### 개발 중 주의해야 할 점
- Svelte 4와 5의 문법 차이점 주의 (특히 reactive statements)
- localStorage 용량 제한으로 인한 데이터 손실 방지
- 다양한 브라우저에서의 localStorage 지원 여부 확인
- 사용자 입력 데이터 XSS 방지 처리

### 놓치기 쉬운 부분
- 긴 프롬프트 생성 시 성능 최적화
- 모바일에서의 키보드 UX (특히 textarea 확장)
- 다크모드 전환 시 깜빡임 방지
- 브라우저 뒤로가기 버튼 지원

### 중요한 결정사항
- 프롬프트 생성 알고리즘: 단순 템플릿 기반 vs AI 기반
- 데이터 저장 방식: localStorage vs IndexedDB
- 테마 시스템: CSS 변수 vs Tailwind dark mode
- 컴포넌트 구조: 단일 페이지 vs 다중 라우팅

## 📞 연락/확인 필요

### 개발 관련
- Svelte 커뮤니티에서 Runes 베스트 프랙티스 질문
- Cloudflare 무료 계정 제한사항 상세 확인
- 웹 접근성 전문가 컨설팅 (필요시)

### 사용자 피드백
- 베타 테스터 모집 (개발자, 연구자 중심)
- 프롬프트 품질 검증을 위한 LLM 전문가 의견
- UX 개선을 위한 사용성 테스트

## 🎯 다음 마일스톤

### v1.0 (MVP) - 2주 목표
- [x] 기본 육하원칙 입력 폼
- [ ] 프롬프트 자동 생성 기능
- [ ] 히스토리 저장/조회
- [ ] 클립보드 복사 기능
- [ ] 반응형 디자인
- [ ] Cloudflare Pages 배포

### v1.1 (개선) - 4주 목표
- [ ] 다양한 템플릿 추가 (5-7개)
- [ ] 다크모드 지원
- [ ] 즐겨찾기 기능
- [ ] 검색 및 필터링
- [ ] 성능 최적화

### v1.2 (고급) - 6주 목표
- [ ] 커스텀 템플릿 생성
- [ ] 프롬프트 공유 기능
- [ ] 다국어 지원
- [ ] PWA 기능
- [ ] 사용 통계 대시보드

---
*마지막 업데이트: 2024-12-25*

# 개발 노트

## 🚀 빠른 시작
```bash
npm install
npm run dev
```

## 🎯 현재 개발 상태
- [x] 프로젝트 구조 설계 완료
- [x] 기본 문서 작성 완료
- [ ] 핵심 컴포넌트 개발 중
- [ ] 프롬프트 생성 엔진 구현 예정
- [ ] localStorage 통합 예정

## 💡 아이디어 메모

### 프롬프트 템플릿 아이디어
1. **코딩 도움**: 디버깅, 코드 리뷰, 최적화
2. **학습 지원**: 개념 설명, 예제 요청, 퀴즈 생성
3. **비즈니스**: 기획서 작성, 마케팅 전략, 프레젠테이션
4. **창작**: 소설, 시나리오, 블로그 포스트
5. **연구**: 논문 요약, 문헌 검토, 가설 검증

### UI/UX 개선 아이디어
- 드래그 앤 드롭으로 필드 순서 변경
- 자동 완성 기능 (이전 입력 기반)
- 프롬프트 공유를 위한 QR 코드 생성
- 음성 입력 지원 (Web Speech API)
- 다국어 지원 (한국어, 영어)

### 고급 기능 아이디어
- AI 기반 프롬프트 개선 제안
- 사용자 맞춤 템플릿 자동 생성
- 프롬프트 효과성 분석 및 통계
- 팀 협업을 위한 프롬프트 공유 기능

## 🔧 기술적 메모

### Svelte 5 Runes 팁
```typescript
// 반응성 디버깅
$effect(() => {
  console.log('상태 변경:', { formData });
});

// 조건부 효과
$effect(() => {
  if (formData.what && formData.why) {
    generatePrompt();
  }
});

// 정리 작업
$effect(() => {
  const timer = setInterval(() => {
    autoSave();
  }, 5000);
  
  return () => clearInterval(timer);
});
```

### localStorage 베스트 프랙티스
```typescript
// 안전한 localStorage 사용
const safeLocalStorage = {
  getItem: (key: string) => {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  setItem: (key: string, value: string) => {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch {
      return false;
    }
  }
};
```

### 성능 최적화 메모
- `$derived`로 계산 최적화
- 컴포넌트 지연 로딩
- 번들 분할로 초기 로딩 최적화
- 이미지 최적화 (WebP 사용)

## 🐛 알려진 이슈

### 해결 예정
- [ ] 긴 텍스트 입력 시 UI 레이아웃 깨짐
- [ ] 모바일에서 키보드 활성화 시 레이아웃 변경
- [ ] 다크모드 전환 시 깜빡임

### 브라우저 호환성
- Chrome 90+: ✅ 완전 지원
- Firefox 88+: ✅ 완전 지원  
- Safari 14+: ⚠️ 일부 CSS 이슈
- Edge 90+: ✅ 완전 지원

## 📝 코딩 컨벤션

### 파일 구조
```
ComponentName.svelte     # 컴포넌트
serviceName.ts          # 서비스
storeName.ts           # 스토어
utils.ts               # 유틸리티
types.ts               # 타입 정의
```

### 네이밍 규칙
- 컴포넌트: PascalCase
- 함수/변수: camelCase
- 상수: UPPER_SNAKE_CASE
- CSS 클래스: kebab-case

### Git 커밋 메시지
```
feat: 새로운 기능 추가
fix: 버그 수정
docs: 문서 수정
style: 스타일 변경
refactor: 코드 리팩토링
test: 테스트 추가
chore: 빌드/설정 변경
```

## 🎨 디자인 토큰

### 색상 팔레트
```css
:root {
  --primary-50: #eff6ff;
  --primary-500: #3b82f6;
  --primary-900: #1e3a8a;
  
  --gray-50: #f9fafb;
  --gray-100: #f3f4f6;
  --gray-900: #111827;
  
  --success: #10b981;
  --warning: #f59e0b;
  --error: #ef4444;
}
```

### 타이포그래피
```css
.text-h1 { @apply text-4xl font-bold; }
.text-h2 { @apply text-3xl font-semibold; }
.text-h3 { @apply text-2xl font-medium; }
.text-body { @apply text-base; }
.text-caption { @apply text-sm text-gray-600; }
```

## 📋 체크리스트

### 개발 완료 체크
- [ ] 모든 컴포넌트 타입 정의
- [ ] 접근성 ARIA 라벨 추가
- [ ] 모바일 반응형 테스트
- [ ] 다크모드 스타일 적용
- [ ] 에러 핸들링 구현
- [ ] 로딩 상태 UI 추가

### 배포 전 체크
- [ ] 번들 크기 최적화
- [ ] 이미지 압축 및 최적화
- [ ] SEO 메타 태그 추가
- [ ] robots.txt, sitemap.xml 생성
- [ ] 성능 측정 (Lighthouse 90+)
- [ ] 크로스 브라우저 테스트

## 🔗 유용한 링크

### 공식 문서
- [Svelte 5 문서](https://svelte.dev/docs/svelte/overview)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Cloudflare Pages](https://developers.cloudflare.com/pages/)

### 참고 자료
- [프롬프트 엔지니어링 가이드](https://www.promptingguide.ai/kr/models/chatgpt)
- [접근성 가이드](https://web.dev/accessibility/)
- [성능 최적화](https://web.dev/performance/)

## 📞 문제 해결

### 자주 발생하는 에러
1. **타입 에러**: 모든 인터페이스 정의 확인
2. **빌드 실패**: 의존성 버전 충돌 확인
3. **런타임 에러**: localStorage 접근 권한 확인

### 디버깅 팁
- Chrome DevTools 활용
- Svelte DevTools 설치
- console.log보다는 debugger 사용
- 네트워크 탭에서 리소스 로딩 확인

## 🎯 다음 단계
1. 기본 프롬프트 생성 엔진 구현
2. 사용자 입력 폼 컴포넌트 개발
3. 템플릿 시스템 구축
4. localStorage 통합
5. UI/UX 폴리싱 