# 데이터 구조 명세서

## 개요
이 문서는 LLM 프롬프트 자동 생성기의 데이터 구조를 정의합니다. 백엔드가 없는 프론트엔드 온리 애플리케이션이므로, localStorage 기반의 클라이언트 사이드 데이터 관리에 중점을 둡니다.

## 핵심 데이터 타입

### 1. PromptFormData
사용자가 입력하는 육하원칙 기반 폼 데이터
```typescript
interface PromptFormData {
  who?: string;      // 누가 - 질문자/대상자 정보
  what?: string;     // 무엇을 - 원하는 결과/내용
  when?: string;     // 언제 - 시간적 맥락
  where?: string;    // 어디서 - 공간적/상황적 맥락
  why?: string;      // 왜 - 목적/이유
  how?: string;      // 어떻게 - 방식/방법
  template: string;  // 선택된 템플릿 ID
}
```

### 2. PromptData
생성되고 저장되는 프롬프트 데이터
```typescript
interface PromptData {
  id: string;              // 고유 식별자 (UUID)
  title: string;           // 프롬프트 제목
  formData: PromptFormData; // 원본 입력 데이터
  generated: string;       // 생성된 최종 프롬프트
  templateId: string;      // 사용된 템플릿 ID
  quality?: number;        // 품질 점수 (0-100)
  tags?: string[];         // 태그 목록
  isFavorite: boolean;     // 즐겨찾기 여부
  createdAt: Date;         // 생성 시간
  updatedAt: Date;         // 수정 시간
}
```

### 3. PromptTemplate
프롬프트 생성 템플릿
```typescript
interface PromptTemplate {
  id: string;               // 템플릿 고유 ID
  name: string;             // 템플릿 이름
  category: PromptCategory; // 카테고리
  description: string;      // 템플릿 설명
  structure: string;        // 프롬프트 구조 템플릿
  requiredFields: string[]; // 필수 입력 필드
  optionalFields: string[]; // 선택 입력 필드
  examples?: string[];      // 예시 프롬프트
  isCustom: boolean;        // 사용자 정의 템플릿 여부
  createdAt: Date;
}
```

### 4. Enums 및 상수
```typescript
enum PromptCategory {
  ANALYSIS = 'analysis',      // 분석
  CREATIVE = 'creative',      // 창작
  PROBLEM_SOLVING = 'problem_solving', // 문제해결
  LEARNING = 'learning',      // 학습
  CODING = 'coding',          // 코딩
  GENERAL = 'general'         // 일반
}

enum QualityLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  EXCELLENT = 'excellent'
}
```

### 5. 사용자 설정
```typescript
interface UserSettings {
  theme: 'light' | 'dark' | 'auto';
  language: 'ko' | 'en';
  defaultTemplate: string;
  autoSave: boolean;
  showQualityIndicator: boolean;
  maxHistoryItems: number;
}
```

## localStorage 스키마

### 저장 키 구조
```typescript
const STORAGE_KEYS = {
  PROMPTS: 'opti_prompt_history',      // 프롬프트 히스토리
  TEMPLATES: 'opti_prompt_templates',   // 사용자 정의 템플릿
  SETTINGS: 'opti_prompt_settings',     // 사용자 설정
  CURRENT_DRAFT: 'opti_prompt_draft'    // 현재 작성 중인 초안
} as const;
```

### 데이터 저장 예시
```typescript
// localStorage에 저장되는 데이터 형식
interface StoredData {
  prompts: PromptData[];
  templates: PromptTemplate[];
  settings: UserSettings;
  currentDraft?: PromptFormData;
}
```

## 기본 템플릿 데이터

### 분석 템플릿
```typescript
const ANALYSIS_TEMPLATE: PromptTemplate = {
  id: 'analysis-basic',
  name: '기본 분석',
  category: PromptCategory.ANALYSIS,
  description: '주제를 체계적으로 분석하기 위한 템플릿',
  structure: '{{who}}에 대해 {{what}}을 {{why}} 목적으로 분석해주세요. {{when}} {{where}}의 맥락에서 {{how}} 방식으로 접근해주세요.',
  requiredFields: ['what', 'why'],
  optionalFields: ['who', 'when', 'where', 'how'],
  examples: [
    '사용자 행동 패턴을 마케팅 전략 수립 목적으로 분석해주세요.'
  ],
  isCustom: false,
  createdAt: new Date()
};
```

### 창작 템플릿
```typescript
const CREATIVE_TEMPLATE: PromptTemplate = {
  id: 'creative-story',
  name: '창작 스토리',
  category: PromptCategory.CREATIVE,
  description: '창의적인 콘텐츠 제작을 위한 템플릿',
  structure: '{{who}}가 {{where}}에서 {{when}} {{what}}을 {{why}} 이유로 {{how}} 방식으로 진행하는 이야기를 작성해주세요.',
  requiredFields: ['what'],
  optionalFields: ['who', 'when', 'where', 'why', 'how'],
  examples: [
    '주인공이 미래 도시에서 AI와 함께 모험을 떠나는 이야기를 작성해주세요.'
  ],
  isCustom: false,
  createdAt: new Date()
};
```

## 데이터 검증 스키마

### 입력 검증 규칙
```typescript
const VALIDATION_RULES = {
  who: {
    maxLength: 100,
    pattern: /^[a-zA-Z가-힣\s\-.,]*$/
  },
  what: {
    maxLength: 200,
    required: true
  },
  when: {
    maxLength: 100
  },
  where: {
    maxLength: 100
  },
  why: {
    maxLength: 150
  },
  how: {
    maxLength: 150
  }
} as const;
```

## 품질 평가 메트릭

### 품질 계산 로직
```typescript
interface QualityMetrics {
  completeness: number;    // 필드 완성도 (0-40점)
  clarity: number;         // 명확성 (0-30점)
  specificity: number;     // 구체성 (0-30점)
  total: number;          // 총점 (0-100점)
}

const calculateQuality = (data: PromptFormData, template: PromptTemplate): QualityMetrics => {
  // 품질 계산 로직 구현
  return {
    completeness: calculateCompleteness(data, template),
    clarity: calculateClarity(data),
    specificity: calculateSpecificity(data),
    total: 0 // 계산된 총점
  };
};
```

## 데이터 마이그레이션

### 버전 관리
```typescript
interface DataVersion {
  version: string;
  description: string;
  migrationFn: (oldData: any) => any;
}

const DATA_MIGRATIONS: DataVersion[] = [
  {
    version: '1.0.0',
    description: '초기 데이터 구조',
    migrationFn: (data) => data
  }
];
```

## 성능 고려사항

### 데이터 크기 제한
- localStorage 총 용량: 5MB 제한
- 프롬프트 히스토리: 최대 1000개
- 개별 프롬프트 크기: 최대 2KB
- 자동 정리: 90일 이상 된 데이터 자동 삭제

### 최적화 전략
```typescript
const OPTIMIZATION_CONFIG = {
  MAX_HISTORY_ITEMS: 1000,
  AUTO_CLEANUP_DAYS: 90,
  COMPRESSION: true,
  BATCH_SAVE: true
} as const;
``` 