# Cursor AI 컨텍스트 가이드

## 프로젝트 개요
이 프로젝트는 **LLM 프롬프트 자동 생성기**입니다. 육하원칙(5W1H)을 기반으로 사용자의 구조화된 입력을 받아 LLM이 이해하기 쉬운 최적화된 프롬프트를 생성하는 웹 애플리케이션입니다.

## 핵심 기술 스택
- **Svelte 5 with Runes**: 최신 반응성 시스템
- **TypeScript**: 타입 안전성
- **Tailwind CSS**: 유틸리티 우선 CSS 프레임워크
- **Cloudflare Pages**: 정적 사이트 호스팅
- **localStorage**: 클라이언트 사이드 데이터 저장

## Svelte 5 Runes 패턴

### 상태 관리
```typescript
// 기본 반응형 상태
let count = $state(0);

// 파생 상태
let doubled = $derived(count * 2);

// 부수 효과
$effect(() => {
  console.log(`Count is now ${count}`);
});

// 조건부 효과
$effect(() => {
  if (count > 10) {
    // 특정 조건에서만 실행
  }
});
```

### 컴포넌트 간 통신
```typescript
// 스토어 패턴
export const promptStore = (() => {
  let data = $state<PromptData | null>(null);
  
  return {
    get data() { return data; },
    set data(value) { data = value; },
    clear: () => data = null
  };
})();
```

## 프로젝트별 패턴

### 1. 프롬프트 데이터 구조
```typescript
interface PromptFormData {
  who?: string;      // 누가 (Who)
  what?: string;     // 무엇을 (What)
  when?: string;     // 언제 (When)
  where?: string;    // 어디서 (Where)
  why?: string;      // 왜 (Why)
  how?: string;      // 어떻게 (How)
  template: string;  // 선택된 템플릿
}
```

### 2. 프롬프트 생성 로직
```typescript
class PromptGenerator {
  static generate(data: PromptFormData, template: PromptTemplate): string {
    // 빈 필드 필터링
    const nonEmptyFields = Object.entries(data)
      .filter(([key, value]) => value && value.trim());
    
    // 템플릿 적용 및 문장 구성
    return this.applyTemplate(nonEmptyFields, template);
  }
}
```

### 3. localStorage 통합 패턴
```typescript
// 반응형 localStorage 스토어
export const createPersistedStore = <T>(key: string, initial: T) => {
  let data = $state<T>(initial);
  
  // 초기 로드
  $effect(() => {
    const stored = localStorage.getItem(key);
    if (stored) {
      data = JSON.parse(stored);
    }
  });
  
  // 자동 저장
  $effect(() => {
    localStorage.setItem(key, JSON.stringify(data));
  });
  
  return {
    get value() { return data; },
    set value(newValue) { data = newValue; }
  };
};
```

## 컴포넌트 아키텍처

### 1. 폼 컴포넌트 패턴
```svelte
<!-- PromptForm.svelte -->
<script lang="ts">
  import type { PromptFormData } from '$lib/types/prompt';
  
  let formData = $state<PromptFormData>({
    who: '',
    what: '',
    when: '',
    where: '',
    why: '',
    how: '',
    template: 'basic'
  });
  
  // 실시간 프롬프트 생성
  let generatedPrompt = $derived(() => {
    return PromptGenerator.generate(formData, selectedTemplate);
  });
</script>
```

### 2. 히스토리 관리 패턴
```svelte
<!-- HistoryPanel.svelte -->
<script lang="ts">
  import { historyStore } from '$lib/stores/historyStore';
  
  let searchQuery = $state('');
  
  // 필터링된 히스토리
  let filteredHistory = $derived(() => {
    if (!searchQuery) return historyStore.items;
    return historyStore.items.filter(item => 
      item.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });
</script>
```

## 스타일링 가이드

### Tailwind CSS 커스텀 설정
```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          900: '#1e3a8a'
        },
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          900: '#111827'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif']
      }
    }
  },
  darkMode: 'class'
}
```

### 컴포넌트 스타일 패턴
```svelte
<!-- 현대적이고 세련된 스타일 -->
<div class="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
  <div class="p-6 space-y-4">
    <!-- 컨텐츠 -->
  </div>
</div>
```

## 데이터 흐름 패턴

### 1. 사용자 입력 → 프롬프트 생성
```typescript
// 입력 받기
const handleInput = (field: string, value: string) => {
  formData[field] = value;
  // Runes가 자동으로 반응성 처리
};

// 자동 생성
$effect(() => {
  if (hasValidInput(formData)) {
    currentPrompt = generatePrompt(formData);
  }
});
```

### 2. 히스토리 저장
```typescript
const saveToHistory = (prompt: GeneratedPrompt) => {
  historyStore.add({
    id: crypto.randomUUID(),
    ...prompt,
    createdAt: new Date(),
    updatedAt: new Date()
  });
};
```

