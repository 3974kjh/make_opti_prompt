# 프로젝트 문서

LLM 프롬프트 자동 생성기 프로젝트의 종합 문서 모음입니다.

## 📚 문서 목록

### 🎯 프로젝트 기획
- **[REQUIREMENTS.md](./REQUIREMENTS.md)** - 프로젝트 요구사항 명세서
- **[DEV_PLAN.md](./DEV_PLAN.md)** - 개발 계획 및 일정

### 🏗️ 아키텍처 & 구조
- **[PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)** - 프로젝트 디렉토리 구조
- **[DATA_STRUCTURE.md](./DATA_STRUCTURE.md)** - 데이터 모델 및 타입 정의

### 🤖 개발 가이드
- **[CURSOR_CONTEXT.md](./CURSOR_CONTEXT.md)** - Cursor AI를 위한 컨텍스트 가이드
- **[QUICK_NOTES.md](./QUICK_NOTES.md)** - 개발 시 빠른 참고용 노트

## 🎯 프로젝트 개요

### 목적
LLM(Large Language Model)에게 효과적으로 질문하기 위한 프롬프트를 자동 생성하는 웹 애플리케이션입니다. 육하원칙(5W1H)을 기반으로 사용자의 구조화된 입력을 받아 LLM이 이해하기 쉬운 최적화된 프롬프트를 생성합니다.

### 핵심 기능
- 육하원칙 기반 입력 폼 (누가, 무엇을, 언제, 어디서, 왜, 어떻게)
- 다양한 목적별 프롬프트 템플릿
- 실시간 프롬프트 생성 및 미리보기
- 프롬프트 히스토리 관리
- 품질 평가 및 개선 제안

### 기술 스택
- **Frontend**: Svelte 5 (Runes), TypeScript, Tailwind CSS
- **Deployment**: Cloudflare Pages
- **Storage**: localStorage (클라이언트 사이드)

## 🚀 빠른 시작

### 개발 환경 설정
```bash
# 의존성 설치
npm install

# 개발 서버 시작
npm run dev

# 빌드
npm run build
```

### 문서 읽기 순서 (추천)
1. **REQUIREMENTS.md** - 프로젝트가 무엇인지 이해
2. **PROJECT_STRUCTURE.md** - 프로젝트 구조 파악
3. **DEV_PLAN.md** - 개발 계획 및 진행 상황 확인
4. **CURSOR_CONTEXT.md** - 개발 시 참고할 패턴 및 가이드
5. **DATA_STRUCTURE.md** - 데이터 모델 이해
6. **QUICK_NOTES.md** - 개발 시 유용한 팁과 메모

## 📋 개발 상태

### 완료된 작업
- [x] 프로젝트 기획 및 요구사항 정의
- [x] 아키텍처 설계
- [x] 개발 환경 구성
- [x] 문서 작성

### 진행 중인 작업
- [ ] 핵심 컴포넌트 개발
- [ ] 프롬프트 생성 엔진 구현
- [ ] 사용자 인터페이스 구축

### 예정된 작업
- [ ] 데이터 관리 시스템
- [ ] UI/UX 개선
- [ ] 성능 최적화
- [ ] 배포 및 출시

## 🔧 개발 도구 및 설정

### 필수 도구
- Node.js 18+
- npm 또는 yarn
- VS Code (권장)
- Cursor AI (개발 보조)

### 권장 VS Code 확장
- Svelte for VS Code
- TypeScript and JavaScript
- Tailwind CSS IntelliSense
- ESLint
- Prettier

## 📞 문제 해결

### 자주 묻는 질문
1. **Svelte 5 Runes를 어떻게 사용하나요?**
   - [CURSOR_CONTEXT.md](./CURSOR_CONTEXT.md)의 Runes 패턴 섹션 참조

2. **데이터는 어떻게 저장되나요?**
   - [DATA_STRUCTURE.md](./DATA_STRUCTURE.md)의 localStorage 스키마 섹션 참조

3. **새로운 컴포넌트를 어디에 만들어야 하나요?**
   - [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)의 컴포넌트 구조 섹션 참조

### 개발 중 막혔을 때
1. 해당 문서에서 관련 내용 검색
2. [QUICK_NOTES.md](./QUICK_NOTES.md)에서 유사한 문제 확인
3. GitHub Issues 검색
4. Cursor AI에게 문의 (이 문서들을 컨텍스트로 제공)

## 📈 문서 업데이트

### 문서 기여 가이드
- 새로운 기능 추가 시 관련 문서 업데이트
- 아키텍처 변경 시 PROJECT_STRUCTURE.md 수정
- 새로운 데이터 타입 추가 시 DATA_STRUCTURE.md 업데이트
- 개발 팁 발견 시 QUICK_NOTES.md에 추가

### 버전 관리
- 주요 변경사항은 각 문서의 상단에 변경 이력 기록
- 문서 간 일관성 유지
- 예제 코드는 실제 구현과 동기화

---

**마지막 업데이트**: 2024년 12월
**문서 버전**: 1.0.0 