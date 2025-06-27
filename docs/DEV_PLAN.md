# 개발 계획서

## 🗓️ 개발 일정

### Phase 1: 프로젝트 초기 설정 (1-2일)
- [x] 프로젝트 구조 설계
- [x] Svelte 5 + TypeScript 환경 구축
- [x] Tailwind CSS 설정
- [x] Cloudflare Pages 배포 환경 준비
- [x] 기본 라우팅 구조 설정

### Phase 2: 핵심 기능 개발 (3-5일)
- [ ] 육하원칙 입력 폼 컴포넌트
- [ ] 프롬프트 생성 엔진 구현
- [ ] 템플릿 시스템 개발
- [ ] 실시간 미리보기 기능
- [ ] 기본 프롬프트 템플릿 작성

### Phase 3: 데이터 관리 (2-3일)
- [ ] localStorage 통합
- [ ] 프롬프트 히스토리 관리
- [ ] 데이터 Import/Export 기능
- [ ] 상태 관리 (Svelte Stores)

### Phase 4: UI/UX 개선 (2-3일)
- [ ] 반응형 디자인 구현
- [ ] 다크모드 지원
- [ ] 애니메이션 및 트랜지션
- [ ] 접근성 개선
- [ ] 모바일 최적화

### Phase 5: 최적화 및 배포 (1-2일)
- [ ] 성능 최적화
- [ ] 번들 크기 최적화
- [ ] Cloudflare Pages 배포
- [ ] 도메인 연결 (선택사항)
- [ ] 사용자 테스트 및 피드백 수집

## 🎯 우선순위 매트릭스

### 🔴 높음 (High Priority)
- 육하원칙 기반 입력 폼
- 프롬프트 자동 생성 로직
- 빈 필드 자동 제외 기능
- 프롬프트 복사 기능
- localStorage 데이터 저장

### 🟡 중간 (Medium Priority)
- 프롬프트 템플릿 다양화
- 히스토리 관리 기능
- 반응형 디자인
- 테마 기능

### 🟢 낮음 (Low Priority)
- 프롬프트 공유 기능
- 커스터마이징 기능
- 즐겨찾기 관리
- 고급 애니메이션

## 🛠️ 기술적 고려사항
- **Svelte 5 Runes**: $state, $derived, $effect를 활용한 반응형 상태 관리
- **TypeScript**: 타입 안전성 확보 및 개발 생산성 향상
- **Tailwind CSS**: 빠른 UI 개발 및 일관성 있는 디자인 시스템
- **localStorage**: 사용자 데이터 영속성 보장
- **Vite**: 빠른 개발 서버 및 최적화된 번들링
- **Cloudflare Pages**: 무료 호스팅 제약사항 고려

## 📝 구현 시 주의사항
- **Svelte 5 Runes 문법**: `$state()`, `$derived()`, `$effect()` 올바른 사용
- **타입 안전성**: 모든 컴포넌트와 함수에 적절한 TypeScript 타입 정의
- **성능 최적화**: 큰 객체의 reactivity 최소화, 필요시 `$state.frozen()` 사용
- **localStorage 관리**: 데이터 크기 제한 고려, 에러 핸들링 필수
- **접근성**: ARIA 속성, 키보드 네비게이션, 색상 대비 등 고려
- **반응형 디자인**: 모바일 우선 설계(Mobile-first)

## 🧪 테스트 전략
- **단위 테스트**: 핵심 로직 함수
- **컴포넌트 테스트**: Svelte 컴포넌트
- **E2E 테스트**: 주요 사용자 플로우
- **접근성 테스트**: 스크린 리더 호환성

## 📚 아키텍처 설계
```
src/
├── lib/
│   ├── components/     # 재사용 가능한 컴포넌트
│   ├── stores/        # Svelte 스토어 (상태 관리)
│   ├── services/      # 비즈니스 로직
│   ├── types/         # TypeScript 타입 정의
│   └── utils/         # 유틸리티 함수
├── routes/            # 페이지 라우트
└── app.html           # HTML 템플릿
```

## 📚 핵심 컴포넌트 계획
1. **PromptForm.svelte**: 육하원칙 입력 폼
2. **PromptPreview.svelte**: 실시간 프롬프트 미리보기
3. **TemplateSelector.svelte**: 템플릿 선택 컴포넌트
4. **HistoryPanel.svelte**: 프롬프트 히스토리
5. **QualityIndicator.svelte**: 프롬프트 품질 표시

## 📚 상태 관리 계획
- **promptStore**: 현재 프롬프트 상태
- **historyStore**: 프롬프트 히스토리
- **settingsStore**: 사용자 설정 (다크모드 등)
- **templateStore**: 템플릿 데이터

## 📚 데이터 구조 설계

### 📚 프롬프트 데이터 모델
```typescript
interface PromptData {
  id: string;
  title: string;
  who?: string;      // 누가
  what?: string;     // 무엇을
  when?: string;     // 언제
  where?: string;    // 어디서
  why?: string;      // 왜
  how?: string;      // 어떻게
  template: string;  // 사용된 템플릿
  generated: string; // 생성된 프롬프트
  createdAt: Date;
  updatedAt: Date;
}
```

### 📚 템플릿 시스템
```typescript
interface PromptTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  structure: string; // 프롬프트 구조 템플릿
  fields: string[];  // 필수/선택 필드
}
```

## 📚 성능 최적화 계획
- **코드 스플리팅**: 페이지별 번들 분리
- **Lazy Loading**: 필요한 컴포넌트만 로드
- **이미지 최적화**: WebP 형식 사용
- **CSS 최적화**: 미사용 Tailwind 클래스 제거
- **캐싱 전략**: 정적 자산 캐싱 설정

## 📚 배포 전략
- **Git 기반 배포**: GitHub → Cloudflare Pages 연동
- **프리뷰 배포**: PR별 미리보기 환경
- **프로덕션 배포**: 메인 브랜치 자동 배포
- **도메인 설정**: 커스텀 도메인 연결 (선택)

## 📚 마일스톤
- **MVP (최소 기능 제품)**: Phase 2 완료 시점
- **베타 버전**: Phase 4 완료 시점
- **정식 출시**: Phase 5 완료 시점 