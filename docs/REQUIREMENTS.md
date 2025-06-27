# 프로젝트 요구사항 명세서

## 프로젝트 개요
- **프로젝트명**: LLM 프롬프트 자동 생성기
- **목적**: 육하원칙 기반으로 구조화된 입력을 통해 LLM이 이해하기 쉬운 최적화된 프롬프트 생성
- **기술스택**: Svelte 5 (Runes), TypeScript, Tailwind CSS
- **배포환경**: Cloudflare Pages (무료 버전)
- **아키텍처**: 프론트엔드 온리 (백엔드 없음)
- **저장소**: localStorage

## 핵심 기능 요구사항

### Must Have (필수 기능)
1. **육하원칙 기반 입력 폼**
   - 누가 (Who): 질문자/대상자 정보
   - 무엇을 (What): 원하는 결과/내용
   - 언제 (When): 시간적 맥락
   - 어디서 (Where): 공간적/상황적 맥락
   - 왜 (Why): 목적/이유
   - 어떻게 (How): 방식/방법

2. **프롬프트 생성 엔진**
   - 입력된 항목들을 자연스럽게 연결
   - 빈 항목은 자동으로 생략
   - LLM 최적화된 문장 구조로 변환

3. **템플릿 시스템**
   - 다양한 목적별 프롬프트 템플릿
   - 분석, 창작, 문제해결 등 카테고리별 구분

4. **데이터 영속성**
   - localStorage를 통한 사용자 입력 저장
   - 이전 프롬프트 히스토리 관리

### Should Have (권장 기능)
1. **프롬프트 품질 평가**
   - 생성된 프롬프트의 완성도 점수
   - 개선 제안 사항 제시

2. **복사 및 공유 기능**
   - 생성된 프롬프트 원클릭 복사
   - 프롬프트 구조 공유

3. **다크모드 지원**
   - 현대적인 UI/UX

### Could Have (선택 기능)
1. **프롬프트 북마크**
   - 자주 사용하는 프롬프트 저장
   - 태그 기반 분류

2. **내보내기/가져오기**
   - JSON 형태로 프롬프트 내보내기
   - 백업 및 복원 기능

## 사용자 경험 요구사항
- **직관적인 인터페이스**: 초보자도 쉽게 사용 가능
- **빠른 응답성**: 실시간 프롬프트 생성 미리보기
- **현대적 디자인**: 세련되고 깔끔한 UI
- **모바일 호환성**: 반응형 웹 디자인

## 기술적 요구사항
- **Svelte 5 Runes**: 최신 반응성 시스템 활용
- **TypeScript**: 타입 안전성 보장
- **Tailwind CSS**: 빠른 스타일링
- **Cloudflare Pages**: 정적 사이트 호스팅
- **로컬 스토리지**: 클라이언트 사이드 데이터 관리

## 성능 요구사항
- **로딩 시간**: 첫 페이지 로드 3초 이내
- **번들 크기**: 최적화된 경량 번들
- **접근성**: WCAG 2.1 AA 수준 준수

## 제약사항
- 백엔드 API 없음 (정적 사이트)
- 무료 Cloudflare Pages 제한 내에서 운영
- 브라우저 로컬 스토리지 의존성

## 📚 참고 자료
- [Prompting Guide](https://www.promptingguide.ai/kr/models/chatgpt)
- [Svelte 5 Documentation](https://svelte.dev/docs/svelte/overview)
- [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs) 