## 성능 최적화 패턴

### 1. 지연 로딩
```svelte
<script lang="ts">
  import { onMount } from 'svelte';
  
  let HistoryPanel: any;
  
  onMount(async () => {
    if (showHistory) {
      HistoryPanel = (await import('$lib/components/HistoryPanel.svelte')).default;
    }
  });
</script>
```

### 2. 메모이제이션
```typescript
const memoizedGenerate = (() => {
  const cache = new Map();
  
  return (data: PromptFormData) => {
    const key = JSON.stringify(data);
    if (cache.has(key)) {
      return cache.get(key);
    }
    
    const result = PromptGenerator.generate(data);
    cache.set(key, result);
    return result;
  };
})();
```

## 테스트 가이드

### 컴포넌트 테스트
```typescript
import { render, screen } from '@testing-library/svelte';
import PromptForm from '$lib/components/PromptForm.svelte';

test('프롬프트 폼이 올바르게 렌더링됨', () => {
  render(PromptForm);
  expect(screen.getByLabelText('누가')).toBeInTheDocument();
  expect(screen.getByLabelText('무엇을')).toBeInTheDocument();
});
```

### 서비스 테스트
```typescript
import { PromptGenerator } from '$lib/services/promptGenerator';

test('프롬프트 생성이 올바르게 작동함', () => {
  const input = { what: '웹사이트 만들기', why: '포트폴리오용' };
  const result = PromptGenerator.generate(input);
  
  expect(result).toContain('웹사이트 만들기');
  expect(result).toContain('포트폴리오용');
});
```

## 배포 최적화

### Cloudflare Pages 설정
```typescript
// svelte.config.js
import adapter from '@sveltejs/adapter-cloudflare-workers';

export default {
  kit: {
    adapter: adapter(),
    prerender: {
      entries: ['*'] // 모든 페이지 사전 렌더링
    }
  }
};
```

## 개발 시 주의사항

1. **Svelte 5 Runes 사용**: `$state`, `$derived`, `$effect` 적극 활용
2. **TypeScript 엄격 모드**: 모든 타입 명시적 정의
3. **접근성**: ARIA 라벨 및 키보드 네비게이션 지원
4. **모바일 우선**: 반응형 디자인 적용
5. **성능**: 불필요한 재렌더링 방지
6. **SEO**: 메타 태그 및 구조화된 데이터 추가

## 🎯 프로젝트 핵심 정보

### 프로젝트 유형
- [x] 웹 애플리케이션 (SPA - Single Page Application)
- [ ] 모바일 앱
- [ ] API 서버
- [ ] 라이브러리/패키지
- [ ] 데스크톱 애플리케이션

### 주요 사용자 시나리오
1. **개발자**: LLM에게 코드 리뷰, 버그 수정, 기능 구현을 요청할 때 정확한 프롬프트 생성
2. **연구자/학습자**: 복잡한 개념 설명, 논문 요약, 학습 자료 생성을 위한 구조화된 질문 작성
3. **일반 사용자**: 창작, 번역, 분석 등 다양한 목적의 LLM 활용 시 효과적인 프롬프트 작성

## 🏗️ 아키텍처 패턴
- **디자인 패턴**: Component-based Architecture (Svelte 5 기반)
- **상태 관리**: Svelte 5 Runes ($state, $derived, $effect)
- **데이터 플로우**: 단방향 데이터 플로우 + localStorage 영속성

## 🔧 개발 시 주의사항

### Svelte 5 Runes 코드 스타일
```typescript
// Svelte 5 Runes 기반 상태 관리 패턴
const promptData = $state({
  who: '',
  when: '',
  where: '',
  what: '',
  how: '',
  why: ''
});

// 파생 상태 (computed)
const generatedPrompt = $derived(() => {
  const parts = Object.entries(promptData)
    .filter(([_, value]) => value.trim() !== '')
    .map(([key, value]) => `${key}: ${value}`);
  return parts.join('\n');
});

// 사이드 이펙트
$effect(() => {
  localStorage.setItem('promptData', JSON.stringify(promptData));
});
```

### 컴포넌트 작성 패턴
```svelte
<!-- PromptForm.svelte -->
<script lang="ts">
  import type { PromptFormData } from '$lib/types/prompt';
  
  interface Props {
    initialData?: PromptFormData;
    onSubmit: (data: PromptFormData) => void;
  }
  
  let { initialData = {}, onSubmit }: Props = $props();
  
  let formData = $state<PromptFormData>({
    who: initialData.who || '',
    what: initialData.what || '',
    // ...
  });
</script>

<form on:submit|preventDefault={() => onSubmit(formData)}>
  <!-- form content -->
</form>
```

### 폴더/파일 생성 가이드라인
- 새 컴포넌트는 `src/lib/components/[카테고리]/[ComponentName].svelte` 패턴
- 서비스는 `src/lib/services/[serviceName].ts` 패턴
- 타입은 `src/lib/types/[typeName].ts` 패턴
- 스토어는 `src/lib/stores/[storeName].ts` 패턴

### 구현 우선순위
1. **1순위**: 육하원칙 기반 프롬프트 입력 폼
2. **2순위**: 프롬프트 자동 생성 로직
3. **3순위**: localStorage 기반 데이터 저장
4. **4순위**: 템플릿 시스템 및 히스토리 기능

## 📋 자주 구현하는 패턴

### localStorage 서비스 패턴
```typescript
// src/lib/services/localStorage.ts
export class LocalStorageService {
  private static instance: LocalStorageService;
  
  static getInstance(): LocalStorageService {
    if (!this.instance) {
      this.instance = new LocalStorageService();
    }
    return this.instance;
  }
  
  save<T>(key: string, data: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  }
  
  load<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Failed to load from localStorage:', error);
      return null;
    }
  }
}
```

### 프롬프트 생성 패턴
```typescript
// src/lib/services/promptGenerator.ts
import type { PromptFormData, GeneratedPrompt } from '$lib/types/prompt';

export function generatePrompt(data: PromptFormData): GeneratedPrompt {
  const sections = [];
  
  if (data.who) sections.push(`**Who:** ${data.who}`);
  if (data.what) sections.push(`**What:** ${data.what}`);
  if (data.when) sections.push(`**When:** ${data.when}`);
  if (data.where) sections.push(`**Where:** ${data.where}`);
  if (data.how) sections.push(`**How:** ${data.how}`);
  if (data.why) sections.push(`**Why:** ${data.why}`);
  
  const prompt = sections.join('\n\n');
  
  return {
    raw: prompt,
    formatted: `Please help me with the following request:\n\n${prompt}`,
    timestamp: new Date().toISOString()
  };
}
```

### 에러 처리 패턴
```typescript
// 프롬프트 생성 중 에러 처리
try {
  const generated = generatePrompt(formData);
  promptStore.setGenerated(generated);
} catch (error) {
  console.error('Prompt generation failed:', error);
  // 사용자에게 친화적인 에러 메시지 표시
  toast.error('프롬프트 생성 중 오류가 발생했습니다.');
}
```

## 🚫 피해야 할 것들
- Svelte 4 문법 사용 ($: reactive statements 대신 $derived 사용)
- 직접적인 DOM 조작 (Svelte의 선언적 방식 준수)
- localStorage에 대용량 데이터 저장 (5MB 제한 고려)
- 하드코딩된 프롬프트 템플릿 (설정 파일로 분리)
- 인라인 스타일 (Tailwind CSS 클래스 사용)

## 💡 자주 하는 질문들

### "새로운 프롬프트 템플릿을 추가하고 싶어요"
1. `src/lib/services/templateService.ts`에 새 템플릿 추가
2. `src/lib/types/template.ts`에 타입 정의 추가
3. `TemplateSelector.svelte`에 UI 옵션 추가
4. 템플릿별 프롬프트 생성 로직 구현

### "육하원칙 외에 다른 입력 방식을 추가하고 싶어요"
1. `src/lib/types/prompt.ts`에 새로운 폼 타입 정의
2. `src/lib/components/forms/`에 새 폼 컴포넌트 생성
3. `promptGenerator.ts`에 해당 타입의 생성 로직 추가
4. 템플릿 시스템에 통합

### "프롬프트 품질을 개선하고 싶어요"
1. 프롬프트 템플릿에 LLM 최적화 패턴 적용
2. 사용자 가이드라인 텍스트 추가
3. 입력 검증 및 제안 기능 구현
4. A/B 테스트를 위한 여러 버전 생성

## 🔄 코드 리뷰 체크리스트
- [ ] Svelte 5 Runes 문법을 올바르게 사용했는가?
- [ ] TypeScript 타입이 정확히 정의되었는가?
- [ ] localStorage 저장/로드 시 에러 처리가 되어있는가?
- [ ] 반응형 디자인이 모든 화면 크기에서 작동하는가?
- [ ] 접근성(a11y) 속성이 적절히 설정되었는가?
- [ ] 컴포넌트가 재사용 가능하도록 설계되었는가?

## 🎨 UI/UX 가이드라인
- **색상**: Tailwind CSS 기본 팔레트 + 다크모드 지원
- **타이포그래피**: 가독성 중심의 폰트 크기 및 line-height
- **간격**: Tailwind의 spacing scale 준수 (4, 8, 16, 24px 등)
- **애니메이션**: 부드러운 transition (200-300ms duration)
- **반응형**: Mobile-first 설계 원칙 